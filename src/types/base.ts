import express from "express"

export type methodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface IFunctionDefinition {
    handler: (req: express.Request, res: express.Response) => Promise<void>;
    middlewares?: express.RequestHandler[];
    isPublic: boolean;
}

export interface RouteDefinition {
    path: string;
    functions: IFunctionDefinition[];
}