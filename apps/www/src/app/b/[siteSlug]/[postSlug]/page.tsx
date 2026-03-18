import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { formatPublishedDate, getBlogPost } from "@/lib/blog";

type PageProps = {
  params: Promise<{ siteSlug: string; postSlug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { siteSlug, postSlug } = await params;
  const data = await getBlogPost(siteSlug, postSlug);

  if (!data) {
    return {
      title: "Post Not Found | Booom",
    };
  }

  return {
    title: `${data.post.title} | ${data.site.name}`,
    description: data.post.excerpt || data.site.description || data.post.title,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { siteSlug, postSlug } = await params;
  const data = await getBlogPost(siteSlug, postSlug);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf2_0%,#f3eadb_100%)] px-6 py-12 text-stone-950 sm:px-10">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-black/8 bg-white/78 p-8 shadow-[0_24px_80px_rgba(55,39,27,0.12)] sm:p-12">
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
          <Link href={`/b/${data.site.slug}`}>{data.site.name}</Link>
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-0.06em] sm:text-6xl">
          {data.post.title}
        </h1>
        <p className="mt-6 text-sm uppercase tracking-[0.24em] text-orange-700">
          Published {formatPublishedDate(data.post.publishedAt)}
        </p>
        {data.post.excerpt ? (
          <p className="mt-6 text-xl leading-8 text-stone-600">{data.post.excerpt}</p>
        ) : null}

        <div className="mt-12 border-t border-black/8 pt-8">
          <MarkdownRenderer markdown={data.post.body} />
        </div>

        <div className="mt-12 border-t border-black/8 pt-6">
          <Link
            className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-stone-900"
            href={`/b/${data.site.slug}`}
          >
            Back to {data.site.name}
          </Link>
        </div>
      </article>
    </main>
  );
}
