import { Router } from "express";
import { getAuth } from "../config/clerk.js";

import { getUserFromClerk } from "../modules/users/userService.js";
import { BadRequestError, UnauthorizedError } from "../lib/error.js";
import {
  listNotificationsForUser,
  markNotificationRead,
} from "../modules/notifications/notificationService.js";

export const notificationsRouter = Router();

// get unreadonly=true|false
// /api/notifications?unreadonly=true|false

notificationsRouter.get("/", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Please sign in");
    }

    const profile = await getUserFromClerk(auth.userId);

    const isUnreadOnly = req.query.unreadOnly === "true";

    const notifications = await listNotificationsForUser({
      userId: profile.user.id,
      unreadOnly: isUnreadOnly,
    });

    res.json({ data: notifications });
  } catch (err) {
    next(err);
  }
});

// 1,2,3
// post /api/notifications/:id/read

notificationsRouter.post("/:id/read", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Please sign in!!!!!");
    }

    console.log(req.params.id, "req.params.id");

    const notificationId = req.params.id;
    if (!notificationId) {
      throw new BadRequestError("Invalid notification ID");
    }
    const profile = await getUserFromClerk(auth.userId);

    await markNotificationRead({
      userId: profile.user.id,
      notificationId,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// HOMEWORK -> post /api/notifications/read-all
