import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Footer } from "@/components/footer";
import { geistUi, newsreader } from "@/lib/fonts";

const STUDIO_URL = "https://studio.booom.dev";
const SNIPPET = `<script async src="https://booom.dev/embed/v1.js" data-site="your-blog"></script>`;

const samplePosts = [
  {
    date: "Nov 12, 2026",
    title: "What I learned shipping a side project in a month",
    excerpt: "Cut scope early, write the changelog first, and ship on a Tuesday.",
  },
  {
    date: "Oct 30, 2026",
    title: "Notes on caching at the edge",
    excerpt: "Three rules that stopped our pages from going stale.",
  },
  {
    date: "Oct 8, 2026",
    title: "Why I stopped using a static site generator",
    excerpt: "Rebuilds, plugins and a 400-line config. Here’s what replaced it.",
  },
];

const steps = [
  {
    title: "Write",
    body: "A focused Markdown editor with drafts, a live preview and ⌘S to save. Your words, nothing else on screen.",
  },
  {
    title: "Publish",
    body: "Every post goes live on your hosted blog at booom.dev/b/you, with an RSS feed and share previews built in.",
  },
  {
    title: "Embed",
    body: "Paste one script tag into any site. Your latest posts appear there and update the moment you publish.",
  },
];

export default function Home() {
  return (
    <div
      className={`${geistUi.variable} ${newsreader.variable} flex min-h-screen flex-col bg-background font-ui text-foreground`}
    >
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-md bg-primary font-reading text-base font-semibold text-primary-foreground"
          >
            B
          </span>
          Booom
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Button asChild className="hidden sm:inline-flex" variant="ghost">
            <Link href="/embed-demo">Playground</Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={STUDIO_URL}>Sign in</a>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-14 px-5 pt-12 pb-24 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          <div>
            <h1 className="max-w-xl text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
              Your blog, on your site, with one script tag.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Write in a calm editor, publish to a hosted blog, and show your latest posts on
              any website. No CMS to run, no rebuilds when you publish.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={STUDIO_URL}>Start writing</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/embed-demo">Try the embed</Link>
              </Button>
            </div>
          </div>

          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="flex items-center justify-between border-b py-1 pr-1 pl-4">
                <span className="text-xs text-muted-foreground">Paste this into your site</span>
                <CopyButton value={SNIPPET} />
              </div>
              <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6 break-all whitespace-pre-wrap text-foreground/90">
                {SNIPPET}
              </pre>
            </div>

            <div className="mt-4 rounded-xl border border-[#e6e4df] bg-[#fdfdfc] px-6 pt-6 text-[#1d1c1a] shadow-2xl shadow-black/40 sm:px-7">
              <p className="font-reading text-[1.65rem] leading-tight font-medium">Field notes</p>
              <p className="mt-1 font-reading text-base text-[#4a4844] italic">
                Building small things on the web.
              </p>
              <ul className="mt-5 border-t border-[#e6e4df]">
                {samplePosts.map((post) => (
                  <li
                    className="grid gap-x-6 gap-y-0.5 border-b border-[#e6e4df] py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)]"
                    key={post.title}
                  >
                    <span className="text-xs text-[#75726c] tabular-nums sm:pt-1.5">{post.date}</span>
                    <span>
                      <span className="block font-reading text-lg leading-snug font-medium">
                        {post.title}
                      </span>
                      <span className="mt-0.5 block font-reading text-[15px] text-[#4a4844]">
                        {post.excerpt}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between py-3.5 text-xs text-[#75726c]">
                <span>All posts</span>
                <span>Published with Booom</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {steps.map((step, index) => (
                <li className="border-t pt-5" key={step.title}>
                  <span className="text-sm text-muted-foreground tabular-nums">{index + 1}</span>
                  <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <a href={STUDIO_URL}>Create your blog</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
