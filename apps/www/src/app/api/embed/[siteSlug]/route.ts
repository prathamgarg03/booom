import { NextResponse } from "next/server";
import { getBlogIndex } from "@/lib/blog";

type RouteProps = {
  params: Promise<{ siteSlug: string }>;
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(request: Request, { params }: RouteProps) {
  const { siteSlug } = await params;
  const url = new URL(request.url);
  const limitValue = Number.parseInt(url.searchParams.get("limit") ?? "5", 10);
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(limitValue, 12) : 5;
  const data = await getBlogIndex(siteSlug);

  if (!data) {
    return NextResponse.json(
      { error: "Site not found" },
      {
        status: 404,
        headers: corsHeaders(),
      },
    );
  }

  return NextResponse.json(
    {
      site: {
        name: data.site.name,
        slug: data.site.slug,
        description: data.site.description,
        url: `${url.origin}/b/${data.site.slug}`,
      },
      posts: data.posts.slice(0, limit).map((post) => ({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        url: `${url.origin}/b/${data.site.slug}/${post.slug}`,
      })),
    },
    {
      headers: corsHeaders(),
    },
  );
}
