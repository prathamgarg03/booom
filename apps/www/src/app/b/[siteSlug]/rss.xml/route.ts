import { getBlogIndex } from "@/lib/blog";
import { CANONICAL_ORIGIN } from "@/lib/embed";

export const revalidate = 300;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(_request: Request, { params }: { params: Promise<{ siteSlug: string }> }) {
  const { siteSlug } = await params;
  const data = await getBlogIndex(siteSlug);

  if (!data) {
    return new Response("Blog not found", { status: 404 });
  }

  const blogUrl = `${CANONICAL_ORIGIN}/b/${data.site.slug}`;
  const items = data.posts
    .map((post) => {
      const url = `${blogUrl}/${post.slug}`;
      const date = post.publishedAt ? new Date(post.publishedAt).toUTCString() : "";

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        date ? `      <pubDate>${date}</pubDate>` : "",
        post.excerpt ? `      <description>${escapeXml(post.excerpt)}</description>` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(data.site.name)}</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(data.site.description || `Writing from ${data.site.name}`)}</description>
    <language>en</language>
    <atom:link href="${blogUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
