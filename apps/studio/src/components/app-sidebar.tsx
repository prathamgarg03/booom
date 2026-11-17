import { useClerk } from "@clerk/react";
import {
  ChevronsUpDown,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  LogOut,
  Plus,
  Settings,
  UserRound,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { StudioWorkspaceContext } from "../hooks/use-studio-workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";

type AppSidebarProps = {
  workspace: StudioWorkspaceContext;
};

function Monogram({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-primary font-serif text-[17px] font-semibold text-primary-foreground ${className}`}
    >
      {label.trim().charAt(0).toUpperCase() || "B"}
    </span>
  );
}

export function AppSidebar({ workspace }: AppSidebarProps) {
  const { site, posts, blogUrl, publicAppLabel, clerkUser, copyText } = workspace;
  const { pathname } = useLocation();
  const { isMobile } = useSidebar();
  const clerk = useClerk();

  const isPostsActive = pathname === "/dashboard" || /^\/dashboard\/posts\/(?!new$)/.test(pathname);
  const draftCount = posts?.filter((post) => post.status === "draft").length ?? 0;
  const userName = clerkUser?.fullName || clerkUser?.username || "Your account";
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            {site ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className="data-[state=open]:bg-sidebar-accent"
                    size="lg"
                    tooltip={site.name}
                  >
                    <Monogram label={site.name} />
                    <span className="grid min-w-0 flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium">{site.name}</span>
                      <span className="truncate font-mono text-[11px] text-muted-foreground">
                        /b/{site.slug}
                      </span>
                    </span>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-64"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="font-normal text-muted-foreground">
                    {publicAppLabel}/b/{site.slug}
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <a href={blogUrl} rel="noreferrer" target="_blank">
                      <ExternalLink />
                      Open public blog
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void copyText(blogUrl, "Blog link copied")}>
                    <Copy />
                    Copy blog link
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">
                      <Settings />
                      Blog settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size="lg">
                <Monogram label="Booom" />
                <span className="truncate text-sm font-medium">Booom Studio</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {site ? (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="border border-sidebar-border bg-sidebar-accent/40 hover:bg-sidebar-accent"
                    isActive={pathname === "/dashboard/posts/new"}
                    tooltip="New post"
                  >
                    <Link to="/dashboard/posts/new">
                      <Plus />
                      <span>New post</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Write</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isPostsActive} tooltip="Posts">
                    <NavLink end to="/dashboard">
                      <FileText />
                      <span>Posts</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {draftCount > 0 ? (
                    <SidebarMenuBadge className="text-muted-foreground">
                      {draftCount} {draftCount === 1 ? "draft" : "drafts"}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Share</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/embed"}
                    tooltip="Embed on your site"
                  >
                    <NavLink to="/dashboard/embed">
                      <Code2 />
                      <span>Embed on your site</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/settings"}
                    tooltip="Blog settings"
                  >
                    <NavLink to="/dashboard/settings">
                      <Settings />
                      <span>Blog settings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Public blog">
                    <a href={blogUrl} rel="noreferrer" target="_blank">
                      <ExternalLink />
                      <span>Public blog</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      ) : (
        <SidebarContent />
      )}

      <SidebarFooter className="pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent"
                  size="lg"
                  tooltip={userName}
                >
                  {clerkUser?.imageUrl ? (
                    <img
                      alt=""
                      className="size-8 shrink-0 rounded-full object-cover"
                      src={clerkUser.imageUrl}
                    />
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <UserRound className="size-4" />
                    </span>
                  )}
                  <span className="grid min-w-0 flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">{userName}</span>
                    {userEmail ? (
                      <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                    ) : null}
                  </span>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56"
                side={isMobile ? "top" : "right"}
                sideOffset={8}
              >
                <DropdownMenuItem onSelect={() => clerk.openUserProfile()}>
                  <UserRound />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void clerk.signOut({ redirectUrl: "/" })}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
