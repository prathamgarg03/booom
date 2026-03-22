import { AppSidebar } from "../components/app-sidebar";
import { Outlet, useOutletContext } from "react-router-dom";
import { DashboardHeader } from "../components/dashboard-header";
import { NoticeBanner } from "../components/notice-banner";
import { ScrollArea } from "../components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import {
  useStudioWorkspace,
  type StudioWorkspaceContext,
} from "../hooks/use-studio-workspace";

export function DashboardLayout() {
  const workspace = useStudioWorkspace();
  const userLabel =
    workspace.clerkUser?.fullName ??
    workspace.clerkUser?.primaryEmailAddress?.emailAddress ??
    "Signed in";

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar publicAppUrl={workspace.publicAppUrl} site={workspace.site} />
      <SidebarInset className="bg-grid">
        <section className="flex h-screen flex-col font-sans">
          <DashboardHeader
            publicAppUrl={workspace.publicAppUrl}
            site={workspace.site}
            userLabel={userLabel}
          />
          <NoticeBanner notice={workspace.notice} />
          <ScrollArea className="flex-1">
            <div className="min-h-full">
              <Outlet context={workspace} />
            </div>
          </ScrollArea>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function useDashboardWorkspace() {
  return useOutletContext<StudioWorkspaceContext>();
}
