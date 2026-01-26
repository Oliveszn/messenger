import { Category } from "@prisma/client";
import prisma from "../../prisma.js";
import {
  ThreadDetail,
  ThreadListFilter,
  ThreadSummary,
} from "../../types/ThreadTypes.js";
import { BadRequestError, NotFoundError } from "../../lib/error.js";

export function parseThreadListFilter(queryObj: {
  page?: unknown;
  pageSize?: unknown;
  category?: unknown;
  q?: unknown;
  sort?: unknown;
}): ThreadListFilter {
  const page = Number(queryObj.page) || 1;
  const rawPageSize = Number(queryObj.pageSize) || 20;
  const pageSize = Math.min(Math.max(rawPageSize, 1), 50);

  const categorySlug =
    typeof queryObj.category === "string" && queryObj.category.trim()
      ? queryObj.category.trim()
      : undefined;

  const search =
    typeof queryObj.q === "string" && queryObj.q.trim()
      ? queryObj.q.trim()
      : undefined;

  const sort: "new" | "old" = queryObj.sort === "old" ? "old" : "new";

  return {
    page,
    pageSize,
    search,
    sort,
    categorySlug,
  };
}

export async function listCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createThread(params: {
  categorySlug: string;
  authorUserId: string; // Clerk user id
  title: string;
  body: string;
}): Promise<ThreadDetail> {
  const { categorySlug, authorUserId, title, body } = params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true },
  });

  if (!category) {
    throw new BadRequestError("Invalid category");
  }

  const thread = await prisma.thread.create({
    data: {
      title,
      body,
      categoryId: category.id,
      authorUserId,
    },
    select: {
      id: true,
    },
  });

  return getThreadById(thread.id);
}

export async function getThreadById(id: string): Promise<ThreadDetail> {
  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
      author: {
        select: {
          displayName: true,
          handle: true,
        },
      },
    },
  });

  if (!thread) {
    throw new NotFoundError("Thread not found");
  }

  return {
    id: thread.id as unknown as string,
    title: thread.title,
    body: thread.body,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    category: {
      slug: thread.category.slug,
      name: thread.category.name,
    },
    author: {
      displayName: thread.author.displayName,
      handle: thread.author.handle,
    },
  };
}

export async function listThreads(
  filter: ThreadListFilter,
): Promise<ThreadSummary[]> {
  const { page, pageSize, categorySlug, sort, search } = filter;

  const where: any = {};

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { body: { contains: search, mode: "insensitive" } },
    ];
  }

  const threads = await prisma.thread.findMany({
    where,
    orderBy: {
      createdAt: sort === "old" ? "asc" : "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
      author: {
        select: {
          displayName: true,
          handle: true,
        },
      },
    },
  });

  return threads.map((t) => ({
    id: t.id as unknown as string,
    title: t.title,
    excerpt: t.body.slice(0, 200),
    createdAt: t.createdAt,
    category: {
      slug: t.category.slug,
      name: t.category.name,
    },
    author: {
      displayName: t.author.displayName,
      handle: t.author.handle,
    },
  }));
}
