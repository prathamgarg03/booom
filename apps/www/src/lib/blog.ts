import { fetchQuery } from "convex/nextjs";
import { api } from "@/lib/convex-api";
import { getWwwServerEnv } from "@/lib/env";

export async function getBlogIndex(siteSlug: string) {
  const env = getWwwServerEnv();

  return await fetchQuery(api.public.blogIndex, { siteSlug }, {
    url: env.NEXT_PUBLIC_CONVEX_URL,
  });
}

export async function getBlogPost(siteSlug: string, postSlug: string) {
  const env = getWwwServerEnv();

  return await fetchQuery(api.public.blogPost, { siteSlug, postSlug }, {
    url: env.NEXT_PUBLIC_CONVEX_URL,
  });
}

export function formatPublishedDate(timestamp?: number | null) {
  if (!timestamp) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}
