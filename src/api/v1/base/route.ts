import { Request, Response } from "express";
import { IFunctionDefinition, methodType } from "@/types/base";

// Example function with method in name
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

export const functions: IFunctionDefinition[] = [
    {
        handler: postFn,
        middlewares: [],
        isPublic: true,
    }
]
