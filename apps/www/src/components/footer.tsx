import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground sm:px-8">
        <span>Booom</span>
        <nav className="flex gap-6">
          <Link className="transition-colors hover:text-foreground" href="/embed-demo">
            Embed playground
          </Link>
          <a className="transition-colors hover:text-foreground" href="https://studio.booom.dev">
            Studio
          </a>
        </nav>
      </div>
    </footer>
  );
}
