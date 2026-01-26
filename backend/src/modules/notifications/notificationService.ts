import prisma from "../../prisma.js";
import { getIo } from "../../realtime/io.js";
import { mapNotification } from "../../types/NotificationTypes.js";

export async function createReplyNotification(params: {
  threadId: string;
  actorUserId: string;
}) {
  const { threadId, actorUserId } = params;

  // 1. Get thread author
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: { authorUserId: true },
  });

  if (!thread) return;

  const authorUserId = thread.authorUserId;
  if (authorUserId === actorUserId) return;

  const notification = await prisma.notification.create({
    data: {
      userId: authorUserId,
      actorUserId,
      threadId,
      type: "REPLY_ON_THREAD",
    },
    include: {
      actor: {
        select: {
          displayName: true,
          handle: true,
        },
      },
      thread: {
        select: {
          title: true,
        },
      },
    },
  });

  const payload = mapNotification(notification);

  const io = getIo();
  if (io) {
    io.to(`notifications:user:${authorUserId}`).emit(
      "notification:new",
      payload,
    );
  }
}

export async function createLikeNotification(params: {
  threadId: string;
  actorUserId: string;
}) {
  const { threadId, actorUserId } = params;

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: { authorUserId: true },
  });

  if (!thread) return;

  const authorUserId = thread.authorUserId;
  if (authorUserId === actorUserId) return;

  const notification = await prisma.notification.create({
    data: {
      userId: authorUserId,
      actorUserId,
      threadId,
      type: "LIKE_ON_THREAD",
    },
    include: {
      actor: {
        select: {
          displayName: true,
          handle: true,
        },
      },
      thread: {
        select: {
          title: true,
        },
      },
    },
  });

  const payload = mapNotification(notification);

  const io = getIo();
  if (io) {
    io.to(`notifications:user:${authorUserId}`).emit(
      "notification:new",
      payload,
    );
  }
}

export async function listNotificationsForUser(params: {
  userId: string;
  unreadOnly: boolean;
}) {
  const { userId, unreadOnly } = params;

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { readAt: null } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: {
        select: {
          displayName: true,
          handle: true,
        },
      },
      thread: {
        select: {
          title: true,
        },
      },
    },
  });

  return notifications.map(mapNotification);
}

export async function markNotificationRead(params: {
  userId: string;
  notificationId: string;
}) {
  const { userId, notificationId } = params;

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });
}

// function to mark all selected notifs to read
