"use client";

import { Suspense, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy, ExternalLink, Lock, Monitor, RotateCw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LIMITS = [3, 5, 8, 12] as const;
type Theme = "light" | "dark";
type Viewport = "desktop" | "mobile";

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function closestLimit(input: string | null) {
  const value = Number.parseInt(input ?? "", 10);

  if (!Number.isFinite(value) || value <= 0) {
    return 5;
  }

  return LIMITS.reduce((best, option) =>
    Math.abs(option - value) < Math.abs(best - value) ? option : best,
  );
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
  theme: Theme;
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

/** A deliberately ordinary personal site, so the widget is judged in context. */
function buildHostDocument(snippet: string, theme: Theme) {
  const dark = theme === "dark";
  const colors = dark
    ? { bg: "#111110", ink: "#ecebe7", muted: "#8f8c86", rule: "#2a2927" }
    : { bg: "#f7f7f5", ink: "#1d1c1a", muted: "#75726c", rule: "#e4e2dd" };

  const body = snippet
    ? `<div id="booom-preview"></div>${snippet}`
    : `<p class="empty">Enter your blog address on the left to load your posts here.</p>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your site</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: ${colors.bg};
        color: ${colors.ink};
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 680px;
        margin: 0 auto;
        padding: 20px 24px;
        font-size: 14px;
      }
      nav strong { font-weight: 600; }
      nav span { color: ${colors.muted}; margin-left: 18px; }
      main { max-width: 680px; margin: 0 auto; padding: 32px 24px 64px; }
      h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.2; letter-spacing: -0.01em; }
      .lede { margin: 0 0 28px; color: ${colors.muted}; line-height: 1.6; }
      .empty {
        margin: 0;
        padding: 28px;
        border: 1px dashed ${colors.rule};
        border-radius: 12px;
        color: ${colors.muted};
        text-align: center;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <nav>
      <strong>your-site.com</strong>
      <div><span>Projects</span><span>Writing</span><span>About</span></div>
    </nav>
    <main>
      <h1>Writing</h1>
      <p class="lede">Notes and longer posts. The list below comes from Booom.</p>
      ${body}
    </main>
  </body>
</html>`;
}

const subscribeNoop = () => () => {};

function useOrigin() {
  return useSyncExternalStore(
    subscribeNoop,
    () => window.location.origin,
    () => "",
  );
}

function Playground() {
  const searchParams = useSearchParams();
  const origin = useOrigin();
  const [siteInput, setSiteInput] = useState(() => normalizeSlug(searchParams.get("site") ?? ""));
  const [limit, setLimit] = useState<(typeof LIMITS)[number]>(() =>
    closestLimit(searchParams.get("limit")),
  );
  const [theme, setTheme] = useState<Theme>(() =>
    searchParams.get("theme") === "dark" ? "dark" : "light",
  );
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const siteSlug = normalizeSlug(siteInput);

  const snippet = useMemo(
    () =>
      origin && siteSlug
        ? buildSnippet({ origin, siteSlug, limit, theme })
        : "",
    [limit, origin, siteSlug, theme],
  );

  const hostDocument = useMemo(
    () =>
      buildHostDocument(
        origin && siteSlug
          ? buildSnippet({ origin, siteSlug, limit, theme, target: "#booom-preview" })
          : "",
        theme,
      ),
    [limit, origin, siteSlug, theme],
  );

  async function copySnippet() {
    if (!snippet) {
      return;
    }

    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span
            aria-hidden
            className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground"
          >
            B
          </span>
          Booom
        </Link>
        <span aria-hidden className="h-5 w-px bg-border" />
        <span className="text-sm text-muted-foreground">Embed playground</span>
      </header>

      <div className="grid flex-1 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="space-y-8 border-b px-4 py-8 sm:px-6 lg:border-r lg:border-b-0">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Embed playground</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              See how your latest posts look on another website, then copy the script tag.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-slug">Blog address</Label>
            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-input bg-input/30 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <span className="shrink-0 pl-3 font-mono text-xs text-muted-foreground select-none">
                /b/
              </span>
              <Input
                autoFocus={!siteSlug}
                className="h-full rounded-none border-0 bg-transparent pl-0.5 font-mono text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
                id="site-slug"
                onBlur={() => setSiteInput((current) => normalizeSlug(current))}
                onChange={(event) =>
                  setSiteInput(event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))
                }
                placeholder="your-blog"
                spellCheck={false}
                value={siteInput}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The part after /b/ in your public blog link.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Tabs onValueChange={(value) => setTheme(value as Theme)} value={theme}>
                <TabsList>
                  <TabsTrigger value="light">Light</TabsTrigger>
                  <TabsTrigger value="dark">Dark</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Posts to show</Label>
              <Tabs
                onValueChange={(value) => setLimit(Number(value) as (typeof LIMITS)[number])}
                value={String(limit)}
              >
                <TabsList>
                  {LIMITS.map((value) => (
                    <TabsTrigger className="px-2.5 tabular-nums" key={value} value={String(value)}>
                      {value}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Script tag</Label>
              <Button disabled={!snippet} onClick={() => void copySnippet()} size="sm">
                {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-lg border bg-card p-3 font-mono text-xs leading-5 break-all whitespace-pre-wrap text-foreground/90">
              {snippet || "Add your blog address to generate the script tag."}
            </pre>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Paste it into your site&apos;s HTML where the list should appear. Only published
              posts show, and new ones appear automatically.
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col gap-4 bg-sidebar px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs onValueChange={(value) => setViewport(value as Viewport)} value={viewport}>
              <TabsList>
                <TabsTrigger aria-label="Desktop width" value="desktop">
                  <Monitor />
                  <span className="hidden sm:inline">Desktop</span>
                </TabsTrigger>
                <TabsTrigger aria-label="Phone width" value="mobile">
                  <Smartphone />
                  <span className="hidden sm:inline">Phone</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-1">
              <Button
                disabled={!siteSlug}
                onClick={() => setReloadKey((key) => key + 1)}
                size="sm"
                variant="ghost"
              >
                <RotateCw data-icon="inline-start" />
                Reload
              </Button>
              {siteSlug ? (
                <Button asChild size="sm" variant="ghost">
                  <a href={`/b/${siteSlug}`} rel="noreferrer" target="_blank">
                    Open blog
                    <ExternalLink data-icon="inline-end" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <div
            className={`mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-2xl shadow-black/30 transition-[max-width] duration-300 motion-reduce:transition-none ${
              viewport === "mobile" ? "max-w-[390px]" : "max-w-none"
            }`}
          >
            <div className="flex h-10 shrink-0 items-center justify-center border-b px-3">
              <span className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                <Lock className="size-3" />
                your-site.com/writing
              </span>
            </div>
            {origin ? (
              <iframe
                className="min-h-[560px] w-full flex-1 border-0"
                key={reloadKey}
                sandbox="allow-scripts allow-popups"
                srcDoc={hostDocument}
                title="Preview of the embed on a sample website"
              />
            ) : (
              <div className="min-h-[560px] flex-1" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function EmbedDemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Playground />
    </Suspense>
  );
}
