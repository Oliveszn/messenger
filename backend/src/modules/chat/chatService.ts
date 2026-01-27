import prisma from "../../prisma.js";

export async function listChatUsers(currentUserId: string) {
  const users = await prisma.user.findMany({
    where: {
      id: { not: currentUserId },
    },
    select: {
      id: true,
      displayName: true,
      handle: true,
      avatarUrl: true,
    },
  });

  users.sort((a, b) => {
    const aName = a.displayName ?? a.handle ?? "User";
    const bName = b.displayName ?? b.handle ?? "User";
    return aName.localeCompare(bName);
  });

  return users;
}

export async function listDirectMessages(params: {
  userId: string;
  otherUserId: string;
  limit: number;
}) {
  const { userId, otherUserId, limit } = params;
  const setLimit = Math.min(Math.max(limit || 50, 1), 200);

  const messages = await prisma.directMessage.findMany({
    where: {
      OR: [
        { senderUserId: userId, recipientUserId: otherUserId },
        { senderUserId: otherUserId, recipientUserId: userId },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: setLimit,
    include: {
      sender: {
        select: {
          displayName: true,
          handle: true,
          avatarUrl: true,
        },
      },
      recipient: {
        select: {
          displayName: true,
          handle: true,
          avatarUrl: true,
        },
      },
    },
  });

  return messages
    .slice()
    .reverse()
    .map((dm) => ({
      id: dm.id,
      senderUserId: dm.senderUserId,
      recipientUserId: dm.recipientUserId,
      body: dm.body ?? null,
      imageUrl: dm.imageUrl ?? null,
      createdAt: dm.createdAt.toISOString(),
      sender: dm.sender,
      recipient: dm.recipient,
    }));
}

export async function createDirectMessage(params: {
  senderUserId: string;
  recipientUserId: string;
  body?: string | null;
  imageUrl?: string | null;
}) {
  const { senderUserId, recipientUserId } = params;

  const trimmedBody = params.body?.trim() ?? "";
  const imageUrl = params.imageUrl ?? null;

  if (!trimmedBody && !imageUrl) {
    throw new Error("Message body or image is required");
  }

  const dm = await prisma.directMessage.create({
    data: {
      senderUserId,
      recipientUserId,
      body: trimmedBody || null,
      imageUrl,
    },
    include: {
      sender: {
        select: {
          displayName: true,
          handle: true,
          avatarUrl: true,
        },
      },
      recipient: {
        select: {
          displayName: true,
          handle: true,
          avatarUrl: true,
        },
      },
    },
  });

  return {
    id: dm.id,
    senderUserId: dm.senderUserId,
    recipientUserId: dm.recipientUserId,
    body: dm.body ?? null,
    imageUrl: dm.imageUrl ?? null,
    createdAt: dm.createdAt.toISOString(),
    sender: dm.sender,
    recipient: dm.recipient,
  };
}
