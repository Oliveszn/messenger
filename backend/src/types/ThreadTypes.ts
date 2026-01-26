export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type ThreadDetail = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    slug: string;
    name: string;
  };
  author: {
    displayName: string | null;
    handle: string | null;
  };
};

export type ThreadListFilter = {
  page: number;
  pageSize: number;
  categorySlug?: string;
  search?: string;
  sort: "new" | "old";
};

export type ThreadSummary = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: Date;
  category: {
    slug: string;
    name: string;
  };
  author: {
    displayName: string | null;
    handle: string | null;
  };
};
