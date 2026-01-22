import { BadRequestError, NotFoundError } from "../../lib/error.js";
import prisma from "../../prisma.js";

export async function listRepliesForThread(threadId: bigint) {
  if (!threadId || threadId <= 0) {
    throw new BadRequestError("Invalid thread Id", undefined);
  }

  const replies = await prisma.reply.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
    include: { author: true },
  });

  return replies.map((r) => ({
    id: Number(r.id),
    body: r.body,
    createdAt: r.createdAt,
    author: {
      displayName: r.author.displayName ?? null,
      handle: r.author.handle ?? null,
    },
  }));
}

export async function createReply(params: {
  threadId: bigint;
  authorUserId: string;
  body: string;
}) {
  const { threadId, authorUserId, body } = params;

  const reply = await prisma.reply.create({
    data: {
      threadId,
      authorUserId,
      body,
    },
    include: {
      author: true,
    },
  });

  return {
    id: Number(reply.id),
    body: reply.body,
    createdAt: reply.createdAt,
    author: {
      displayName: reply.author.displayName ?? null,
      handle: reply.author.handle ?? null,
    },
  };
}

export async function findReplyAuthor(replyId: bigint) {
  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
    select: { authorUserId: true },
  });

  if (!reply) {
    throw new NotFoundError("Reply not found!!!");
  }

  return reply.authorUserId;
}

export async function deleteReplyById(replyId: bigint) {
  await prisma.reply.delete({
    where: { id: replyId },
  });
}

export async function likeThreadOnce(params: {
  threadId: bigint;
  userId: string;
}) {
  const { threadId, userId } = params;

  await prisma.threadReaction.upsert({
    where: { threadId_userId: { threadId, userId } },
    update: {},
    create: { threadId, userId },
  });
}

export async function removeThreadOnce(params: {
  threadId: bigint;
  userId: string;
}) {
  const { threadId, userId } = params;

  await prisma.threadReaction.deleteMany({
    where: { threadId, userId },
  });
}

export async function getThreadDetailsWithCounts(params: {
  threadId: bigint;
  viewerUserId?: string | null;
}) {
  const { threadId, viewerUserId } = params;

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      category: true,
      author: true,
    },
  });

  if (!thread) {
    throw new NotFoundError("Thread not found");
  }

  const likeCount = await prisma.threadReaction.count({ where: { threadId } });
  const replyCount = await prisma.reply.count({ where: { threadId } });

  let viewerHasLikedThisPostOrNot = false;
  if (viewerUserId) {
    const exists = await prisma.threadReaction.findUnique({
      where: { threadId_userId: { threadId, userId: viewerUserId } },
    });
    viewerHasLikedThisPostOrNot = !!exists;
  }

  return {
    id: Number(thread.id),
    title: thread.title,
    body: thread.body,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    category: {
      slug: thread.category.slug,
      name: thread.category.name,
    },
    author: {
      displayName: thread.author.displayName ?? null,
      handle: thread.author.handle ?? null,
    },
    likeCount,
    replyCount,
    viewerHasLikedThisPostOrNot,
  };
}
