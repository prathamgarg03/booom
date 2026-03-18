import { query } from "./_generated/server";
import { v } from "convex/values";
import { findPublishedPostBySlug, listPublishedPostSummaries } from "./lib/publicPosts";
import { normalizeSlug } from "./lib/slugs";

export const blogIndex = query({
  args: {
    siteSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const site = await ctx.db
      .query("sites")
      .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(args.siteSlug)))
      .unique();

    if (!site) {
      return null;
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_site_id", (q) => q.eq("siteId", site._id))
      .collect();

    return {
      site: {
        name: site.name,
        slug: site.slug,
        description: site.description ?? "",
      },
      posts: listPublishedPostSummaries(posts),
    };
  },
});

export const blogPost = query({
  args: {
    siteSlug: v.string(),
    postSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const site = await ctx.db
      .query("sites")
      .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(args.siteSlug)))
      .unique();

    if (!site) {
      return null;
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_site_id", (q) => q.eq("siteId", site._id))
      .collect();

    const post = findPublishedPostBySlug(posts, args.postSlug);

    if (!post) {
      return null;
    }

    return {
      site: {
        name: site.name,
        slug: site.slug,
        description: site.description ?? "",
      },
      post: {
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        body: post.body,
        publishedAt: post.publishedAt ?? null,
        updatedAt: post.updatedAt,
      },
    };
  },
});
