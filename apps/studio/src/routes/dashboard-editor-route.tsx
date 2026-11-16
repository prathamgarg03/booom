import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { DeletePostDialog } from "../components/delete-post-dialog";
import { MarkdownPreview } from "../components/markdown-preview";
import { PostActionsMenu } from "../components/post-actions-menu";
import { PostStatus } from "../components/post-status";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Kbd } from "../components/ui/kbd";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import { api, type PostRecord } from "../lib/convex-api";
import {
  countWords,
  emptyEditorState,
  formatDate,
  makeSlug,
  readingMinutes,
  type EditorState,
} from "../lib/studio";
import { HeaderActions, useDashboardWorkspace } from "./dashboard-layout";

type DashboardEditorRouteProps = {
  mode: "new" | "edit";
};

const SUMMARY_SOFT_LIMIT = 200;
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/** Keeps hyphens typeable while still restricting the slug alphabet. */
function slugDraft(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "");
}

function isDirty(state: EditorState, post: PostRecord | null) {
  if (!post) {
    return Boolean(state.title || state.body || state.excerpt);
  }

  return (
    state.title !== post.title ||
    state.slug !== post.slug ||
    state.excerpt !== (post.excerpt ?? "") ||
    state.body !== post.body
  );
}

function useAutosize(ref: React.RefObject<HTMLTextAreaElement | null>, value: string) {
  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [ref, value]);
}

