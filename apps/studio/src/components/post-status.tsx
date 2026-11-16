import { cn } from "@/lib/utils";
import type { PostRecord } from "../lib/convex-api";

export function PostStatus({
  status,
  className,
}: {
  status: PostRecord["status"];
  className?: string;
}) {
  const isLive = status === "published";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        isLive ? "text-success" : "text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          isLive ? "bg-success shadow-[0_0_0_3px] shadow-success/15" : "border border-muted-foreground",
        )}
      />
      {isLive ? "Published" : "Draft"}
    </span>
  );
}
