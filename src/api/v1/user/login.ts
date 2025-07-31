import { Request, Response } from "express";
import { jwtService, userService } from "@/services";
import { UserResponse } from "@/types";
import { COOKIE_OPTIONS } from "@/utils";
import { z } from "zod";
import { IFunctionDefinition } from "@/config/loader";

export const postReqSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export const postResSchema = z.object({
    user: z.object({
        id: z.string(),
        email: z.email(),
        name: z.string().optional(),
    }),
});

export async function postLogin(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        const user = await userService.getUser(email, password);

        if (!user) {
            res.status(500).json({
                message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
            });
            return;
        }
        // sign
        const token = await jwtService.sign({ email, password });

        res.cookie("token", token, { ...COOKIE_OPTIONS });
        res.status(200).json({ user });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
}

export const functions: Omit<IFunctionDefinition, "method">[] = [
    {
        handler: postLogin,
        middlewares: [],
        requestSchema: postReqSchema,
        responseSchema: postResSchema,
    }
]