import { Outlet, useOutletContext } from "react-router-dom";
import { DashboardHeader } from "../components/dashboard-header";
import { NoticeBanner } from "../components/notice-banner";
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
    <section className="studio-shell">
      <DashboardHeader
        publicAppUrl={workspace.publicAppUrl}
        site={workspace.site}
        userLabel={userLabel}
      />
      <NoticeBanner notice={workspace.notice} />
      <Outlet context={workspace} />
    </section>
  );
}

export function useDashboardWorkspace() {
  return useOutletContext<StudioWorkspaceContext>();
}
