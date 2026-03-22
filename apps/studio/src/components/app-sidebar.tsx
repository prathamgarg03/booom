import {
  BarChart3,
  Globe,
  Heart,
  ImageIcon,
  LayoutDashboard,
  MessageSquareText,
  Palette,
  PenSquare,
  Star,
  SwatchBook,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import type { SiteRecord } from "../lib/convex-api";
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
  SidebarSeparator,
} from "./ui/sidebar";

type AppSidebarProps = {
  site: SiteRecord | null;
  publicAppUrl: string;
};

const futureSections = [
  { label: "Templates", icon: SwatchBook },
  { label: "Themes", icon: Palette },
  { label: "Analytics", icon: BarChart3 },
  { label: "Reviews", icon: Star },
  { label: "Images", icon: ImageIcon },
  { label: "Comments", icon: MessageSquareText },
  { label: "Likes", icon: Heart },
] as const;

export function AppSidebar({ site, publicAppUrl }: AppSidebarProps) {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-3 px-3 py-4">
        <div className="flex flex-col gap-1 px-2">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Booom
          </span>
          <span className="text-sm font-semibold text-sidebar-foreground">
            Studio
          </span>
        </div>
        {site ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"} size="lg" tooltip="Overview">
                <NavLink end to="/dashboard">
                  <LayoutDashboard />
                  <span>{site.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"} tooltip="Overview">
                  <NavLink end to="/dashboard">
                    <LayoutDashboard />
                    <span>Overview</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/dashboard/posts")} tooltip="Posts">
                  <NavLink to={site ? "/dashboard/posts/new" : "/dashboard"}>
                    <PenSquare />
                    <span>Posts</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {site ? (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Public blog">
                    <a href={`${publicAppUrl}/b/${site.slug}`} rel="noreferrer" target="_blank">
                      <Globe />
                      <span>Public blog</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Coming Soon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {futureSections.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton aria-disabled className="cursor-not-allowed opacity-70" tooltip={`${item.label} coming soon`}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>Soon</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Home">
              <Link to="/">
                <span>Back to home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
