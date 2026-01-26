import { Prisma } from "@prisma/client";

export type Notification = {
  id: string;
  type: string;
  threadId: string;
  createdAt: string;
  readAt: string | null;
  actor: {
    displayName: string | null;
    handle: string | null;
  };
  thread: {
    title: string;
  };
};

type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: {
    actor: {
      select: {
        displayName: true;
        handle: true;
      };
    };
    thread: {
      select: {
        title: true;
      };
    };
  };
}>;

export function mapNotification(n: NotificationWithRelations) {
  return {
    id: n.id,
    type: n.type,
    threadId: n.threadId,
    createdAt: n.createdAt.toISOString(),
    readAt: n.readAt ? n.readAt.toISOString() : null,
    actor: {
      displayName: n.actor.displayName,
      handle: n.actor.handle,
    },
    thread: {
      title: n.thread.title ?? "",
    },
  };
}
