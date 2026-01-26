import { Router } from "express";
import { userRouter } from "./UserRoutes.js";
import { threadsRouter } from "./ThreadRoutes.js";
import { notificationsRouter } from "./NotificationRoutes.js";

export const apiRouter = Router();

apiRouter.use("/me", userRouter);

apiRouter.use("/threads", threadsRouter);

apiRouter.use("/notifications", notificationsRouter);
