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
