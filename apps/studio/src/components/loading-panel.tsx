export function LoadingPanel() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading Booom Studio"
      className="flex min-h-svh items-center justify-center"
    >
      <span className="flex size-10 animate-pulse items-center justify-center rounded-lg bg-primary font-serif text-xl font-semibold text-primary-foreground">
        B
      </span>
    </div>
  );
}
