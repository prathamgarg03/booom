import Link from "next/link";
import { geistUi } from "@/lib/fonts";

export default function NotFound() {
  return (
    <main
      className={`${geistUi.variable} flex min-h-screen flex-col items-start justify-center px-6 font-ui sm:px-16`}
    >
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        This page doesn’t exist
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The link may be out of date. Blogs live at booom.dev/b/your-blog.
      </p>
      <div className="mt-8 flex gap-4 text-sm font-medium">
        <Link className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90" href="/">
          Go home
        </Link>
        <Link className="rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground" href="/embed-demo">
          Embed playground
        </Link>
      </div>
    </main>
  );
}
