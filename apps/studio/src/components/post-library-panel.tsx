import { Link } from "react-router-dom";
import type { Id, PostRecord } from "../lib/convex-api";
import { formatDate } from "../lib/studio";

type PostLibraryPanelProps = {
  siteSlug: string;
  posts: PostRecord[] | undefined;
  selectedPostId?: Id<"posts"> | null;
  activeActionPostId: Id<"posts"> | null;
  onPublish: (postId: Id<"posts">) => Promise<boolean>;
  onUnpublish: (postId: Id<"posts">) => Promise<boolean>;
  onDelete: (postId: Id<"posts">) => Promise<void>;
};

export function PostLibraryPanel({
  siteSlug,
  posts,
  selectedPostId = null,
  activeActionPostId,
  onPublish,
  onUnpublish,
  onDelete,
}: PostLibraryPanelProps) {
  return (
    <section className="panel library-panel">
      <div className="section-header">
        <div>
          <p className="panel-kicker">Library</p>
          <h2>Your posts</h2>
        </div>
        <Link className="ghost-button button-link" to="/dashboard/posts/new">
          New draft
        </Link>
      </div>
      {posts === undefined ? (
        <p className="muted-copy">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="muted-copy">
          No posts yet. Create your first draft and we&apos;ll use this list as the
          basis for the public blog and embed.
        </p>
      ) : (
        <div className="post-list">
          {posts.map((post) => {
            const isSelected = post._id === selectedPostId;
            const isBusy = activeActionPostId === post._id;

            return (
              <article
                className={`post-card${isSelected ? " selected" : ""}`}
                key={post._id}
              >
                <Link className="post-card-main post-card-link" to={`/dashboard/posts/${post._id}`}>
                  <div className="post-card-head">
                    <h3>{post.title}</h3>
                    <span
                      className={`status-pill ${post.status === "published" ? "published" : ""}`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <p className="post-slug">
                    /{siteSlug}/{post.slug}
                  </p>
                  <p className="post-excerpt">
                    {post.excerpt || "No excerpt yet. This will be used in public summaries later."}
                  </p>
                  <p className="post-meta">
                    Updated {formatDate(post.updatedAt)} · Published{" "}
                    {formatDate(post.publishedAt)}
                  </p>
                </Link>
                <div className="post-card-actions">
                  {post.status === "draft" ? (
                    <button
                      className="ghost-button"
                      disabled={isBusy}
                      onClick={() => void onPublish(post._id)}
                      type="button"
                    >
                      {isBusy ? "Publishing..." : "Publish"}
                    </button>
                  ) : (
                    <button
                      className="ghost-button"
                      disabled={isBusy}
                      onClick={() => void onUnpublish(post._id)}
                      type="button"
                    >
                      {isBusy ? "Updating..." : "Unpublish"}
                    </button>
                  )}
                  <button
                    className="ghost-button danger-button"
                    disabled={isBusy}
                    onClick={() => void onDelete(post._id)}
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
  );
}
