import { getBlogIndex } from "@/lib/blog";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Blog on Booom";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60;

export default async function Image({ params }: { params: Promise<{ siteSlug: string }> }) {
  const { siteSlug } = await params;
  const data = await getBlogIndex(siteSlug).catch(() => null);
  const count = data?.posts.length ?? 0;

  return renderOgCard({
    eyebrow: "Blog",
    title: data?.site.name ?? "Booom",
    subtitle: data?.site.description || undefined,
    footer: data ? `${count} ${count === 1 ? "post" : "posts"}` : undefined,
  });
}
