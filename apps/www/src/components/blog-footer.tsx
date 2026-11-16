import Link from "next/link";

export function BlogFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6 text-sm text-ink-muted">
      <div>{children}</div>
      <Link className="transition-colors hover:text-ink" href="/">
        Published with Booom
      </Link>
    </footer>
  );
}
