export type NotificationType = "REPLY_ON_THREAD" | "LIKE_ON_THREAD";

export type Notification = {
  id: string;
  type: NotificationType | string;
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
