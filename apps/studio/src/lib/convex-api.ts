import { makeFunctionReference } from "convex/server";

export type Id<TableName extends string> = string & { __tableName?: TableName };

export type Viewer = {
  _id: Id<"users">;
  _creationTime: number;
  clerkUserId: string;
  email?: string;
  name?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
} | null;

export type SiteRecord = {
  _id: Id<"sites">;
  _creationTime: number;
  ownerId: Id<"users">;
  name: string;
  slug: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type PostRecord = {
  _id: Id<"posts">;
  _creationTime: number;
  siteId: Id<"sites">;
  authorId: Id<"users">;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  status: "draft" | "published";
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
};

function queryRef<Args extends Record<string, unknown>, ReturnType>(name: string) {
  return makeFunctionReference<"query", Args, ReturnType>(name);
}

function mutationRef<Args extends Record<string, unknown>, ReturnType = void>(
  name: string,
) {
  return makeFunctionReference<"mutation", Args, ReturnType>(name);
}

export const api = {
  users: {
    ensureCurrentUser: mutationRef<{}, Id<"users">>("users:ensureCurrentUser"),
    viewer: queryRef<{}, Viewer>("users:viewer"),
  },
  sites: {
    create: mutationRef<
      {
        name: string;
        slug: string;
        description?: string;
      },
      Id<"sites">
    >("sites:create"),
    listMine: queryRef<{}, SiteRecord[]>("sites:listMine"),
  },
  posts: {
    createDraft: mutationRef<
      {
        siteId: Id<"sites">;
        title: string;
        slug: string;
        excerpt?: string;
        body: string;
      },
      Id<"posts">
    >("posts:createDraft"),
    updateDraft: mutationRef<{
      postId: Id<"posts">;
      title: string;
      slug: string;
      excerpt?: string;
      body: string;
    }>("posts:updateDraft"),
    publish: mutationRef<{ postId: Id<"posts"> }>("posts:publish"),
    unpublish: mutationRef<{ postId: Id<"posts"> }>("posts:unpublish"),
    remove: mutationRef<{ postId: Id<"posts"> }>("posts:remove"),
    listBySite: queryRef<{ siteId: Id<"sites"> }, PostRecord[]>("posts:listBySite"),
  },
};
