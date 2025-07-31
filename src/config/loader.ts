import { readdirSync } from "fs";
import path from "path";

import express from "express";
import { methodType } from "@/types/base";

export interface IFunctionDefinition {
    method: methodType;
    handler: (req: express.Request, res: express.Response) => Promise<void>;
    middlewares?: express.RequestHandler[];
    isPublic: boolean;
}

export interface RouteDefinition {
    path: string;
    functions: IFunctionDefinition[];
}

function getRouteModuleErrors(module: any): string[] {
    const errors: string[] = [];
    if (typeof module !== "object") errors.push("Module is not an object.");
    if (!Array.isArray(module?.functions)) errors.push("Missing or invalid 'functions' (should be array).");

    if (Array.isArray(module?.functions)) {
        module.functions.forEach((fn: any, idx: number) => {
            if (typeof fn.handler !== "function")
                errors.push(`functions[${idx}].handler is missing or not a function.`);
            if (typeof fn.isPublic !== "boolean")
                errors.push(`functions[${idx}].isPublic is missing or not a boolean.`);
            if (fn.middlewares && !Array.isArray(fn.middlewares))
                errors.push(`functions[${idx}].middlewares is present but not an array.`);
        });
    }
    return errors;
}

function walkDir(dir: string, fileList: string[] = []): string[] {
    for (const file of readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (require("fs").statSync(fullPath).isDirectory()) {
            walkDir(fullPath, fileList);
        } else if (file.endsWith(".ts")) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}
export function loadRoutes(): RouteDefinition[] {
    const routes: RouteDefinition[] = [];
    const routesDir = path.join(__dirname, "../api");
    const routeFiles = walkDir(routesDir);

    for (const filePath of routeFiles) {
        const routeModule = require(filePath);
        const routeName = "/api" + filePath.replace(routesDir, "").replace(/\\/g, "/").replace(/\.ts$/, "");
        const errors = getRouteModuleErrors(routeModule);
        if (errors.length > 0) {
            throw new Error(`Route file ${filePath} does not export a valid route definition:\n${errors.join("\n")}`);
        }
        for (const fn of routeModule.functions) {
            // Utility to extract method from function name
            function getMethodFromFunctionName(fn: Function): methodType {
                const match = fn.name.match(/^(get|post|put|delete|patch)/i);

                if(!match) {
                    throw new Error(`Function ${fn.name} does not follow naming convention for method extraction. Path: ${filePath} Route: ${routeName} function name: ${fn.name} should start with 'get', 'post', 'put', 'delete', or 'patch'.`);
                }

                return match[0].toUpperCase() as methodType;
            }

            const middlewares = fn.middlewares || [];
            const route: RouteDefinition = {
                path: routeName,
                functions: [
                    {
                        method: getMethodFromFunctionName(fn.handler),
                        handler: fn.handler,
                        middlewares,
                        isPublic: fn.isPublic,
                    },
                ],
            };
            routes.push(route);
        }
    }

    return routes;
}