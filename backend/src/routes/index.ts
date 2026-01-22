import { Router } from "express";
import { userRouter } from "./UserRoutes.js";
import { threadsRouter } from "./ThreadRoutes.js";

export const apiRouter = Router();

apiRouter.use("/me", userRouter);

apiRouter.use("/threads", threadsRouter);
