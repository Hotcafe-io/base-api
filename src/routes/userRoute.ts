import { Router } from "express";
import {
    login,
    logout,
    user,
    validateEmail,
    validatePhone
} from "../controllers";

import { authenticateMiddleware } from "../middlewares";
import { register } from "../controllers/register";

export const userRouter = Router();

userRouter.get("/", authenticateMiddleware.isAuthenticated, user);
userRouter.post("/login", authenticateMiddleware.authenticate, login);
userRouter.post("/logout", authenticateMiddleware.isAuthenticated, logout);
userRouter.post("/register", register);
userRouter.post("/validate-phone", validatePhone);
userRouter.post("/validate-email", validateEmail);