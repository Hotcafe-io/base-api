import { IFunctionDefinition } from "@/config/loader";
import { Request, Response, RequestHandler } from "express";
import { z } from "zod";

export const postReqSchema = z.object({})
export const postResSchema = z.object({});
export const postMiddlewares: RequestHandler[] = [];
export async function postFn(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({});
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: "Error processing request",
        });
    }
}

export const getReqSchema = z.object({});
export const getResSchema = z.object({});
export const getMiddlewares: RequestHandler[] = [];
export async function getFn(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({});
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: "Error processing request",
        });
    }
}

export const putReqSchema = z.object({});
export const putResSchema = z.object({});
export const putMiddlewares: RequestHandler[] = [];
export async function putFn(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({});
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: "Error processing request",
        });
    }
}

export const patchReqSchema = z.object({});
export const patchResSchema = z.object({});
export const patchMiddlewares: RequestHandler[] = [];
export async function patchFn(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({});
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: "Error processing request",
        });
    }
}

export const deleteReqSchema = z.object({});
export const deleteResSchema = z.object({});
export const deleteMiddlewares: RequestHandler[] = [];
export async function deleteBaseData(req: Request, res: Response): Promise<void> {
    try {
        res.status(200).json({});
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: "Error processing request",
        });
    }
}


export const functions: Omit<IFunctionDefinition, "method">[] = [
    {
        handler: postFn,
        middlewares: postMiddlewares,
        requestSchema: postReqSchema,
        responseSchema: postResSchema,
    },
    {
        handler: getFn, 
        middlewares: getMiddlewares,
        requestSchema: getReqSchema,
        responseSchema: getResSchema,
    },
    {
        handler: putFn,
        middlewares: putMiddlewares,
        requestSchema: putReqSchema,
        responseSchema: putResSchema,
    },
    {
        handler: deleteBaseData,
        middlewares: deleteMiddlewares,
        requestSchema: deleteReqSchema,
        responseSchema: deleteResSchema,
    },
    {
        handler: patchFn,
        middlewares: patchMiddlewares,
        requestSchema: patchReqSchema,
        responseSchema: patchResSchema,
    }
]
