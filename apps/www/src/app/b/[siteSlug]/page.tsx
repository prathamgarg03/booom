import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogFooter } from "@/components/blog-footer";
import { formatPublishedDate, formatShortDate, getBlogIndex } from "@/lib/blog";

type PageProps = {
  params: Promise<{ siteSlug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const data = await getBlogIndex(siteSlug);

  if (!data) {
    return {
      title: "Blog not found",
    };
  }

  return {
    title: data.site.name,
    description: data.site.description || `Writing from ${data.site.name}.`,
    alternates: {
      canonical: `/b/${data.site.slug}`,
      types: { "application/rss+xml": `/b/${data.site.slug}/rss.xml` },
    },
  };
}

export default async function BlogIndexPage({ params }: PageProps) {
  const { siteSlug } = await params;
  const data = await getBlogIndex(siteSlug);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[46rem] px-5 pt-16 pb-12 sm:px-8 sm:pt-28">
      <header>
        <h1 className="font-reading text-[2.75rem] leading-[1.05] font-medium tracking-[-0.015em] text-balance sm:text-[3.5rem]">
          {data.site.name}
        </h1>
        {data.site.description ? (
          <p className="mt-4 max-w-[34rem] font-reading text-xl leading-relaxed text-ink-soft italic">
            {data.site.description}
          </p>
        ) : null}
      </header>

      <section aria-label="Posts" className="mt-16 sm:mt-20">
        {data.posts.length === 0 ? (
          <p className="border-t border-rule pt-8 font-reading text-lg text-ink-muted">
            Nothing published yet. Check back soon.
          </p>
        ) : (
          <ol className="border-t border-rule">
            {data.posts.map((post) => (
              <li className="border-b border-rule" key={post._id}>
                <Link
                  className="group grid gap-x-8 gap-y-1 py-7 outline-none focus-visible:bg-code sm:grid-cols-[8.5rem_minmax(0,1fr)]"
                  href={`/b/${data.site.slug}/${post.slug}`}
                >
                  <time
                    className="text-sm text-ink-muted tabular-nums sm:pt-1.5"
                    dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}
                    title={formatPublishedDate(post.publishedAt)}
                  >
                    {formatShortDate(post.publishedAt)}
                  </time>
                  <div className="min-w-0">
                    <h2 className="font-reading text-2xl leading-snug font-medium text-pretty decoration-ink/30 decoration-1 underline-offset-[5px] group-hover:underline">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-2 max-w-[36rem] font-reading text-lg leading-relaxed text-ink-soft">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <BlogFooter>
        <span className="flex gap-5">
          <span>
            {data.posts.length} {data.posts.length === 1 ? "post" : "posts"}
          </span>
          <a className="transition-colors hover:text-ink" href={`/b/${data.site.slug}/rss.xml`}>
            RSS
          </a>
        </span>
      </BlogFooter>
    </main>
  );
}
