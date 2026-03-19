import { Link } from "react-router-dom";
import { DashboardOverview } from "../components/dashboard-overview";
import { PostLibraryPanel } from "../components/post-library-panel";
import { SiteSetupPanel } from "../components/site-setup-panel";
import { useDashboardWorkspace } from "./dashboard-layout";

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
    <>
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
            <p className="status-inline-actions">
              <Link className="ghost-button button-link" to="/dashboard/posts/new">
                Start a new draft
              </Link>
            </p>
          </>
        }
        statusTitle="Workspace ready"
      />

      <div className="route-grid">
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
    </>
  );
}
