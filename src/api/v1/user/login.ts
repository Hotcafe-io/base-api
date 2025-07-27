import { Request, Response } from "express";
import { jwtService, userService } from "../../../services";
import { UserResponse } from "../../../types";
import { COOKIE_OPTIONS } from "../../../utils";
import { IFunctionDefinition } from "../../../loader";

export async function login(req: Request, res: Response): Promise<void> {
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

export const functions: IFunctionDefinition[] = [
    {
        method: "POST",
        handler: login,
        middlewares: [],
        isPublic: true,
    }
]