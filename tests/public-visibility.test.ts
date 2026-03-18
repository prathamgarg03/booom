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

test("published posts appear in public summaries and page lookups", () => {
  const publishedOnly = listPublishedPostSummaries(posts);
  const publishedPost = findPublishedPostBySlug(posts, "published-post");

  assert.deepEqual(
    publishedOnly.map((post) => post.slug),
    ["newer-published-post", "published-post"],
  );
  assert.equal(publishedPost?.title, "Published post");
});

test("unpublishing a post removes it from public summaries and post lookups", () => {
  const unpublishedPosts = posts.map((post) =>
    post._id === "published-1"
      ? {
          ...post,
          status: "draft" as const,
          publishedAt: undefined,
        }
      : post,
  );

  const summaries = listPublishedPostSummaries(unpublishedPosts);
  const singlePost = findPublishedPostBySlug(unpublishedPosts, "published-post");

  assert.equal(summaries.some((post) => post.slug === "published-post"), false);
  assert.equal(singlePost, null);
});

test("deleting a post removes it from all public visibility helpers", () => {
  const remainingPosts = posts.filter((post) => post._id !== "published-2");

  const summaries = listPublishedPostSummaries(remainingPosts);
  const singlePost = findPublishedPostBySlug(remainingPosts, "newer-published-post");

  assert.equal(summaries.some((post) => post.slug === "newer-published-post"), false);
  assert.equal(singlePost, null);
});
