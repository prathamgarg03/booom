import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  NEXT_PUBLIC_CONVEX_URL: z.string().url("NEXT_PUBLIC_CONVEX_URL must be a valid URL"),
});

const serverEnvSchema = publicEnvSchema.extend({
  CLERK_SECRET_KEY: z.string().min(1, "Missing CLERK_SECRET_KEY"),
});

export function getWwwPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  });
}

export function getWwwServerEnv() {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  });
}
