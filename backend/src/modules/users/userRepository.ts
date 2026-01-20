import prisma from "../../prisma.js";
import { User } from "../../types/UserTypes.js";

export async function upsertUserFromClerkProfile(params: {
  clerkUserId: string;
  displayName: string | null;
  avatarUrl: string | null;
}): Promise<User> {
  const { clerkUserId, displayName, avatarUrl } = params;

  const user = await prisma.user.upsert({
    where: {
      clerkUserId: clerkUserId,
    },
    update: {
      displayName: displayName,
      avatarUrl: avatarUrl,
      updatedAt: new Date(),
    },
    create: {
      clerkUserId: clerkUserId,
      displayName: displayName,
      avatarUrl: avatarUrl,
      handle: clerkUserId,
    },
  });

  return user;
}

export async function repoUpdateUserProfile(params: {
  clerkUserId: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<User> {
  const { clerkUserId, displayName, handle, bio, avatarUrl } = params;

  const user = await prisma.user.update({
    where: {
      clerkUserId,
    },
    data: {
      ...(displayName !== undefined && { displayName }),
      ...(handle !== undefined && { handle }),
      ...(bio !== undefined && { bio }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
  });

  return user;
}
