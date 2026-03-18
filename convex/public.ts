import { query } from "./_generated/server";
import { v } from "convex/values";
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
      posts: posts
        .filter((post) => post.status === "published")
        .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
        .map((post) => ({
          _id: post._id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          publishedAt: post.publishedAt ?? null,
          updatedAt: post.updatedAt,
        })),
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

    const post = await ctx.db
      .query("posts")
      .withIndex("by_site_id_slug", (q) =>
        q.eq("siteId", site._id).eq("slug", normalizeSlug(args.postSlug)),
      )
      .unique();

    if (!post || post.status !== "published") {
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
