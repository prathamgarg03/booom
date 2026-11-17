import { SignInButton } from "@clerk/react";
import { Button } from "./ui/button";

export function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <span
            aria-hidden
            className="flex size-11 items-center justify-center rounded-lg bg-primary font-serif text-2xl font-semibold text-primary-foreground"
          >
            B
          </span>
          <h1 className="mt-8 font-serif text-4xl leading-tight font-medium">Booom Studio</h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to write, publish to your blog, and manage the posts you embed on your site.
          </p>
          <SignInButton mode="modal">
            <Button className="mt-8 w-full" size="lg">
              Sign in or create an account
            </Button>
          </SignInButton>
          <p className="mt-6 text-sm text-muted-foreground">
            New here?{" "}
            <a className="text-foreground underline underline-offset-4 hover:text-primary" href="https://booom.dev">
              See what Booom does
            </a>
          </p>
        </div>
      </main>
      <footer className="flex justify-center gap-6 px-5 py-6 text-xs text-muted-foreground">
        <a className="hover:text-foreground" href="https://booom.dev">
          booom.dev
        </a>
        <a className="hover:text-foreground" href="https://booom.dev/embed-demo">
          Embed playground
        </a>
      </footer>
    </div>
  );
}
