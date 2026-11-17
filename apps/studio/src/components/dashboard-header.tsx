import { Fragment } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import type { PostRecord, SiteRecord } from "../lib/convex-api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

type DashboardHeaderProps = {
  site: SiteRecord | null;
  posts: PostRecord[] | undefined;
  onActionsMount: (element: HTMLElement | null) => void;
};

type Crumb = { label: string; to?: string };

export function DashboardHeader({ site, posts, onActionsMount }: DashboardHeaderProps) {
  const { pathname } = useLocation();
  const { postId } = useParams();

  const crumbs: Crumb[] = [];

  if (!site) {
    crumbs.push({ label: "Set up your blog" });
  } else if (pathname === "/dashboard/settings") {
    crumbs.push({ label: "Blog settings" });
  } else if (pathname === "/dashboard/embed") {
    crumbs.push({ label: "Embed" });
  } else if (pathname === "/dashboard/posts/new") {
    crumbs.push({ label: "Posts", to: "/dashboard" }, { label: "New post" });
  } else if (pathname.startsWith("/dashboard/posts/")) {
    const post = posts?.find((entry) => entry._id === postId);
    crumbs.push(
      { label: "Posts", to: "/dashboard" },
      { label: post?.title || (posts ? "Untitled" : "…") },
    );
  } else {
    crumbs.push({ label: "Posts" });
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/85 px-3 backdrop-blur-md sm:px-4">
      <SidebarTrigger className="-ml-1 shrink-0" />
      <span aria-hidden className="h-5 w-px bg-border" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <Fragment key={`${crumb.label}-${index}`}>
                <BreadcrumbItem className={isLast ? "min-w-0" : "hidden sm:inline-flex"}>
                  {crumb.to && !isLast ? (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.to}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="truncate font-medium">{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast ? <BreadcrumbSeparator className="hidden sm:inline-flex" /> : null}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex shrink-0 items-center gap-2" ref={onActionsMount} />
    </header>
  );
}
