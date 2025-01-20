import { Router } from "express";
import { userRouter } from "./userRoute";
export const router = Router();

const apiV1 = Router();
router.use("/api/v1", apiV1);

apiV1.use("/user", userRouter);