import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";

export async function getBlogIndex(siteSlug: string) {
  return await fetchQuery(api.public.blogIndex, { siteSlug });
}

export async function getBlogPost(siteSlug: string, postSlug: string) {
  return await fetchQuery(api.public.blogPost, { siteSlug, postSlug });
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
