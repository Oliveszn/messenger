import { Router } from "express";
import { userRouter } from "./UserRoutes.js";

export const apiRouter = Router();

apiRouter.use("/me", userRouter);
