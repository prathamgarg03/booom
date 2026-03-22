import { useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DashboardOverview } from "../components/dashboard-overview";
import { PostEditorPanel } from "../components/post-editor-panel";
import { PostLibraryPanel } from "../components/post-library-panel";
import { api } from "../lib/convex-api";
import { emptyEditorState, makeSlug, type EditorState } from "../lib/studio";
import { useDashboardWorkspace } from "./dashboard-layout";

type DashboardEditorRouteProps = {
  mode: "new" | "edit";
};

export function DashboardEditorRoute({ mode }: DashboardEditorRouteProps) {
  const workspace = useDashboardWorkspace();
  const navigate = useNavigate();
  const { postId } = useParams();
  const createDraft = useMutation(api.posts.createDraft);
  const updateDraft = useMutation(api.posts.updateDraft);
  const [editorState, setEditorState] = useState<EditorState>(emptyEditorState);
  const [isSavingPost, setIsSavingPost] = useState(false);

  const selectedPost =
    mode === "edit" && postId
      ? workspace.posts?.find((post) => post._id === postId) ?? null
      : null;

  useEffect(() => {
    if (mode === "new") {
      setEditorState(emptyEditorState);
      return;
    }

    if (workspace.posts === undefined) {
      return;
    }

    if (!selectedPost) {
      return;
    }

    setEditorState({
      title: selectedPost.title,
      slug: selectedPost.slug,
      excerpt: selectedPost.excerpt ?? "",
      body: selectedPost.body,
      slugTouched: true,
    });
  }, [mode, selectedPost, workspace.posts]);

  const previewUrl = useMemo(() => {
    if (!workspace.site) {
      return "";
    }

    const slug = editorState.slug || "post-slug";
    return `${workspace.publicAppUrl}/b/${workspace.site.slug}/${slug}`;
  }, [editorState.slug, workspace.publicAppUrl, workspace.site]);

  if (!workspace.site) {
    return <Navigate replace to="/dashboard" />;
  }

  const site = workspace.site;

  if (mode === "edit" && workspace.posts !== undefined && !selectedPost) {
    return <Navigate replace to="/dashboard" />;
  }

  async function handleSavePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    workspace.clearNotice();
    setIsSavingPost(true);

    try {
      if (selectedPost) {
        await updateDraft({
          postId: selectedPost._id,
          title: editorState.title,
          slug: editorState.slug,
          excerpt: editorState.excerpt || undefined,
          body: editorState.body,
        });
        workspace.setSuccess("Draft updated.");
      } else {
        const nextPostId = await createDraft({
          siteId: site._id,
          title: editorState.title,
          slug: editorState.slug,
          excerpt: editorState.excerpt || undefined,
          body: editorState.body,
        });
        workspace.setSuccess("Draft created.");
        navigate(`/dashboard/posts/${nextPostId}`);
      }
    } catch (error) {
      workspace.setError(
        error instanceof Error ? error.message : "Could not save the post",
      );
    } finally {
      setIsSavingPost(false);
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <DashboardOverview
          copyState={workspace.copyState}
          embedDemoUrl={workspace.embedDemoUrl}
          embedSnippet={workspace.embedSnippet}
          onCopySnippet={() => void workspace.copySnippet()}
          publicAppLabel={workspace.publicAppLabel}
          site={workspace.site}
          statusBody={<span className="font-mono text-foreground bg-muted/50 px-2 py-1 rounded truncate border border-border/50">{previewUrl}</span>}
          statusTitle={
            selectedPost
              ? selectedPost.status === "published"
                ? "Editing published post"
                : "Editing draft"
              : "New draft"
          }
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0">
            <PostEditorPanel
              activeActionPostId={workspace.activeActionPostId}
              editorState={editorState}
              isSavingPost={isSavingPost}
              onBodyChange={(value) =>
                setEditorState((current) => ({
                  ...current,
                  body: value,
                }))
              }
              onDelete={() => {
                if (!selectedPost) {
                  return;
                }

                void workspace.deletePost(selectedPost._id).then((deleted) => {
                  if (deleted) {
                    navigate("/dashboard");
                  }
                });
              }}
              onExcerptChange={(value) =>
                setEditorState((current) => ({
                  ...current,
                  excerpt: value,
                }))
              }
              onPublish={() => {
                if (selectedPost) {
                  void workspace.publishPost(selectedPost._id);
                }
              }}
              onReset={() => navigate("/dashboard/posts/new")}
              onSlugChange={(value) =>
                setEditorState((current) => ({
                  ...current,
                  slugTouched: true,
                  slug: makeSlug(value),
                }))
              }
              onSubmit={(event) => void handleSavePost(event)}
              onTitleChange={(value) =>
                setEditorState((current) => ({
                  ...current,
                  title: value,
                  slug: current.slugTouched ? current.slug : makeSlug(value),
                }))
              }
              onUnpublish={() => {
                if (selectedPost) {
                  void workspace.unpublishPost(selectedPost._id);
                }
              }}
              previewUrl={previewUrl}
              selectedPost={selectedPost}
              site={site}
            />
          </div>

          <div className="hidden xl:block">
            <PostLibraryPanel
              activeActionPostId={workspace.activeActionPostId}
              onDelete={async (targetPostId) => {
                const deleted = await workspace.deletePost(targetPostId);

                if (deleted && selectedPost && targetPostId === selectedPost._id) {
                  navigate("/dashboard");
                }
              }}
              onPublish={workspace.publishPost}
              onUnpublish={workspace.unpublishPost}
              posts={workspace.posts}
              selectedPostId={selectedPost?._id ?? null}
              siteSlug={site.slug}
            />
          </div>
        </div>
      </div>
    </>
  );
}
