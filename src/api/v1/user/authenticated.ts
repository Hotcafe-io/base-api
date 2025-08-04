import { IFunctionDefinition } from "@/config/loader";
import { Request, Response, RequestHandler } from "express";
import { z } from "zod";

export const getReqSchema = z.object({});
export const getResSchema = z.object({});
export const getMiddlewares: RequestHandler[] = [];
export async function getFn(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.user!

        if (!email) throw new Error("Not logged in")

        res.status(200).json({
            message: "User is logged in"
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(201).json({
            message: "Not authenticated",
        });
    }
}

export const functions: Omit<IFunctionDefinition, "method">[] = [
    {
        handler: getFn,
        middlewares: getMiddlewares,
        requestSchema: getReqSchema,
        responseSchema: getResSchema,
    }
]