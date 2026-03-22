import { UserButton } from "@clerk/react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import type { SiteRecord } from "../lib/convex-api";

type DashboardHeaderProps = {
  site: SiteRecord | null;
  publicAppUrl: string;
  userLabel: string;
};

export function DashboardHeader({
  site,
  publicAppUrl,
  userLabel,
}: DashboardHeaderProps) {
  const location = useLocation();
  const title = useMemo(() => {
    if (location.pathname.startsWith("/dashboard/posts/")) {
      return "Post Editor";
    }

    return "Dashboard";
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="shrink-0" />
        <Separator className="h-6" orientation="vertical" />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Booom Studio
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {site ? (
          <Button asChild size="sm" variant="outline">
            <a href={`${publicAppUrl}/b/${site.slug}`} rel="noreferrer" target="_blank">
              View blog
            </a>
          </Button>
        ) : null}
        <Button asChild size="sm" variant="ghost">
          <Link to="/">Home</Link>
        </Button>
        <div className="flex items-center gap-3 border-l border-border/50 pl-3">
          <span className="text-sm font-medium text-foreground">{userLabel}</span>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
