export function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0">
      <div className="border-t border-border/40 mx-8 sm:mx-6" />
      <div className="mx-auto max-w-310 px-8 sm:px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-tight text-foreground">Booom</span>
          <span className="text-xs border border-border/60 rounded px-1.5 py-0.5">OSS</span>
        </div>
        <div className="flex gap-6 text-xs">
          <a href="https://booom.dev" className="hover:text-foreground transition-colors">booom.dev</a>
          <a href="https://booom.dev/embed-demo" className="hover:text-foreground transition-colors">Embed playground</a>
        </div>
      </div>
    </footer>
  );
}