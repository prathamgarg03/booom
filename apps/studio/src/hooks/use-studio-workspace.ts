import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { useMutation, useQuery } from "convex/react";
import { api, type Id } from "../lib/convex-api";
import { studioEnv } from "../lib/env";
import { getPublicAppLabel, getPublicAppUrl, type NoticeState } from "../lib/studio";

export function useStudioWorkspace() {
  const { user: clerkUser } = useUser();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const createSiteMutation = useMutation(api.sites.create);
  const publishMutation = useMutation(api.posts.publish);
  const unpublishMutation = useMutation(api.posts.unpublish);
  const deleteMutation = useMutation(api.posts.remove);

  const viewer = useQuery(api.users.viewer);
  const sites = useQuery(api.sites.listMine, viewer ? {} : "skip");
  const site = sites?.[0] ?? null;
  const posts = useQuery(api.posts.listBySite, site ? { siteId: site._id } : "skip");

  const [notice, setNotice] = useState<NoticeState>({ error: null, success: null });
  const [isCreatingSite, setIsCreatingSite] = useState(false);
  const [activeActionPostId, setActiveActionPostId] = useState<Id<"posts"> | null>(
    null,
  );
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    void ensureCurrentUser().catch((error: unknown) => {
      setNotice({
        error:
          error instanceof Error ? error.message : "Could not initialize your user",
        success: null,
      });
    });
  }, [ensureCurrentUser]);

  const publicAppUrl = useMemo(
    () => getPublicAppUrl(studioEnv.VITE_PUBLIC_APP_URL),
    [],
  );
  const publicAppLabel = useMemo(
    () => getPublicAppLabel(studioEnv.VITE_PUBLIC_APP_URL),
    [],
  );

  const embedSnippet = useMemo(() => {
    if (!site) {
      return "";
    }

    return `<script async src="${publicAppUrl}/embed/v1.js" data-site="${site.slug}"></script>`;
  }, [publicAppUrl, site]);

  const embedDemoUrl = useMemo(() => {
    if (!site) {
      return "";
    }

    return `${publicAppUrl}/embed-demo?site=${encodeURIComponent(site.slug)}`;
  }, [publicAppUrl, site]);

  function setError(message: string) {
    setNotice({ error: message, success: null });
  }

  function setSuccess(message: string) {
    setNotice({ error: null, success: message });
  }

  function clearNotice() {
    setNotice({ error: null, success: null });
  }

  async function createSite(args: {
    name: string;
    slug: string;
    description?: string;
  }) {
    clearNotice();
    setIsCreatingSite(true);

    try {
      await createSiteMutation(args);
      setSuccess("Site created. You can start drafting posts now.");
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create your site");
      return false;
    } finally {
      setIsCreatingSite(false);
    }
  }

  async function publishPost(postId: Id<"posts">) {
    clearNotice();
    setActiveActionPostId(postId);

    try {
      await publishMutation({ postId });
      setSuccess("Post published.");
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not publish the post");
      return false;
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function unpublishPost(postId: Id<"posts">) {
    clearNotice();
    setActiveActionPostId(postId);

    try {
      await unpublishMutation({ postId });
      setSuccess("Post moved back to draft.");
      return true;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not unpublish the post",
      );
      return false;
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function deletePost(postId: Id<"posts">) {
    const post = posts?.find((entry) => entry._id === postId);

    if (!post) {
      setError("That post could not be found.");
      return false;
    }

    const shouldDelete = window.confirm(
      `Delete "${post.title}"? This removes it from the studio, public blog, and embed feed.`,
    );

    if (!shouldDelete) {
      return false;
    }

    clearNotice();
    setActiveActionPostId(postId);

    try {
      await deleteMutation({ postId });
      setSuccess("Post deleted.");
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not delete the post");
      return false;
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function copySnippet() {
    if (!embedSnippet) {
      return;
    }

    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setError("Could not copy the snippet. You can still copy it manually.");
    }
  }

  return {
    clerkUser,
    viewer,
    site,
    posts,
    notice,
    isCreatingSite,
    activeActionPostId,
    copyState,
    embedSnippet,
    embedDemoUrl,
    publicAppUrl,
    publicAppLabel,
    createSite,
    publishPost,
    unpublishPost,
    deletePost,
    copySnippet,
    setError,
    setSuccess,
    clearNotice,
  };
}

export type StudioWorkspaceContext = ReturnType<typeof useStudioWorkspace>;
