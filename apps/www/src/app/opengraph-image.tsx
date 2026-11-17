import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Booom: write in the studio, publish a blog, embed it anywhere";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgCard({
    eyebrow: "Booom",
    title: "Your blog, on your site, with one script tag.",
    subtitle: "Write in the studio. Publish to a hosted blog. Embed your latest posts anywhere.",
  });
}
