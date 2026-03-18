import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function getIdentity(ctx: Ctx) {
  return await ctx.auth.getUserIdentity();
}

export async function requireIdentity(ctx: Ctx) {
  const identity = await getIdentity(ctx);

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity;
}

export async function getCurrentUser(ctx: Ctx) {
  const identity = await getIdentity(ctx);

  if (!identity) {
    return null;
  }

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
    .unique();
}

export async function requireCurrentUser(ctx: Ctx) {
  const identity = await requireIdentity(ctx);
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error("User profile has not been initialized");
  }

  return { identity, user };
}
