import { Request, Response } from "express";
import { COOKIE_OPTIONS } from "@/utils";
import { UserResponse } from "@/types";
import { IFunctionDefinition } from "@/config/loader";
import { z } from "zod";

const postReqSchema = z.object();
const postResSchema = z.object({
    message: z.string(),
});

export async function postLogout(req: Request, res: Response): Promise<void> {
    try {
        res.cookie("token", "", { ...COOKIE_OPTIONS });
        res.status(200).json({ message: UserResponse.SuccessMessage.LOGOUT });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
}

export const functions: Omit<IFunctionDefinition, "method">[] = [
    {
        handler: postLogout,
        middlewares: [],
        requestSchema: postReqSchema,
        responseSchema: postResSchema,
    }
]