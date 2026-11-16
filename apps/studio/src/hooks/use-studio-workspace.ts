import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/react";
import { useMutation, useQuery } from "convex/react";
import { api, type Id } from "../lib/convex-api";
import { studioEnv } from "../lib/env";
import { getPublicAppLabel, getPublicAppUrl } from "../lib/studio";

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

  const [isCreatingSite, setIsCreatingSite] = useState(false);
  const [activeActionPostId, setActiveActionPostId] = useState<Id<"posts"> | null>(
    null,
  );

  useEffect(() => {
    void ensureCurrentUser().catch((error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Couldn't load your account. Refresh to try again.",
      );
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

  const blogUrl = site ? `${publicAppUrl}/b/${site.slug}` : "";

  function setError(message: string) {
    toast.error(message);
  }

  function setSuccess(message: string) {
    toast.success(message);
  }

  async function createSite(args: {
    name: string;
    slug: string;
    description?: string;
  }) {
    setIsCreatingSite(true);

    try {
      await createSiteMutation(args);
      setSuccess("Blog created. Write your first post.");
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Couldn't create your blog");
      return false;
    } finally {
      setIsCreatingSite(false);
    }
  }

  async function publishPost(postId: Id<"posts">) {
    setActiveActionPostId(postId);

    try {
      await publishMutation({ postId });
      setSuccess("Published");
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Couldn't publish the post");
      return false;
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function unpublishPost(postId: Id<"posts">) {
    setActiveActionPostId(postId);

    try {
      await unpublishMutation({ postId });
      setSuccess("Unpublished. The post is a draft again.");
      return true;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Couldn't unpublish the post",
      );
      return false;
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function deletePost(postId: Id<"posts">) {
    setActiveActionPostId(postId);

    try {
      await deleteMutation({ postId });
      setSuccess("Post deleted");
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Couldn't delete the post");
      return false;
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
      return false;
    }
  }

  return {
    clerkUser,
    viewer,
    site,
    posts,
    isCreatingSite,
    activeActionPostId,
    embedSnippet,
    embedDemoUrl,
    publicAppUrl,
    publicAppLabel,
    createSite,
    publishPost,
    unpublishPost,
    deletePost,
    blogUrl,
    copyText,
    setError,
    setSuccess,
  };
}

export type StudioWorkspaceContext = ReturnType<typeof useStudioWorkspace>;
