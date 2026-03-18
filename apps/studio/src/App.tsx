import { useEffect, useMemo, useState } from "react";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/react";
import { api, type Id, type PostRecord } from "./lib/convex-api";
import "./App.css";

function makeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function formatDate(timestamp?: number) {
  if (!timestamp) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

function getPublicAppUrl() {
  const envUrl = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined;

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }

  return "https://booom.dev";
}

function SignedOutView() {
  return (
    <section className="auth-panel">
      <p className="eyebrow">Booom Studio</p>
      <h1>Write once. Ship everywhere with a tiny embed.</h1>
      <p className="lede">
        The studio manages your blog content, publishing state, and future embed
        output so your product site stays lightweight.
      </p>
      <div className="cta-row">
        <SignInButton mode="modal">
          <button className="primary-button">Sign in to continue</button>
        </SignInButton>
      </div>
    </section>
  );
}

type NoticeState = {
  error: string | null;
  success: string | null;
};

type EditorState = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  slugTouched: boolean;
};

const emptyEditorState: EditorState = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  slugTouched: false,
};

function Workspace() {
  const { user: clerkUser } = useUser();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const createSite = useMutation(api.sites.create);
  const createDraft = useMutation(api.posts.createDraft);
  const updateDraft = useMutation(api.posts.updateDraft);
  const publishPost = useMutation(api.posts.publish);
  const unpublishPost = useMutation(api.posts.unpublish);
  const deletePost = useMutation(api.posts.remove);

  const viewer = useQuery(api.users.viewer);
  const sites = useQuery(api.sites.listMine, viewer ? {} : "skip");
  const site = sites?.[0] ?? null;
  const posts = useQuery(api.posts.listBySite, site ? { siteId: site._id } : "skip");

  const [siteName, setSiteName] = useState("");
  const [siteSlug, setSiteSlug] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteSlugTouched, setSiteSlugTouched] = useState(false);

  const [editorState, setEditorState] = useState<EditorState>(emptyEditorState);
  const [selectedPostId, setSelectedPostId] = useState<Id<"posts"> | null>(null);
  const [notice, setNotice] = useState<NoticeState>({ error: null, success: null });
  const [isSavingSite, setIsSavingSite] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [activeActionPostId, setActiveActionPostId] = useState<Id<"posts"> | null>(null);
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

  const selectedPost = useMemo(
    () => posts?.find((post) => post._id === selectedPostId) ?? null,
    [posts, selectedPostId],
  );

  const embedSnippet = useMemo(() => {
    if (!site) {
      return "";
    }

    const publicAppUrl = getPublicAppUrl();
    return `<script async src="${publicAppUrl}/embed/v1.js" data-site="${site.slug}"></script>`;
  }, [site]);

  const previewUrl = useMemo(() => {
    if (!site) {
      return "";
    }

    const slug = editorState.slug || "post-slug";
    return `${getPublicAppUrl()}/b/${site.slug}/${slug}`;
  }, [editorState.slug, site]);

  const embedDemoUrl = useMemo(() => {
    if (!site) {
      return "";
    }

    return `${getPublicAppUrl()}/embed-demo?site=${encodeURIComponent(site.slug)}`;
  }, [site]);

  function setError(message: string) {
    setNotice({ error: message, success: null });
  }

  function setSuccess(message: string) {
    setNotice({ error: null, success: message });
  }

  function resetEditor() {
    setSelectedPostId(null);
    setEditorState(emptyEditorState);
  }

  function loadPostIntoEditor(post: PostRecord) {
    setSelectedPostId(post._id);
    setEditorState({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      body: post.body,
      slugTouched: true,
    });
  }

  async function handleCreateSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice({ error: null, success: null });
    setIsSavingSite(true);

    try {
      await createSite({
        name: siteName,
        slug: siteSlug,
        description: siteDescription || undefined,
      });
      setSiteName("");
      setSiteSlug("");
      setSiteDescription("");
      setSiteSlugTouched(false);
      setSuccess("Site created. You can start drafting posts now.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create your site");
    } finally {
      setIsSavingSite(false);
    }
  }

  async function handleSavePost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!site) {
      setError("Create a site before creating posts.");
      return;
    }

    setNotice({ error: null, success: null });
    setIsSavingPost(true);

    try {
      if (selectedPostId) {
        await updateDraft({
          postId: selectedPostId,
          title: editorState.title,
          slug: editorState.slug,
          excerpt: editorState.excerpt || undefined,
          body: editorState.body,
        });
        setSuccess("Draft updated.");
      } else {
        const postId = await createDraft({
          siteId: site._id,
          title: editorState.title,
          slug: editorState.slug,
          excerpt: editorState.excerpt || undefined,
          body: editorState.body,
        });
        setSelectedPostId(postId);
        setSuccess("Draft created.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save the post");
    } finally {
      setIsSavingPost(false);
    }
  }

  async function handlePublish(postId: Id<"posts">) {
    setNotice({ error: null, success: null });
    setActiveActionPostId(postId);

    try {
      await publishPost({ postId });
      setSuccess("Post published.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not publish the post");
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function handleUnpublish(postId: Id<"posts">) {
    setNotice({ error: null, success: null });
    setActiveActionPostId(postId);

    try {
      await unpublishPost({ postId });
      setSuccess("Post moved back to draft.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not unpublish the post");
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function handleDelete(postId: Id<"posts">) {
    const post = posts?.find((entry) => entry._id === postId);

    if (!post) {
      setError("That post could not be found.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${post.title}"? This removes it from the studio, public blog, and embed feed.`,
    );

    if (!shouldDelete) {
      return;
    }

    setNotice({ error: null, success: null });
    setActiveActionPostId(postId);

    try {
      await deletePost({ postId });

      if (selectedPostId === postId) {
        resetEditor();
      }

      setSuccess("Post deleted.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not delete the post");
    } finally {
      setActiveActionPostId(null);
    }
  }

  async function handleCopySnippet() {
    if (!embedSnippet) {
      return;
    }

    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setError("Could not copy the snippet. You can still copy it manually.");
    }
  }

  return (
    <section className="studio-shell">
      <header className="studio-header">
        <div>
          <p className="eyebrow">Booom Studio</p>
          <h1>MVP workspace</h1>
          <p className="muted-copy">
            Manage your site, write posts, publish them, test the hosted blog, and verify the live embed from one place.
          </p>
        </div>
        <div className="header-actions">
          <div className="identity-chip">
            <span className="identity-label">
              {clerkUser?.fullName ??
                clerkUser?.primaryEmailAddress?.emailAddress ??
                "Signed in"}
            </span>
          </div>
          <UserButton />
        </div>
      </header>

      {notice.error ? <p className="notice notice-error">{notice.error}</p> : null}
      {notice.success ? <p className="notice notice-success">{notice.success}</p> : null}

      {!site ? (
        <div className="workspace-grid">
          <section className="panel intro-panel">
            <p className="panel-kicker">Foundation</p>
            <h2>Create the home for your posts.</h2>
            <p>
              The MVP starts with one site per account. Once the site exists, every
              post, public URL, and future embed hangs off this slug.
            </p>
          </section>

          <section className="panel form-panel">
            <p className="panel-kicker">Site setup</p>
            <h2>Create your first site.</h2>

            {viewer === undefined ? (
              <p className="muted-copy">Provisioning your Booom profile...</p>
            ) : (
              <form className="site-form" onSubmit={handleCreateSite}>
                <label>
                  <span>Site name</span>
                  <input
                    onChange={(event) => {
                      const nextName = event.target.value;
                      setSiteName(nextName);
                      if (!siteSlugTouched) {
                        setSiteSlug(makeSlug(nextName));
                      }
                    }}
                    placeholder="Booom Engineering"
                    value={siteName}
                  />
                </label>

                <label>
                  <span>Site slug</span>
                  <div className="slug-field">
                    <span>booom.dev/</span>
                    <input
                      onChange={(event) => {
                        setSiteSlugTouched(true);
                        setSiteSlug(makeSlug(event.target.value));
                      }}
                      placeholder="booom-engineering"
                      value={siteSlug}
                    />
                  </div>
                </label>

                <label>
                  <span>Description</span>
                  <textarea
                    onChange={(event) => setSiteDescription(event.target.value)}
                    placeholder="Write concise product notes, devlogs, or release breakdowns."
                    rows={4}
                    value={siteDescription}
                  />
                </label>

                <button className="primary-button" disabled={isSavingSite} type="submit">
                  {isSavingSite ? "Creating site..." : "Create site"}
                </button>
              </form>
            )}
          </section>
        </div>
      ) : (
        <>
          <section className="overview-grid">
            <article className="panel summary-card">
              <p className="panel-kicker">Site</p>
              <h2>{site.name}</h2>
              <p className="site-meta">booom.dev/{site.slug}</p>
              {site.description ? <p className="site-description">{site.description}</p> : null}
            </article>

            <article className="panel summary-card">
              <p className="panel-kicker">Editor status</p>
              <h2>{selectedPost ? "Editing draft" : "New draft"}</h2>
              <p className="muted-copy">
                Preview URL: <span className="inline-code">{previewUrl}</span>
              </p>
            </article>

            <article className="panel summary-card">
              <p className="panel-kicker">Embed</p>
              <div className="snippet-box compact-snippet">
                <div className="snippet-row">
                  <p className="snippet-label">One-line script</p>
                  <div className="snippet-actions">
                    {embedDemoUrl ? (
                      <a
                        className="ghost-button button-link"
                        href={embedDemoUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open demo
                      </a>
                    ) : null}
                    <button className="ghost-button" onClick={handleCopySnippet} type="button">
                      {copyState === "copied" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <pre>{embedSnippet}</pre>
              </div>
            </article>
          </section>

          <div className="editor-grid">
            <section className="panel form-panel">
              <div className="editor-header">
                <div>
                  <p className="panel-kicker">Editor</p>
                  <h2>{selectedPost ? "Update post" : "Create a draft"}</h2>
                </div>
                {selectedPost ? (
                  <button className="ghost-button" onClick={resetEditor} type="button">
                    New draft
                  </button>
                ) : null}
              </div>

              <form className="site-form" onSubmit={handleSavePost}>
                <label>
                  <span>Title</span>
                  <input
                    onChange={(event) => {
                      const nextTitle = event.target.value;
                      setEditorState((current) => ({
                        ...current,
                        title: nextTitle,
                        slug: current.slugTouched ? current.slug : makeSlug(nextTitle),
                      }));
                    }}
                    placeholder="Shipping Booom checkpoint two"
                    value={editorState.title}
                  />
                </label>

                <label>
                  <span>Slug</span>
                  <div className="slug-field">
                    <span>/{site.slug}/</span>
                    <input
                      onChange={(event) => {
                        setEditorState((current) => ({
                          ...current,
                          slugTouched: true,
                          slug: makeSlug(event.target.value),
                        }));
                      }}
                      placeholder="shipping-booom-checkpoint-two"
                      value={editorState.slug}
                    />
                  </div>
                </label>

                <label>
                  <span>Excerpt</span>
                  <textarea
                    onChange={(event) =>
                      setEditorState((current) => ({
                        ...current,
                        excerpt: event.target.value,
                      }))
                    }
                    placeholder="A short summary that will later power cards and embeds."
                    rows={3}
                    value={editorState.excerpt}
                  />
                </label>

                <label>
                  <span>Body</span>
                  <textarea
                    className="post-body"
                    onChange={(event) =>
                      setEditorState((current) => ({
                        ...current,
                        body: event.target.value,
                      }))
                    }
                    placeholder={"# Hello world\n\nWrite your post in Markdown.\n\n- Shipping notes\n- Product updates\n- Devlogs"}
                    rows={14}
                    value={editorState.body}
                  />
                </label>

                <div className="editor-actions">
                  <button
                    className="primary-button"
                    disabled={
                      isSavingPost ||
                      (selectedPost ? activeActionPostId === selectedPost._id : false)
                    }
                    type="submit"
                  >
                    {isSavingPost
                      ? "Saving..."
                      : selectedPost
                        ? "Save changes"
                        : "Create draft"}
                  </button>
                  {selectedPost ? (
                    selectedPost.status === "published" ? (
                      <button
                        className="ghost-button"
                        disabled={activeActionPostId === selectedPost._id}
                        onClick={() => void handleUnpublish(selectedPost._id)}
                        type="button"
                      >
                        {activeActionPostId === selectedPost._id ? "Updating..." : "Move to draft"}
                      </button>
                    ) : (
                      <button
                        className="ghost-button"
                        disabled={activeActionPostId === selectedPost._id}
                        onClick={() => void handlePublish(selectedPost._id)}
                        type="button"
                      >
                        {activeActionPostId === selectedPost._id ? "Publishing..." : "Publish now"}
                      </button>
                    )
                  ) : null}
                  {selectedPost ? (
                    <button
                      className="ghost-button danger-button"
                      disabled={activeActionPostId === selectedPost._id}
                      onClick={() => void handleDelete(selectedPost._id)}
                      type="button"
                    >
                      {activeActionPostId === selectedPost._id ? "Deleting..." : "Delete post"}
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className="panel library-panel">
              <p className="panel-kicker">Library</p>
              <h2>Your posts</h2>
              {posts === undefined ? (
                <p className="muted-copy">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="muted-copy">
                  No posts yet. Create your first draft and we&apos;ll use this list as the basis for the public blog and embed.
                </p>
              ) : (
                <div className="post-list">
                  {posts.map((post) => {
                    const isSelected = post._id === selectedPostId;
                    const isBusy = activeActionPostId === post._id;

                    return (
                      <article className={`post-card${isSelected ? " selected" : ""}`} key={post._id}>
                        <button
                          className="post-card-main"
                          onClick={() => loadPostIntoEditor(post)}
                          type="button"
                        >
                          <div className="post-card-head">
                            <h3>{post.title}</h3>
                            <span className={`status-pill ${post.status === "published" ? "published" : ""}`}>
                              {post.status}
                            </span>
                          </div>
                          <p className="post-slug">/{site.slug}/{post.slug}</p>
                          <p className="post-excerpt">
                            {post.excerpt || "No excerpt yet. This will be used in public summaries later."}
                          </p>
                          <p className="post-meta">
                            Updated {formatDate(post.updatedAt)} · Published {formatDate(post.publishedAt)}
                          </p>
                        </button>
                        <div className="post-card-actions">
                          {post.status === "draft" ? (
                            <button
                              className="ghost-button"
                              disabled={isBusy}
                              onClick={() => void handlePublish(post._id)}
                              type="button"
                            >
                              {isBusy ? "Publishing..." : "Publish"}
                            </button>
                          ) : (
                            <button
                              className="ghost-button"
                              disabled={isBusy}
                              onClick={() => void handleUnpublish(post._id)}
                              type="button"
                            >
                              {isBusy ? "Updating..." : "Unpublish"}
                            </button>
                          )}
                          <button
                            className="ghost-button danger-button"
                            disabled={isBusy}
                            onClick={() => void handleDelete(post._id)}
                            type="button"
                          >
                            {isBusy ? "Working..." : "Delete"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default function App() {
  return (
    <main className="studio-page">
      <AuthLoading>
        <section className="loading-panel">
          <p className="eyebrow">Booting studio</p>
          <h1>Checking your session…</h1>
        </section>
      </AuthLoading>
      <Unauthenticated>
        <SignedOutView />
      </Unauthenticated>
      <Authenticated>
        <Workspace />
      </Authenticated>
    </main>
  );
}
