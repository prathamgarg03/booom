import { fetchQuery } from "convex/nextjs";
import { api } from "@/lib/convex-api";
import { getWwwEnv } from "@/lib/env";

export async function getBlogIndex(siteSlug: string) {
  const env = getWwwEnv();

  return await fetchQuery(api.public.blogIndex, { siteSlug }, {
    url: env.NEXT_PUBLIC_CONVEX_URL,
  });
}

export async function getBlogPost(siteSlug: string, postSlug: string) {
  const env = getWwwEnv();

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
    timeZone: "UTC",
  }).format(timestamp);
}

export function formatShortDate(timestamp?: number | null) {
  if (!timestamp) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(timestamp);
}

export function readingMinutes(markdown: string) {
  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 230));
}

export async function getSitemapEntries() {
  const env = getWwwEnv();

  return await fetchQuery(api.public.sitemapEntries, {}, {
    url: env.NEXT_PUBLIC_CONVEX_URL,
  });
}
