import express from "express"

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