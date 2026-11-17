import { Logo } from "./logo";

export function LoadingPanel() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading Booom Studio"
      className="flex min-h-svh items-center justify-center"
    >
      <Logo className="h-10 w-auto animate-pulse text-primary" />
    </div>
  );
}
