import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "./lib/auth";
import { assertValidSlug, normalizeSlug } from "./lib/slugs";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireCurrentUser(ctx);

    const existingSite = await ctx.db
      .query("sites")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user._id))
      .first();

    if (existingSite) {
      throw new Error("The MVP currently supports one site per account");
    }

    const name = args.name.trim();
    const slug = normalizeSlug(args.slug);
    const description = args.description?.trim() || undefined;

    if (!name) {
      throw new Error("Site name is required");
    }

    assertValidSlug(slug, "Site slug");

    const slugTaken = await ctx.db
      .query("sites")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (slugTaken) {
      throw new Error("That site slug is already taken");
    }

    const now = Date.now();

    return await ctx.db.insert("sites", {
      ownerId: user._id,
      name,
      slug,
      description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireCurrentUser(ctx);

    return await ctx.db
      .query("sites")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});
