import { getAuth } from "@clerk/express";
import { Router } from "express";
import { getUserFromClerk } from "../modules/users/userService.js";
import {
  listChatUsers,
  listDirectMessages,
} from "../modules/chat/chatService.js";

export const chatRouter = Router();

chatRouter.get("/users", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const profile = await getUserFromClerk(auth.userId);
    const currentUserId = profile.user.id;

    const users = await listChatUsers(currentUserId);

    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

chatRouter.get(
  "/conversations/:otherUserId/messages",
  async (req, res, next) => {
    try {
      const auth = getAuth(req);

      if (!auth.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const profile = await getUserFromClerk(auth.userId);
      const currentUserId = profile.user.id;

      const rawOtherUserId = req.params.otherUserId;
      const otherUserId = rawOtherUserId;

      const limitParam = req.query.limit;
      const limit =
        typeof limitParam === "string" ? parseInt(limitParam, 10) : 100;

      const messages = await listDirectMessages({
        userId: currentUserId,
        otherUserId,
        limit: limit || 50,
      });

      res.json({ data: messages });
    } catch (err) {
      next(err);
    }
  },
);
