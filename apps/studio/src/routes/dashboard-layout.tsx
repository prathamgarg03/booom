import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Outlet, useOutletContext } from "react-router-dom";
import { AppSidebar } from "../components/app-sidebar";
import { DashboardHeader } from "../components/dashboard-header";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import {
  useStudioWorkspace,
  type StudioWorkspaceContext,
} from "../hooks/use-studio-workspace";

export type DashboardContext = StudioWorkspaceContext & {
  headerActionsEl: HTMLElement | null;
};

export function DashboardLayout() {
  const workspace = useStudioWorkspace();
  const [headerActionsEl, setHeaderActionsEl] = useState<HTMLElement | null>(null);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar workspace={workspace} />
      <SidebarInset className="min-w-0">
        <DashboardHeader
          onActionsMount={setHeaderActionsEl}
          posts={workspace.posts}
          site={workspace.site}
        />
        <div className="flex-1">
          <Outlet context={{ ...workspace, headerActionsEl } satisfies DashboardContext} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function useDashboardWorkspace() {
  return useOutletContext<DashboardContext>();
}

/** Renders page-specific actions into the right side of the dashboard header. */
export function HeaderActions({ children }: { children: ReactNode }) {
  const { headerActionsEl } = useDashboardWorkspace();

  if (!headerActionsEl) {
    return null;
  }

  return createPortal(children, headerActionsEl);
}
