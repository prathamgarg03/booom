import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "./lib/auth";
import { assertValidSlug, normalizeSlug } from "./lib/slugs";

export const createDraft = mutation({
  args: {
    siteId: v.id("sites"),
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCurrentUser(ctx);
    const site = await ctx.db.get(args.siteId);

    if (!site || site.ownerId !== user._id) {
      throw new Error("Not authorized to write to this site");
    }

    const title = args.title.trim();
    const slug = normalizeSlug(args.slug);
    const excerpt = args.excerpt?.trim() || undefined;
    const body = args.body.trim();

    if (!title) {
      throw new Error("Post title is required");
    }

    if (!body) {
      throw new Error("Post body is required");
    }

    assertValidSlug(slug, "Post slug");

    const existing = await ctx.db
      .query("posts")
      .withIndex("by_site_id_slug", (q) =>
        q.eq("siteId", args.siteId).eq("slug", slug),
      )
      .unique();

    if (existing) {
      throw new Error("That post slug is already used for this site");
    }

    const now = Date.now();

    return await ctx.db.insert("posts", {
      siteId: args.siteId,
      authorId: user._id,
      title,
      slug,
      excerpt,
      body,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const publish = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCurrentUser(ctx);
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const site = await ctx.db.get(post.siteId);

    if (!site || site.ownerId !== user._id) {
      throw new Error("Not authorized to publish this post");
    }

    await ctx.db.patch(post._id, {
      status: "published",
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const listBySite = query({
  args: {
    siteId: v.id("sites"),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCurrentUser(ctx);
    const site = await ctx.db.get(args.siteId);

    if (!site || site.ownerId !== user._id) {
      throw new Error("Not authorized to read this site");
    }

    return await ctx.db
      .query("posts")
      .withIndex("by_site_id", (q) => q.eq("siteId", args.siteId))
      .collect();
  },
});

export const listPublishedBySiteSlug = query({
  args: {
    siteSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const site = await ctx.db
      .query("sites")
      .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(args.siteSlug)))
      .unique();

    if (!site) {
      return [];
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_site_id", (q) => q.eq("siteId", site._id))
      .collect();

    return posts
      .filter((post) => post.status === "published")
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
      .map((post) => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        publishedAt: post.publishedAt ?? null,
      }));
  },
});
