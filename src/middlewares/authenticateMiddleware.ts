import { Request, Response, NextFunction } from "express";
import {
    jwtService,
    userService
} from "../services";
import { UserResponse } from "../types";
import { Permission } from "../../models";
import { COOKIE_OPTIONS } from "../utils";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: UserResponse.ErrorMessage.FORBIDDEN,
        });
        return;
    }

    next();
}

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { token } = req.cookies;

        const isValidToken = await jwtService.verify(token);
        if (!isValidToken) {
            res.clearCookie("token", COOKIE_OPTIONS);
            res.status(401).json({
                message: UserResponse.ErrorMessage.UNAUTHORIZED,
            });
            return;
        }

        const payload = await jwtService.decode(token);

        const authenticatedUser = await userService.getUser(payload.email, payload.password);

        if (!authenticatedUser) {
            res.clearCookie("token", COOKIE_OPTIONS);
            res.status(401).json({
                message: UserResponse.ErrorMessage.UNAUTHORIZED,
            });
            return;
        }

        req.user = authenticatedUser;
        
        const newToken = await jwtService.sign({
            email: payload.email,
            password: payload.password,
        });

        res.cookie("token", newToken, { ...COOKIE_OPTIONS });
        next();
        return;
    } catch (err: any) {
        res.clearCookie("token", COOKIE_OPTIONS);
        res.status(500).json({
            message: UserResponse.ErrorMessage.INTERNAL_SERVER_ERROR,
        });
    }
}

export async function permissions(
    req: Request,
    res: Response,
    next: NextFunction,
    permissions: Permission[],
) {
    const { user } = req;
    if (!user) {
        res.status(401).json({
            message: UserResponse.ErrorMessage.UNAUTHORIZED,
        });
        return;
    }

    if (userService.hasPermission(user, permissions)) {
        next();
        return;
    }

    res.status(403).json({ message: UserResponse.ErrorMessage.FORBIDDEN });
}
