export interface User {
  id: string;
  clerkUserId: string;
  displayName: string | null;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  user: User;
  clerkEmail: string | null;
  clerkFullName: string | null;
}

export interface UserProfileResponse {
  id: string;
  clerkUserId: string;
  displayName: string | null;
  email: string | null;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export function toUserProfileResponse(
  profile: UserProfile,
): UserProfileResponse {
  const { user, clerkEmail, clerkFullName } = profile;

  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: clerkEmail ?? null,
    displayName: user.displayName ?? clerkFullName ?? null,
    handle: user.handle ?? null,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
  };
}
