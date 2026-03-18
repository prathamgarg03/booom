import test from "node:test";
import assert from "node:assert/strict";
import {
  findPublishedPostBySlug,
  listPublishedPostSummaries,
} from "../convex/lib/publicPosts";

const posts = [
  {
    _id: "draft-1",
    title: "Draft post",
    slug: "draft-post",
    excerpt: "Should stay private",
    body: "Draft body",
    status: "draft" as const,
    updatedAt: 100,
  },
  {
    _id: "published-1",
    title: "Published post",
    slug: "published-post",
    excerpt: "Visible publicly",
    body: "Published body",
    status: "published" as const,
    publishedAt: 200,
    updatedAt: 200,
  },
  {
    _id: "published-2",
    title: "Newer published post",
    slug: "newer-published-post",
    excerpt: "Newest visible post",
    body: "Newest body",
    status: "published" as const,
    publishedAt: 300,
    updatedAt: 300,
  },
];

test("listPublishedPostSummaries excludes drafts and sorts newest first", () => {
  const result = listPublishedPostSummaries(posts);

  assert.equal(result.length, 2);
  assert.deepEqual(
    result.map((post) => post.slug),
    ["newer-published-post", "published-post"],
  );
  assert.ok(result.every((post) => post.slug !== "draft-post"));
});

test("findPublishedPostBySlug does not return drafts", () => {
  const draft = findPublishedPostBySlug(posts, "draft-post");
  const published = findPublishedPostBySlug(posts, "published-post");

  assert.equal(draft, null);
  assert.equal(published?._id, "published-1");
});

test("findPublishedPostBySlug normalizes incoming slugs", () => {
  const result = findPublishedPostBySlug(posts, "Newer Published Post");

  assert.equal(result?._id, "published-2");
});
