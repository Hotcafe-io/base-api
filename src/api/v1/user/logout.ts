import { Request, Response } from "express";
import { COOKIE_OPTIONS } from "@/utils";
import { UserResponse } from "@/types";
import { IFunctionDefinition } from "@/loader";

export async function logout(req: Request, res: Response): Promise<void> {
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

export const functions: IFunctionDefinition[] = [
    {
        method: "POST",
        handler: logout,
        middlewares: [],
        isPublic: true,
    }
]