import test from "node:test";
import assert from "node:assert/strict";
import {
  buildEmbedPayload,
  DEFAULT_EMBED_LIMIT,
  getCanonicalOrigin,
  MAX_EMBED_LIMIT,
  normalizeEmbedSiteSlug,
  parseEmbedLimit,
} from "./embed";

test("normalizeEmbedSiteSlug accepts valid slugs and rejects invalid values", () => {
  assert.equal(normalizeEmbedSiteSlug("prathamgarg-com"), "prathamgarg-com");
  assert.equal(normalizeEmbedSiteSlug("  Prathamgarg-Com  "), "prathamgarg-com");
  assert.equal(normalizeEmbedSiteSlug(""), null);
  assert.equal(normalizeEmbedSiteSlug("hello world"), null);
  assert.equal(normalizeEmbedSiteSlug("two--dashes"), null);
});

test("parseEmbedLimit falls back for invalid input and clamps large values", () => {
  assert.equal(parseEmbedLimit(undefined), DEFAULT_EMBED_LIMIT);
  assert.equal(parseEmbedLimit("abc"), DEFAULT_EMBED_LIMIT);
  assert.equal(parseEmbedLimit("0"), DEFAULT_EMBED_LIMIT);
  assert.equal(parseEmbedLimit("2"), 2);
  assert.equal(parseEmbedLimit("999"), MAX_EMBED_LIMIT);
});

test("buildEmbedPayload preserves empty published results for known sites", () => {
  const payload = buildEmbedPayload(
    {
      site: {
        name: "Pratham Garg",
        slug: "prathamgarg-com",
        description: "Portfolio website",
      },
      posts: [],
    },
    "https://booom.dev",
    5,
  );

  assert.equal(payload.site.url, "https://booom.dev/b/prathamgarg-com");
  assert.deepEqual(payload.posts, []);
});

test("buildEmbedPayload limits posts and builds canonical urls", () => {
  const payload = buildEmbedPayload(
    {
      site: {
        name: "Pratham Garg",
        slug: "prathamgarg-com",
        description: "Portfolio website",
      },
      posts: [
        {
          _id: "post-1",
          title: "First blog",
          slug: "first-blog",
          excerpt: "One",
          publishedAt: 100,
        },
        {
          _id: "post-2",
          title: "Second blog",
          slug: "second-blog",
          excerpt: "Two",
          publishedAt: 200,
        },
      ],
    },
    "https://booom.dev",
    1,
  );

  assert.equal(payload.posts.length, 1);
  assert.equal(payload.posts[0]?.url, "https://booom.dev/b/prathamgarg-com/first-blog");
});

test("getCanonicalOrigin maps old hosts to booom.dev and keeps others", () => {
  assert.equal(getCanonicalOrigin(new URL("https://booom-www.vercel.app/api/embed/x")), "https://booom.dev");
  assert.equal(getCanonicalOrigin(new URL("https://www.booom.dev/api/embed/x")), "https://booom.dev");
  assert.equal(getCanonicalOrigin(new URL("https://booom.dev/api/embed/x")), "https://booom.dev");
  assert.equal(getCanonicalOrigin(new URL("http://localhost:3001/api/embed/x")), "http://localhost:3001");
});
