import { Request, Response } from "express";
import {
    jwtService,
    userService
} from "../services";

import { UserResponse } from "../types"; 
import { COOKIE_OPTIONS } from "../utils";

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        const user = await userService.getUser(email, await userService.hashPassword(password));

        if (!user) {
            res.status(500).json({
                message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
            });
            return;
        }
        // sign
        const token = await jwtService.sign({ email, password: await userService.hashPassword(password) });

        res.cookie("token", token, { ...COOKIE_OPTIONS });
        res.status(200).json({ user });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
}

export async function user(req: Request, res: Response): Promise<void> {
    try {
        const { user } = req;
        res.status(200).json({ user });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
}

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