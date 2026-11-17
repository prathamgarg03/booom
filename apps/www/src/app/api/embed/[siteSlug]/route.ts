import { NextResponse } from "next/server";
import { getBlogIndex } from "@/lib/blog";
import {
  buildEmbedPayload,
  getCanonicalOrigin,
  getEmbedCorsHeaders,
  normalizeEmbedSiteSlug,
  parseEmbedLimit,
} from "@/lib/embed";

type RouteProps = {
  params: Promise<{ siteSlug: string }>;
};

export const revalidate = 60;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getEmbedCorsHeaders(),
  });
}

export async function GET(request: Request, { params }: RouteProps) {
  const { siteSlug: rawSiteSlug } = await params;
  const url = new URL(request.url);
  const siteSlug = normalizeEmbedSiteSlug(rawSiteSlug);
  const limit = parseEmbedLimit(url.searchParams.get("limit"));

  if (!siteSlug) {
    return NextResponse.json(
      { error: "Invalid site slug" },
      {
        status: 400,
        headers: getEmbedCorsHeaders(),
      },
    );
  }

  const data = await getBlogIndex(siteSlug);

  if (!data) {
    return NextResponse.json(
      { error: "Site not found" },
      {
        status: 404,
        headers: getEmbedCorsHeaders(),
      },
    );
  }

  return NextResponse.json(buildEmbedPayload(data, getCanonicalOrigin(url), limit), {
    headers: getEmbedCorsHeaders(),
  });
}
