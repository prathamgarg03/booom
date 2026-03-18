import { normalizeSlug } from "./slugs";

type PublicPostShape = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  status: "draft" | "published";
  publishedAt?: number;
  updatedAt: number;
};

export function listPublishedPostSummaries<T extends PublicPostShape>(posts: T[]) {
  return posts
    .filter((post) => post.status === "published")
    .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
    .map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      publishedAt: post.publishedAt ?? null,
      updatedAt: post.updatedAt,
    }));
}

export function findPublishedPostBySlug<T extends PublicPostShape>(
  posts: T[],
  postSlug: string,
) {
  const normalizedSlug = normalizeSlug(postSlug);

  return (
    posts.find(
      (post) => post.status === "published" && normalizeSlug(post.slug) === normalizedSlug,
    ) ?? null
  );
}
