export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: string;
};

export type ThreadSummary = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  category: {
    slug: string;
    name: string;
  };
  author: {
    id: string;
    displayName: string | null;
    handle: string | null;
  };
};

export type ThreadDetail = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  category: {
    slug: string;
    name: string;
  };
  author: {
    id: string;
    displayName: string | null;
    handle: string | null;
  };

  likeCount: number;
  replyCount: string;
  viewerHasLikedThisPostOrNot: boolean;
};

export type Comment = {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string | null;
    handle: string | null;
  };
};

export type MeResponse = {
  id: string;
  handle: string | null;
};
