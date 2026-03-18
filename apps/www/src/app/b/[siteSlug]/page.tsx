import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPublishedDate, getBlogIndex } from "@/lib/blog";

type PageProps = {
  params: Promise<{ siteSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { siteSlug } = await params;
  const data = await getBlogIndex(siteSlug);

  if (!data) {
    return {
      title: "Blog Not Found | Booom",
    };
  }

  return {
    title: `${data.site.name} | Booom`,
    description:
      data.site.description || `Posts published on ${data.site.name} via Booom.`,
  };
}

export default async function BlogIndexPage({ params }: PageProps) {
  const { siteSlug } = await params;
  const data = await getBlogIndex(siteSlug);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf2_0%,#f3eadb_100%)] px-6 py-12 text-stone-950 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-4xl border border-black/8 bg-white/78 p-8 shadow-[0_24px_80px_rgba(55,39,27,0.12)] sm:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
            Booom Blog
          </p>
          <h1 className="mt-4 text-5xl font-medium tracking-[-0.06em] sm:text-6xl">
            {data.site.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            {data.site.description || "A developer-first publication powered by Booom."}
          </p>
        </div>

        <section className="mt-8 space-y-4">
          {data.posts.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-black/10 bg-white/70 p-8 text-stone-600">
              No published posts yet.
            </div>
          ) : (
            data.posts.map((post) => (
              <article
                className="rounded-4xl border border-black/8 bg-white/78 p-8 shadow-[0_18px_44px_rgba(55,39,27,0.08)] transition hover:-translate-y-0.5"
                key={post._id}
              >
                <p className="text-sm uppercase tracking-[0.28em] text-orange-700">
                  {formatPublishedDate(post.publishedAt)}
                </p>
                <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em]">
                  <Link href={`/b/${data.site.slug}/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
                  {post.excerpt || "Open the post to read the full entry."}
                </p>
                <div className="mt-6">
                  <Link
                    className="inline-flex rounded-full border border-black/10 bg-stone-950 px-4 py-2 text-sm font-medium text-stone-50"
                    href={`/b/${data.site.slug}/${post.slug}`}
                  >
                    Read post
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
