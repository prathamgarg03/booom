import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireIdentity } from "./lib/auth";

export const ensureCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const now = Date.now();

    const existing = await getCurrentUser(ctx);

    const name =
      identity.name ?? identity.preferredUsername ?? identity.nickname;

    const imageUrl =
      typeof identity.pictureUrl === "string" ? identity.pictureUrl : undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: identity.email,
        name,
        imageUrl,
        updatedAt: now,
      });

      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      email: identity.email,
      name,
      imageUrl,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});
