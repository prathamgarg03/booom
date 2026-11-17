import { z } from "zod";

const studioEnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Missing VITE_CLERK_PUBLISHABLE_KEY"),
  VITE_CONVEX_URL: z.string().url("VITE_CONVEX_URL must be a valid URL"),
  VITE_PUBLIC_APP_URL: z
    .string()
    .url("VITE_PUBLIC_APP_URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  VITE_POSTHOG_KEY: z.string().optional(),
});

const parsedStudioEnv = studioEnvSchema.parse({
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
  VITE_PUBLIC_APP_URL: import.meta.env.VITE_PUBLIC_APP_URL,
  VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
});

export const studioEnv = {
  VITE_CLERK_PUBLISHABLE_KEY: parsedStudioEnv.VITE_CLERK_PUBLISHABLE_KEY,
  VITE_CONVEX_URL: parsedStudioEnv.VITE_CONVEX_URL,
  VITE_PUBLIC_APP_URL: parsedStudioEnv.VITE_PUBLIC_APP_URL || undefined,
  VITE_POSTHOG_KEY: parsedStudioEnv.VITE_POSTHOG_KEY || undefined,
};
