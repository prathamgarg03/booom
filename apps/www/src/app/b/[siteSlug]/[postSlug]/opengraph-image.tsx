import { formatPublishedDate, getBlogPost } from "@/lib/blog";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Post on Booom";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60;

export default async function Image({
  params,
}: {
  params: Promise<{ siteSlug: string; postSlug: string }>;
}) {
  const { siteSlug, postSlug } = await params;
  const data = await getBlogPost(siteSlug, postSlug).catch(() => null);

  return renderOgCard({
    eyebrow: data?.site.name ?? "Booom",
    title: data?.post.title ?? "Post not found",
    subtitle: data?.post.excerpt || undefined,
    footer: data ? formatPublishedDate(data.post.publishedAt) : undefined,
  });
}
