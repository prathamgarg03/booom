import { Button } from "@/components/ui/button";
import { BlogPreviewCard } from "@/components/blog-preview-card";
import { EmbedSnippetCard } from "@/components/embed-snippet-card";
import { Footer } from "@/components/footer";

export default function Home() {
  const embedSnippet = `<script\n  async\n  src="https://booom.dev/embed/v1.js"\n  data-site="your-site-slug"\n>\n</script>`;

  return (
    <main className="relative h-screen overflow-hidden bg-grid font-sans mx-auto max-w-310">
      <div className="px-8 py-6 sm:px-6 md:py-12">
        <header className="mb-12 flex items-center justify-between mx-2">
          <span className="text-2xl font-extrabold tracking-tight">Booom</span>
          <nav className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="/embed-demo">Docs</a>
            <a className="hover:text-foreground transition-colors" href="https://booom-studio.vercel.app">Studio</a>
          </nav>
        </header>

        <section className="relative z-10 grid gap-16 lg:grid-cols-12 lg:gap-8 mt-12">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <h1 className="text-[4rem] font-bold leading-[0.95] tracking-tighter text-foreground sm:text-[6rem] lg:text-[7.5rem]">
              BLOGS IN <br />
              <span className="text-primary">ONE SCRIPT.</span>
            </h1>

            <div className="mt-10 max-w-2xl border-l-4 border-primary pl-6">
              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl font-medium">
                Drop a single <code className="text-foreground bg-muted px-1.5 py-0.5 rounded-md text-sm mx-1">&lt;script&gt;</code> tag. Get a fully-featured, SEO-ready blog — instantly.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button className="py-6 px-8 text-base font-semibold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1" variant="default" asChild>
                <a href="https://booom-studio.vercel.app">Start for Free</a>
              </Button>
              <Button className="py-6 px-8 text-base font-semibold transition-all hover:-translate-y-1" variant="secondary" asChild>
                <a href="/b/prathamgarg-com">Live Demo</a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-4 gap-6 justify-center ">
            <EmbedSnippetCard embedSnippet={embedSnippet} />
            <BlogPreviewCard />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
