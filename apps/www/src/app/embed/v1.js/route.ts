import { NextResponse } from "next/server";
import { getEmbedScript } from "@/lib/embed-script";

export async function GET() {
  return new NextResponse(getEmbedScript(), {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
