import { SignInButton } from "@clerk/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Footer } from "./footer";

export function HomePage() {
  return (
    <main className="relative h-screen overflow-hidden bg-grid font-sans mx-auto max-w-310">
      <div className="px-8 sm:px-6 h-full flex flex-col">
        <header className="py-6 flex items-center justify-between mx-2">
          <span className="text-2xl font-extrabold tracking-tight">Booom</span>
          <nav className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="https://booom.dev/embed-demo">Docs</a>
            <a className="hover:text-foreground transition-colors" href="https://booom.dev">Home</a>
          </nav>
        </header>

        <section className="relative z-10 grid gap-16 lg:grid-cols-12 lg:gap-8 flex-1 items-center pb-40">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <h1 className="text-[3.5rem] font-bold leading-[0.95] tracking-tighter text-foreground sm:text-[5.5rem] lg:text-[7rem]">
              YOUR WRITING<br />
              <span className="text-primary">STARTS HERE.</span>
            </h1>

            <div className="mt-10 max-w-2xl border-l-4 border-primary pl-6">
              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl font-medium">
                Write. Publish. Done.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-semibold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 cursor-pointer"
                >
                  Sign in
                </Button>
              </SignInButton>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-4 justify-center">
            <Card className="p-2 border-border/50 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">new-post.md</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex gap-2 border-b border-border/50 pb-3">
                  {["B", "I", "H1", "—", "✦"].map((t) => (
                    <button key={t} className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors font-mono">
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2 font-mono text-xs">
                  <div className="text-foreground font-bold text-sm">Why I love writing in plain text</div>
                  <div className="text-muted-foreground leading-relaxed">
                    There's something freeing about a blank page with no distractions. Just you, your thoughts, and a cursor...
                  </div>
                  <div className="text-muted-foreground opacity-50 leading-relaxed">
                    The best ideas come when you stop trying to format and just write.
                  </div>
                  <div className="text-muted-foreground opacity-30 leading-relaxed">
                    Sometimes the hardest part is starting. So just start.
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="h-3.5 w-px bg-primary animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-3 mt-1">
                  <span className="text-xs text-muted-foreground">42 words</span>
                  <button className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition-opacity">
                    Publish
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}