import { DashboardOverview } from "../components/dashboard-overview";
import { PostLibraryPanel } from "../components/post-library-panel";
import { SiteSetupPanel } from "../components/site-setup-panel";
import { Button } from "../components/ui/button";
import { useDashboardWorkspace } from "./dashboard-layout";
import { Link } from "react-router-dom";

export function DashboardIndexRoute() {
  const workspace = useDashboardWorkspace();

  if (!workspace.site) {
    return (
      <SiteSetupPanel
        isCreatingSite={workspace.isCreatingSite}
        isProvisioning={workspace.viewer === undefined}
        onCreateSite={workspace.createSite}
      />
    );
  }

  const draftCount = workspace.posts?.filter((post) => post.status === "draft").length ?? 0;
  const publishedCount =
    workspace.posts?.filter((post) => post.status === "published").length ?? 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-6">
      <DashboardOverview
        copyState={workspace.copyState}
        embedDemoUrl={workspace.embedDemoUrl}
        embedSnippet={workspace.embedSnippet}
        onCopySnippet={() => void workspace.copySnippet()}
        publicAppLabel={workspace.publicAppLabel}
        site={workspace.site}
        statusBody={
          <>
            <p>
              {publishedCount} published · {draftCount} drafts
            </p>
            <Button asChild className="ml-2" size="xs" variant="outline">
              <Link to="/dashboard/posts/new">New draft</Link>
            </Button>
          </>
        }
        statusTitle="Workspace ready"
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <PostLibraryPanel
            activeActionPostId={workspace.activeActionPostId}
            onDelete={async (postId) => {
              await workspace.deletePost(postId);
            }}
            onPublish={workspace.publishPost}
            onUnpublish={workspace.unpublishPost}
            posts={workspace.posts}
            siteSlug={workspace.site.slug}
          />
        </div>
        <div className="hidden xl:block" />
      </div>
    </div>
  );
}
