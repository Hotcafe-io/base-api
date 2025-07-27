import { readdirSync } from "fs";
import { Router } from "express";
import path from "path";

import express from "express";

export interface IFunctionDefinition {
    method: "GET" | "POST" | "PUT" | "DELETE";
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
            if (!["GET", "POST", "PUT", "DELETE"].includes(fn.method))
                errors.push(`functions[${idx}].method is invalid or missing.`);
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
        const errors = getRouteModuleErrors(routeModule);
        if (errors.length > 0) {
            throw new Error(`Route file ${filePath} does not export a valid route definition:\n${errors.join("\n")}`);
        }
        for (const fn of routeModule.functions) {
            const middlewares = fn.middlewares || [];
            const route: RouteDefinition = {
                path: filePath,
                functions: [
                    {
                        method: fn.method,
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