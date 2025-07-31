import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const routesDir = path.join("./src/api");
const clientDir = path.join("./client");
const indexFile = path.join(clientDir, "index.ts");
const typesFile = path.join(clientDir, "types.ts");

function walkDir(dir: string, fileList: string[] = []): string[] {
    for (const file of readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (statSync(fullPath).isDirectory()) {
            walkDir(fullPath, fileList);
        } else if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function getMethodFromFunctionName(fn: Function): string {
    const match = fn.name.match(/^(get|post|put|delete|patch)/i);
    if (!match) throw new Error(`Function ${fn.name} must start with HTTP method.`);
    return match[0].toLowerCase();
}

function extractFullSchema(raw: string, schemaName: string): string {
    const startRegex = new RegExp(`const\\s+${schemaName}\\s*=\\s*z\\.object\\(`);
    const lines = raw.split("\n");
    let capturing = false;
    let openParens = 0;
    let schemaLines: string[] = [];

    for (const line of lines) {
        if (!capturing) {
            if (startRegex.test(line)) {
                capturing = true;
                openParens = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
                schemaLines.push(line);
                if (openParens === 0) break;
            }
        } else {
            schemaLines.push(line);
            openParens += (line.match(/\(/g) || []).length;
            openParens -= (line.match(/\)/g) || []).length;
            if (openParens === 0) break;
        }
    }
    if (!capturing) throw new Error(`Schema ${schemaName} not found`);
    return schemaLines.join("\n");
}

if (!existsSync(clientDir)) {
    mkdirSync(clientDir, { recursive: true });
}

type HandlerInfo = {
    method: string;
    routePath: string;
    reqType: string;
    resType: string;
    reqSchemaName: string;
    resSchemaName: string;
};

type RouteNode = {
    [key: string]: RouteNode | HandlerInfo;
};

const apiStructure: Record<string, RouteNode> = {};

let typesFileContent = `// Auto-generated types and parsers\nimport { z } from "zod";\n\n`;

const routeFiles = walkDir(routesDir);

function setNested(obj: any, keys: string[], value: any) {
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

for (const filePath of routeFiles) {
    const mod = require(path.resolve(filePath));
    const raw = readFileSync(filePath, "utf-8");
    const relativeRoute = filePath.replace(routesDir, "").replace(/\\/g, "/").replace(/\.ts$/, "");
    const routeParts = relativeRoute.split("/").filter(Boolean);
    const version = routeParts[0] || "v1";
    const routePathParts = routeParts.slice(1);

    if (!mod.functions || !Array.isArray(mod.functions)) {
        console.warn(`⚠️  Warning: ${filePath} does not export 'functions' array. Skipping.`);
        continue;
    }

    for (const fn of mod.functions) {
        const method = getMethodFromFunctionName(fn.handler);
        const handlerName = fn.handler.name;

        const originalReqSchemaName = `${method}ReqSchema`;
        const originalResSchemaName = `${method}ResSchema`;

        const joinedRoute = routePathParts.join("_") || "root";

        const reqSchemaName = `${version}_${joinedRoute}_${method}ReqSchema`.replace(/[^a-zA-Z0-9_]/g, "");
        const resSchemaName = `${version}_${joinedRoute}_${method}ResSchema`.replace(/[^a-zA-Z0-9_]/g, "");

        const originalReqSchemaSrc = extractFullSchema(raw, originalReqSchemaName);
        const originalResSchemaSrc = extractFullSchema(raw, originalResSchemaName);

        const reqSchemaSrc = originalReqSchemaSrc.replace(
            new RegExp(`(export\\s+)?const\\s+${originalReqSchemaName}\\s*=`),
            `export const ${reqSchemaName} =`
        );
        const resSchemaSrc = originalResSchemaSrc.replace(
            new RegExp(`(export\\s+)?const\\s+${originalResSchemaName}\\s*=`),
            `export const ${resSchemaName} =`
        );

        const reqType = `${reqSchemaName}Type`;
        const resType = `${resSchemaName}Type`;

        typesFileContent += `${reqSchemaSrc}\nexport type ${reqType} = z.infer<typeof ${reqSchemaName}>;\n\n`;
        typesFileContent += `${resSchemaSrc}\nexport type ${resType} = z.infer<typeof ${resSchemaName}>;\n\n`;

        if (!apiStructure[version]) apiStructure[version] = {};

        setNested(apiStructure[version], [...routePathParts, handlerName], {
            method,
            routePath: "/api" + relativeRoute,
            reqType,
            resType,
            reqSchemaName,
            resSchemaName,
        });
    }
}

writeFileSync(typesFile, typesFileContent);

function generateClientLevel(obj: RouteNode, indent = "    "): string {
    let content = "{\n";
    const pad = indent + "  ";
    for (const [key, value] of Object.entries(obj)) {
        if ("method" in value) {
            const info = value as HandlerInfo;
            const isGetLike = info.method === "get" || info.method === "delete";
            const argName = isGetLike ? "params" : "data";
            const axiosConfig = isGetLike ? "{ params }" : "data";

            content +=
                `${pad}${key}: async (${argName}: utils.${info.reqType}): Promise<utils.${info.resType}> => {\n` +
                `${pad}  const res = await this.axiosInstance.${info.method}("${info.routePath}", ${axiosConfig});\n` +
                `${pad}  return utils.${info.resSchemaName}.parse(res.data);\n` +
                `${pad}},\n`;
        } else {
            content += `${pad}${key}: ${generateClientLevel(value as RouteNode, pad)},\n`;
        }
    }
    content += indent + "}";
    return content;
}

let indexFileContent = `// Auto-generated API client\nimport axios from "axios";\nimport * as utils from "./types";\n\n`;

indexFileContent += `class ApiServiceClass {\n  private axiosInstance = axios.create({ baseURL: process.env.API_BASE_URL ?? "", withCredentials: true });\n\n`;

for (const [version, routes] of Object.entries(apiStructure)) {
    indexFileContent += `  public readonly ${version} = ${generateClientLevel(routes)};\n`;
}

indexFileContent += `}\n\nexport const ApiService = new ApiServiceClass();\n`;

writeFileSync(indexFile, indexFileContent);

console.log("✅ API client generated at ./client");