export function DashboardEditorRoute({ mode }: DashboardEditorRouteProps) {
  const workspace = useDashboardWorkspace();
  const navigate = useNavigate();
  const { postId } = useParams();
  const createDraft = useMutation(api.posts.createDraft);
  const updateDraft = useMutation(api.posts.updateDraft);

  const [editorState, setEditorState] = useState<EditorState>(emptyEditorState);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const loadedKey = useRef<string | null>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const selectedPost =
    mode === "edit" && postId
      ? (workspace.posts?.find((post) => post._id === postId) ?? null)
      : null;

  // Load the post into the editor once per post, so live updates (publish,
  // unpublish) never clobber text that is being typed.
  useEffect(() => {
    const key = mode === "new" ? "new" : (selectedPost?._id ?? null);

    if (!key || loadedKey.current === key) {
      return;
    }

    loadedKey.current = key;
    setTab("write");
    setEditorState(
      selectedPost
        ? {
            title: selectedPost.title,
            slug: selectedPost.slug,
            excerpt: selectedPost.excerpt ?? "",
            body: selectedPost.body,
            slugTouched: true,
          }
        : emptyEditorState,
    );

    if (mode === "new") {
      requestAnimationFrame(() => titleRef.current?.focus());
    }
  }, [mode, selectedPost]);

  useAutosize(titleRef, editorState.title);
  useAutosize(bodyRef, tab === "write" ? editorState.body : "");

  const dirty = isDirty(editorState, selectedPost);
  const site = workspace.site;
  const isBusy = isSaving || (selectedPost ? workspace.activeActionPostId === selectedPost._id : false);

  const save = useCallback(async (): Promise<string | null> => {
    if (!site) {
      return null;
    }

    if (!editorState.title.trim()) {
      toast.error("Add a title before saving.");
      setTab("write");
      titleRef.current?.focus();
      return null;
    }

    if (!editorState.body.trim()) {
      toast.error("Write something in the post before saving.");
      setTab("write");
      bodyRef.current?.focus();
      return null;
    }

    const slug = makeSlug(editorState.slug || editorState.title);
    setEditorState((current) => ({ ...current, slug }));
    setIsSaving(true);

    try {
      if (selectedPost) {
        await updateDraft({
          postId: selectedPost._id,
          title: editorState.title.trim(),
          slug,
          excerpt: editorState.excerpt.trim() || undefined,
          body: editorState.body,
        });
        toast.success(selectedPost.status === "published" ? "Changes are live" : "Draft saved");
        return selectedPost._id;
      }

      const nextPostId = await createDraft({
        siteId: site._id,
        title: editorState.title.trim(),
        slug,
        excerpt: editorState.excerpt.trim() || undefined,
        body: editorState.body,
      });
      loadedKey.current = nextPostId;
      toast.success("Draft saved");
      navigate(`/dashboard/posts/${nextPostId}`, { replace: true });
      return nextPostId;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save the post");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [createDraft, editorState, navigate, selectedPost, site, updateDraft]);

  async function publish() {
    if (!selectedPost) {
      const id = await save();
      if (id) {
        await workspace.publishPost(id as PostRecord["_id"]);
      }
      return;
    }

    if (dirty) {
      const id = await save();
      if (!id) {
        return;
      }
    }

    await workspace.publishPost(selectedPost._id);
  }

  // ⌘S / Ctrl+S saves from anywhere on the page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!isBusy && dirty) {
          void save();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dirty, isBusy, save]);

  // Warn before closing the tab with unsaved work.
  useEffect(() => {
    if (!dirty) {
      return;
    }

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (!site) {
    return <Navigate replace to="/dashboard" />;
  }

  if (mode === "edit" && workspace.posts !== undefined && !selectedPost) {
    return <Navigate replace to="/dashboard" />;
  }

  if (mode === "edit" && workspace.posts === undefined) {
    return <EditorSkeleton />;
  }

  const isLive = selectedPost?.status === "published";
  const liveUrl = `${workspace.blogUrl}/${editorState.slug || makeSlug(editorState.title) || "your-post"}`;
  const words = countWords(editorState.body);
  const saveShortcut = isMac ? "⌘S" : "Ctrl+S";

  return (
    <>
      <HeaderActions>
        <SaveState dirty={dirty} isNew={!selectedPost} saving={isSaving} />
        {isLive ? (
          <Button disabled={!dirty || isBusy} onClick={() => void save()} size="sm">
            {isSaving ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
            Update live post
          </Button>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={(!dirty && !!selectedPost) || isBusy}
                  onClick={() => void save()}
                  size="sm"
                  variant="outline"
                >
                  Save draft
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Save draft <Kbd>{saveShortcut}</Kbd>
              </TooltipContent>
            </Tooltip>
            <Button disabled={isBusy} onClick={() => void publish()} size="sm">
              {isBusy && !isSaving ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : null}
              Publish
            </Button>
          </>
        )}
        {selectedPost ? (
          <PostActionsMenu
            busy={isBusy}
            liveUrl={liveUrl}
            onCopy={workspace.copyText}
            onDelete={async (id) => {
              if (await workspace.deletePost(id)) {
                loadedKey.current = null;
                navigate("/dashboard");
              }
            }}
            onPublish={workspace.publishPost}
            onUnpublish={workspace.unpublishPost}
            post={selectedPost}
            showEdit={false}
            showPublishToggle={isLive}
          />
        ) : null}
      </HeaderActions>

      <div className="grid min-h-[calc(100svh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_19rem]">
        <Tabs
          className="mx-auto w-full max-w-[44rem] gap-0 px-5 pt-6 pb-24 sm:px-10"
          onValueChange={(value) => setTab(value as "write" | "preview")}
          value={tab}
        >
          <div className="flex items-center justify-between gap-4">
            <TabsList variant="line">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <p className="text-xs text-muted-foreground tabular-nums">
              {words} {words === 1 ? "word" : "words"}
              {words > 0 ? `, ${readingMinutes(words)} min read` : ""}
            </p>
          </div>

          <TabsContent className="mt-10" value="write">
            <label className="sr-only" htmlFor="post-title">
              Title
            </label>
            <textarea
              className="w-full resize-none overflow-hidden bg-transparent font-serif text-[2.5rem] leading-[1.15] font-medium tracking-[-0.01em] text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-5xl sm:leading-[1.1]"
              id="post-title"
              onChange={(event) => {
                const title = event.target.value.replace(/\n/g, " ");
                setEditorState((current) => ({
                  ...current,
                  title,
                  slug: current.slugTouched ? current.slug : makeSlug(title),
                }));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  bodyRef.current?.focus();
                }
              }}
              placeholder="Title"
              ref={titleRef}
              rows={1}
              value={editorState.title}
            />
            <label className="sr-only" htmlFor="post-body">
              Post body in Markdown
            </label>
            <textarea
              className="mt-6 min-h-[50svh] w-full resize-none overflow-hidden bg-transparent font-serif text-[19px] leading-[1.7] text-foreground/90 outline-none placeholder:text-muted-foreground/50"
              id="post-body"
              onChange={(event) =>
                setEditorState((current) => ({ ...current, body: event.target.value }))
              }
              placeholder="Tell your story. Markdown works here: # for headings, **bold**, - lists, [links](https://…)."
              ref={bodyRef}
              value={editorState.body}
            />
          </TabsContent>

          <TabsContent className="mt-10" value="preview">
            <h1 className="font-serif text-[2.5rem] leading-[1.15] font-medium tracking-[-0.01em] sm:text-5xl sm:leading-[1.1]">
              {editorState.title || <span className="text-muted-foreground/50">Untitled</span>}
            </h1>
            {editorState.excerpt ? (
              <p className="mt-4 font-serif text-xl leading-relaxed text-muted-foreground">
                {editorState.excerpt}
              </p>
            ) : null}
            <div className="mt-10">
              <MarkdownPreview markdown={editorState.body} />
            </div>
          </TabsContent>
        </Tabs>

        <aside className="border-t bg-sidebar/50 px-5 py-6 sm:px-10 lg:border-t-0 lg:border-l lg:px-6">
          <div className="space-y-8 lg:sticky lg:top-20">
            <section className="space-y-3">
              <h2 className="text-sm font-medium">Status</h2>
              {selectedPost ? (
                <>
                  <PostStatus status={selectedPost.status} />
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd className="text-right tabular-nums">{formatDate(selectedPost.createdAt)}</dd>
                    <dt className="text-muted-foreground">Last saved</dt>
                    <dd className="text-right tabular-nums">{formatDate(selectedPost.updatedAt)}</dd>
                    {selectedPost.publishedAt ? (
                      <>
                        <dt className="text-muted-foreground">Published</dt>
                        <dd className="text-right tabular-nums">
                          {formatDate(selectedPost.publishedAt)}
                        </dd>
                      </>
                    ) : null}
                  </dl>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not saved yet. Only you can see drafts.
                </p>
              )}
            </section>

            <section className="space-y-2">
              <Label htmlFor="post-slug">Post URL</Label>
              <div className="flex h-8 items-center overflow-hidden rounded-lg border border-input bg-input/30 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <span className="shrink-0 pl-2.5 font-mono text-xs text-muted-foreground select-none">
                  /
                </span>
                <Input
                  className="h-full rounded-none border-0 bg-transparent pl-0.5 font-mono text-xs shadow-none focus-visible:ring-0 dark:bg-transparent"
                  id="post-slug"
                  onBlur={() =>
                    setEditorState((current) => ({ ...current, slug: makeSlug(current.slug) }))
                  }
                  onChange={(event) =>
                    setEditorState((current) => ({
                      ...current,
                      slugTouched: true,
                      slug: slugDraft(event.target.value),
                    }))
                  }
                  placeholder="post-url"
                  spellCheck={false}
                  value={editorState.slug}
                />
              </div>
              {isLive ? (
                <a
                  className="inline-flex max-w-full items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  href={liveUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="truncate">{liveUrl.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              ) : (
                <p className="truncate text-xs text-muted-foreground">
                  {liveUrl.replace(/^https?:\/\//, "")}
                </p>
              )}
            </section>

            <section className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="post-summary">Summary</Label>
                <span
                  className={`text-xs tabular-nums ${
                    editorState.excerpt.length > SUMMARY_SOFT_LIMIT
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {editorState.excerpt.length}/{SUMMARY_SOFT_LIMIT}
                </span>
              </div>
              <Textarea
                className="min-h-24 resize-y text-sm"
                id="post-summary"
                onChange={(event) =>
                  setEditorState((current) => ({ ...current, excerpt: event.target.value }))
                }
                placeholder="One or two sentences shown on your blog's front page and in embeds."
                value={editorState.excerpt}
              />
            </section>

            {selectedPost ? (
              <section className="border-t pt-6">
                <Button
                  className="-ml-2.5 text-muted-foreground hover:text-destructive"
                  disabled={isBusy}
                  onClick={() => setConfirmDelete(true)}
                  size="sm"
                  variant="ghost"
                >
                  Delete post
                </Button>
                <DeletePostDialog
                  isPublished={isLive}
                  onConfirm={() =>
                    void workspace.deletePost(selectedPost._id).then((deleted) => {
                      if (deleted) {
                        loadedKey.current = null;
                        navigate("/dashboard");
                      }
                    })
                  }
                  onOpenChange={setConfirmDelete}
                  open={confirmDelete}
                  postTitle={selectedPost.title}
                />
              </section>
            ) : null}
          </div>
        </aside>
      </div>
    </>
  );
}

function SaveState({ dirty, saving, isNew }: { dirty: boolean; saving: boolean; isNew: boolean }) {
  let content: React.ReactNode = null;

  if (saving) {
    content = "Saving…";
  } else if (dirty) {
    content = (
      <>
        <span aria-hidden className="size-1.5 rounded-full bg-primary" />
        {isNew ? "Not saved" : "Unsaved changes"}
      </>
    );
  } else if (!isNew) {
    content = (
      <>
        <Check className="size-3.5" />
        Saved
      </>
    );
  }

  return (
    <span
      aria-live="polite"
      className="mr-1 hidden items-center gap-1.5 text-xs text-muted-foreground md:inline-flex"
    >
      {content}
    </span>
  );
}

function EditorSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[44rem] space-y-6 px-5 pt-20 sm:px-10">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}
