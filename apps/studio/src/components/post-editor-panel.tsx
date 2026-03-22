import type { EditorState } from "../lib/studio";
import type { Id, PostRecord, SiteRecord } from "../lib/convex-api";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

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
    <Card className="flex h-full flex-col border-border/50 bg-card/60 shadow-xl backdrop-blur">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Editor</p>
          <CardTitle className="mb-2 text-2xl font-bold tracking-tight">
            {selectedPost ? "Update post" : "Create a draft"}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            Preview URL:
            <a href={previewUrl} target="_blank" rel="noreferrer" className="font-mono text-xs bg-muted border border-border/50 text-foreground px-2 py-1 rounded truncate max-w-[200px] sm:max-w-[300px] hover:text-primary transition-colors">
              {previewUrl}
            </a>
          </CardDescription>
        </div>
        {selectedPost ? (
          <Button
            onClick={onReset}
            size="sm"
            type="button"
            variant="outline"
          >
            New draft
          </Button>
        ) : null}
      </div>
      </CardHeader>
      <Separator />

      <CardContent className="flex flex-1 flex-col pt-6">
      <form className="flex flex-1 flex-col gap-6" onSubmit={onSubmit}>
        <div className="grid gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-foreground">Title</span>
            <Input
              className="h-10 text-base font-semibold"
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Shipping Booom checkpoint two"
              value={editorState.title}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-foreground">Slug</span>
            <div className="flex items-center overflow-hidden rounded-lg border border-input bg-background">
              <span className="pl-3 pr-1 py-2 text-sm text-muted-foreground bg-muted/30 border-r border-border/50 select-none">/{site.slug}/</span>
              <Input
                className="border-0 bg-transparent font-mono shadow-none focus-visible:ring-0"
                onChange={(event) => onSlugChange(event.target.value)}
                placeholder="shipping-booom-checkpoint-two"
                value={editorState.slug}
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-foreground">Excerpt</span>
            <Textarea
              className="min-h-24 resize-y"
              onChange={(event) => onExcerptChange(event.target.value)}
              placeholder="A short summary that will later power cards and embeds."
              rows={2}
              value={editorState.excerpt}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 flex-1 mt-2">
          <span className="text-sm font-bold text-foreground">Body</span>
          <Textarea
            className="h-full min-h-[360px] resize-y font-mono leading-relaxed"
            onChange={(event) => onBodyChange(event.target.value)}
            placeholder={"# Hello world\n\nWrite your post in Markdown.\n\n- Shipping notes\n- Product updates\n- Devlogs"}
            value={editorState.body}
          />
        </label>

        <Separator />
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Button
            disabled={isSavingPost || isBusy}
            type="submit"
          >
            {isSavingPost
              ? "Saving..."
              : selectedPost
                ? "Save changes"
                : "Create draft"}
          </Button>
          
          {selectedPost ? (
            selectedPost.status === "published" ? (
              <Button
                disabled={isBusy}
                onClick={onUnpublish}
                variant="outline"
                type="button"
              >
                {isBusy ? "Updating..." : "Move to draft"}
              </Button>
            ) : (
              <Button
                disabled={isBusy}
                onClick={onPublish}
                variant="secondary"
                type="button"
              >
                {isBusy ? "Publishing..." : "Publish now"}
              </Button>
            )
          ) : null}
          
          <div className="flex-1" />
          
          {selectedPost ? (
            <Button
              disabled={isBusy}
              onClick={onDelete}
              variant="ghost"
              type="button"
            >
              {isBusy ? "Deleting..." : "Delete post"}
            </Button>
          ) : null}
        </div>
      </form>
      </CardContent>
    </Card>
  );
}
