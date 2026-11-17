import type { BlogIndexResult } from "@/lib/convex-api";

export const DEFAULT_EMBED_LIMIT = 5;
export const CANONICAL_ORIGIN = "https://booom.dev";
const legacyHosts = new Set(["booom-www.vercel.app", "www.booom.dev"]);

/** Links handed to embeds always point at booom.dev, even when the script was loaded from an old address. */
export function getCanonicalOrigin(requestUrl: URL) {
  return legacyHosts.has(requestUrl.hostname) ? CANONICAL_ORIGIN : requestUrl.origin;
}
export const MAX_EMBED_LIMIT = 12;
const siteSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseEmbedLimit(rawLimit: string | null | undefined) {
  const parsed = Number.parseInt(rawLimit ?? String(DEFAULT_EMBED_LIMIT), 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_EMBED_LIMIT;
  }

  return Math.min(parsed, MAX_EMBED_LIMIT);
}

export function normalizeEmbedSiteSlug(rawSiteSlug: string | null | undefined) {
  if (typeof rawSiteSlug !== "string") {
    return null;
  }

  const normalized = rawSiteSlug.trim().toLowerCase();

  if (!siteSlugPattern.test(normalized)) {
    return null;
  }

  return normalized;
}

export function buildEmbedPayload(
  data: NonNullable<BlogIndexResult>,
  origin: string,
  limit: number,
) {
  return {
    site: {
      name: data.site.name,
      slug: data.site.slug,
      description: data.site.description,
      url: `${origin}/b/${data.site.slug}`,
    },
    posts: data.posts.slice(0, limit).map((post) => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      url: `${origin}/b/${data.site.slug}/${post.slug}`,
    })),
  };
}

export function getEmbedCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  };
}
