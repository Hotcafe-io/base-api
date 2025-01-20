import { Request, Response } from "express";
import {
    userService
} from "../services";
import { UserResponse } from "../types";

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const { email, password, name } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const existentUser = await userService.userExists(email);

        if (existentUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        await userService.register(name, email, password);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({
            message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
}