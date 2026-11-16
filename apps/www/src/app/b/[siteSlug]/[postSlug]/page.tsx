import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFooter } from "@/components/blog-footer";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { formatPublishedDate, getBlogPost, readingMinutes } from "@/lib/blog";

type PageProps = {
  params: Promise<{ siteSlug: string; postSlug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { siteSlug, postSlug } = await params;
  const data = await getBlogPost(siteSlug, postSlug);

  if (!data) {
    return {
      title: "Post not found",
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

  const blogHref = `/b/${data.site.slug}`;
  const minutes = readingMinutes(data.post.body);

  return (
    <main className="mx-auto w-full max-w-[46rem] px-5 pt-8 pb-12 sm:px-8 sm:pt-12">
      <nav>
        <Link
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          href={blogHref}
        >
          <svg aria-hidden className="size-4" fill="none" viewBox="0 0 16 16">
            <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          {data.site.name}
        </Link>
      </nav>

      <article className="mt-14 sm:mt-20">
        <header>
          <h1 className="font-reading text-[2.5rem] leading-[1.08] font-medium tracking-[-0.015em] text-balance sm:text-[3.25rem]">
            {data.post.title}
          </h1>
          {data.post.excerpt ? (
            <p className="mt-5 font-reading text-[1.375rem] leading-normal text-ink-soft text-pretty italic">
              {data.post.excerpt}
            </p>
          ) : null}
          <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
            <time
              dateTime={
                data.post.publishedAt ? new Date(data.post.publishedAt).toISOString() : undefined
              }
            >
              {formatPublishedDate(data.post.publishedAt)}
            </time>
            <span>{minutes} min read</span>
          </p>
        </header>

        <div className="mt-10 border-t border-rule pt-10">
          <MarkdownRenderer markdown={data.post.body} />
        </div>
      </article>

      <BlogFooter>
        <Link className="transition-colors hover:text-ink" href={blogHref}>
          More from {data.site.name}
        </Link>
      </BlogFooter>
    </main>
  );
}
