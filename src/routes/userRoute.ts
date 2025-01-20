import { Router } from "express";
import {
    login,
    logout,
    user
} from "../controllers";

import { authenticateMiddleware } from "../middlewares";

export const userRouter = Router();

userRouter.get("/", authenticateMiddleware.isAuthenticated, user);
userRouter.post("/login", authenticateMiddleware.authenticate, login);
userRouter.post("/logout", authenticateMiddleware.isAuthenticated, logout);