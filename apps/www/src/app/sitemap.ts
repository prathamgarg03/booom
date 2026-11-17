import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/blog";
import { CANONICAL_ORIGIN } from "@/lib/embed";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: CANONICAL_ORIGIN, changeFrequency: "weekly", priority: 1 },
    { url: `${CANONICAL_ORIGIN}/embed-demo`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const entries = await getSitemapEntries();

    return [
      ...base,
      ...entries.sites.map((site) => ({
        url: `${CANONICAL_ORIGIN}/b/${site.slug}`,
        lastModified: new Date(site.updatedAt),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...entries.posts.map((post) => ({
        url: `${CANONICAL_ORIGIN}/b/${post.siteSlug}/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return base;
  }
}
