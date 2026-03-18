import { makeFunctionReference } from "convex/server";

export type PublishedPostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: number | null;
};

export type BlogIndexResult = {
  site: {
    name: string;
    slug: string;
    description: string;
  };
  posts: PublishedPostSummary[];
} | null;

export type BlogPostResult = {
  site: {
    name: string;
    slug: string;
    description: string;
  };
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    publishedAt: number | null;
    updatedAt: number;
  };
} | null;

function queryRef<Args extends Record<string, unknown>, ReturnType>(name: string) {
  return makeFunctionReference<"query", Args, ReturnType>(name);
}

export const api = {
  public: {
    blogIndex: queryRef<{ siteSlug: string }, BlogIndexResult>("public:blogIndex"),
    blogPost: queryRef<
      { siteSlug: string; postSlug: string },
      BlogPostResult
    >("public:blogPost"),
  },
};
