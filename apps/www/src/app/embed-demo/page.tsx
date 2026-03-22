"use client";

import { useEffect, useMemo, useState } from "react";

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clampLimit(input: string) {
  const value = Number.parseInt(input, 10);

  if (!Number.isFinite(value) || value <= 0) {
    return 5;
  }

  return Math.min(value, 12);
}

function buildSnippet({
  origin,
  siteSlug,
  limit,
  theme,
  target,
}: {
  origin: string;
  siteSlug: string;
  limit: number;
  theme: "light" | "dark";
  target?: string;
}) {
  const attrs = [
    "async",
    `src="${origin}/embed/v1.js"`,
    `data-site="${siteSlug}"`,
    `data-limit="${String(limit)}"`,
    `data-theme="${theme}"`,
  ];

  if (target) {
    attrs.push(`data-target="${target}"`);
  }

  return `<script ${attrs.join(" ")}></script>`;
}

function buildPreviewDocument(previewSnippet: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Booom Embed Demo</title>
    <style>
      body {
        margin: 0;
        padding: 28px;
        background:
          radial-gradient(circle at top left, rgba(255, 137, 76, 0.16), transparent 30%),
          linear-gradient(180deg, #fdf8ef 0%, #f5ede0 100%);
        color: #1d1a17;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .frame {
        max-width: 720px;
        margin: 0 auto;
        padding: 22px;
        border: 1px solid rgba(29, 26, 23, 0.1);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.76);
        box-shadow: 0 20px 50px rgba(55, 39, 27, 0.12);
      }

      .eyebrow {
        margin: 0;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #9b6040;
      }

      h1 {
        margin: 10px 0 12px;
        font-size: 34px;
        line-height: 1;
      }

      p {
        margin: 0 0 18px;
        line-height: 1.6;
        color: #5c5047;
      }

      #booom-preview {
        min-height: 160px;
      }
    </style>
  </head>
  <body>
    <main class="frame">
      <p class="eyebrow">Host page preview</p>
      <h1>Testing the live Booom widget</h1>
      <p>This iframe simulates a plain site that only knows how to paste the script tag.</p>
      <div id="booom-preview"></div>
      ${previewSnippet}
    </main>
  </body>
</html>`;
}

export default function EmbedDemoPage() {
  const [siteSlug, setSiteSlug] = useState("");
  const [limitInput, setLimitInput] = useState("5");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setSiteSlug(normalizeSlug(searchParams.get("site") ?? ""));
    setLimitInput(searchParams.get("limit") ?? "5");
    setTheme(searchParams.get("theme") === "dark" ? "dark" : "light");
  }, []);

  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const normalizedSiteSlug = normalizeSlug(siteSlug);
  const limit = clampLimit(limitInput);

  const snippet = useMemo(() => {
    if (!origin || !normalizedSiteSlug) {
      return "";
    }

    return buildSnippet({
      origin,
      siteSlug: normalizedSiteSlug,
      limit,
      theme,
    });
  }, [limit, normalizedSiteSlug, origin, theme]);

  const previewDocument = useMemo(() => {
    if (!origin || !normalizedSiteSlug) {
      return buildPreviewDocument("");
    }

    return buildPreviewDocument(
      buildSnippet({
        origin,
        siteSlug: normalizedSiteSlug,
        limit,
        theme,
        target: "#booom-preview",
      }),
    );
  }, [limit, normalizedSiteSlug, origin, theme]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10 text-stone-900 sm:px-10">
      <section className="rounded-4xl border border-black/8 bg-[linear-gradient(135deg,rgba(255,248,238,0.96),rgba(248,238,223,0.92))] p-8 shadow-[0_24px_80px_rgba(55,39,27,0.12)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Embed Demo</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-[-0.05em] text-stone-950 sm:text-6xl">
          Test the one-line widget against a real hosted Booom site.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-stone-600 sm:text-lg">
          This page rebuilds a tiny host document inside an iframe, injects the live
          <span className="mx-2 inline-flex rounded-md bg-black/6 px-2 py-1 font-mono text-sm text-stone-900">
            /embed/v1.js
          </span>
          script, and shows exactly what another website would see.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <article className="rounded-[1.75rem] border border-black/8 bg-white/80 p-6 shadow-[0_12px_40px_rgba(55,39,27,0.08)]">
          <p className="text-xs uppercase tracking-[0.28em] text-orange-700">Configuration</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-stone-950">
            Pick a site slug and render options.
          </h2>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-stone-600">Site slug</span>
              <input
                className="rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-stone-950 outline-none ring-0 transition focus:border-orange-300"
                onChange={(event) => setSiteSlug(normalizeSlug(event.target.value))}
                placeholder="my-engineering-blog"
                value={siteSlug}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-stone-600">Post limit</span>
              <input
                className="rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-stone-950 outline-none ring-0 transition focus:border-orange-300"
                inputMode="numeric"
                onChange={(event) => setLimitInput(event.target.value)}
                placeholder="5"
                value={limitInput}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-stone-600">Theme</span>
              <select
                className="rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-stone-950 outline-none ring-0 transition focus:border-orange-300"
                onChange={(event) =>
                  setTheme(event.target.value === "dark" ? "dark" : "light")
                }
                value={theme}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>

          <div className="mt-6 rounded-3xl border border-black/8 bg-stone-950 p-4 text-stone-50">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Script snippet</p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm leading-7 text-stone-100">
              {snippet || "<script async src=\"https://your-booom-host/embed/v1.js\" data-site=\"your-site-slug\"></script>"}
            </pre>
          </div>

          <div className="mt-6 space-y-3 text-sm leading-7 text-stone-600">
            <p>Use a site slug that already has published posts in Booom.</p>
            <p>The preview iframe is intentionally plain so widget issues are easier to spot.</p>
            <p>For local testing, this page expects the `www` app to be running on the same origin that serves the script and API route.</p>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-black/8 bg-white/80 p-6 shadow-[0_12px_40px_rgba(55,39,27,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-orange-700">Live preview</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-stone-950">
                What another site would render
              </h2>
            </div>
            {normalizedSiteSlug ? (
              <a
                className="rounded-full border border-black/10 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5"
                href={`/b/${normalizedSiteSlug}`}
                rel="noreferrer"
                target="_blank"
              >
                Open hosted blog
              </a>
            ) : null}
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-black/8 bg-[#f5ede0]">
            <iframe
              className="min-h-140 w-full border-0 bg-transparent"
              sandbox="allow-scripts allow-popups"
              srcDoc={previewDocument}
              title="Booom embed preview"
            />
          </div>

          <p className="mt-4 text-sm leading-7 text-stone-600">
            If the widget is empty, either the site slug does not exist yet or there
            are no published posts for that site.
          </p>
        </article>
      </section>
    </main>
  );
}
