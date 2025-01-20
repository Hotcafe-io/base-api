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

export async function validatePhone(req: Request, res: Response): Promise<void> {
    try {
        const { phone } = req.body;

        const phoneExists = await userService.validatePhoneNumber(phone);

        if(phoneExists) {
            res.status(400).json({
                message: UserResponse.ErrorMessage.PHONE_ALREADY_EXISTS,
            });
            return;
        }

        res.status(200).end();
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
}

export async function validateEmail(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.body;

        const emailExists = await userService.validateEmail(email);

        if(emailExists) {
            res.status(400).json({
                message: UserResponse.ErrorMessage.EMAIL_ALREADY_EXISTS,
            });
            return;
        }

        res.status(200).end();
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