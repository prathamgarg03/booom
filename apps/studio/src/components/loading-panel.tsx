export function LoadingPanel() {
  return (
    <main className="relative h-screen overflow-hidden bg-grid font-sans mx-auto max-w-310 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-2xl font-extrabold tracking-tight">Booom</span>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
        </div>
        <p className="text-sm text-muted-foreground tracking-tight">Checking your session…</p>
      </div>
    </main>
  );
}