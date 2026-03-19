import type { EditorState } from "../lib/studio";
import type { Id, PostRecord, SiteRecord } from "../lib/convex-api";

type PostEditorPanelProps = {
  site: SiteRecord;
  selectedPost: PostRecord | null;
  editorState: EditorState;
  previewUrl: string;
  isSavingPost: boolean;
  activeActionPostId: Id<"posts"> | null;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
};

export function PostEditorPanel({
  site,
  selectedPost,
  editorState,
  previewUrl,
  isSavingPost,
  activeActionPostId,
  onReset,
  onSubmit,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onBodyChange,
  onPublish,
  onUnpublish,
  onDelete,
}: PostEditorPanelProps) {
  const isBusy = selectedPost ? activeActionPostId === selectedPost._id : false;

  return (
    <section className="panel form-panel">
      <div className="editor-header">
        <div>
          <p className="panel-kicker">Editor</p>
          <h2>{selectedPost ? "Update post" : "Create a draft"}</h2>
          <p className="muted-copy">
            Preview URL: <span className="inline-code">{previewUrl}</span>
          </p>
        </div>
        {selectedPost ? (
          <button className="ghost-button" onClick={onReset} type="button">
            New draft
          </button>
        ) : null}
      </div>

      <form className="site-form" onSubmit={onSubmit}>
        <label>
          <span>Title</span>
          <input
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Shipping Booom checkpoint two"
            value={editorState.title}
          />
        </label>

        <label>
          <span>Slug</span>
          <div className="slug-field">
            <span>/{site.slug}/</span>
            <input
              onChange={(event) => onSlugChange(event.target.value)}
              placeholder="shipping-booom-checkpoint-two"
              value={editorState.slug}
            />
          </div>
        </label>

        <label>
          <span>Excerpt</span>
          <textarea
            onChange={(event) => onExcerptChange(event.target.value)}
            placeholder="A short summary that will later power cards and embeds."
            rows={3}
            value={editorState.excerpt}
          />
        </label>

        <label>
          <span>Body</span>
          <textarea
            className="post-body"
            onChange={(event) => onBodyChange(event.target.value)}
            placeholder={"# Hello world\n\nWrite your post in Markdown.\n\n- Shipping notes\n- Product updates\n- Devlogs"}
            rows={14}
            value={editorState.body}
          />
        </label>

        <div className="editor-actions">
          <button
            className="primary-button"
            disabled={isSavingPost || isBusy}
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
                disabled={isBusy}
                onClick={onUnpublish}
                type="button"
              >
                {isBusy ? "Updating..." : "Move to draft"}
              </button>
            ) : (
              <button
                className="ghost-button"
                disabled={isBusy}
                onClick={onPublish}
                type="button"
              >
                {isBusy ? "Publishing..." : "Publish now"}
              </button>
            )
          ) : null}
          {selectedPost ? (
            <button
              className="ghost-button danger-button"
              disabled={isBusy}
              onClick={onDelete}
              type="button"
            >
              {isBusy ? "Deleting..." : "Delete post"}
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
