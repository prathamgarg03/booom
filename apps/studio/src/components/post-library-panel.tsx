import { Link } from "react-router-dom";
import type { Id, PostRecord } from "../lib/convex-api";
import { formatDate } from "../lib/studio";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

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
    <Card className="border-border/50 bg-card/60 shadow-md backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Library</p>
          <CardTitle className="text-xl font-bold tracking-tight">Your posts</CardTitle>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/dashboard/posts/new">New draft</Link>
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {posts === undefined ? (
          <p className="text-sm text-muted-foreground">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-border/50 rounded-lg">
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No posts yet. Create your first draft and we&apos;ll use this list as the
              basis for the public blog and embed.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[560px] pr-3">
          <div className="flex flex-col gap-4">
            {posts.map((post) => {
              const isSelected = post._id === selectedPostId;
              const isBusy = activeActionPostId === post._id;

              return (
                <article
                  className={`group relative flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 rounded-lg border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/50 bg-card hover:border-primary/50 hover:shadow-md"
                  }`}
                  key={post._id}
                >
                  <Link className="flex-1 min-w-0" to={`/dashboard/posts/${post._id}`}>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold truncate tracking-tight text-foreground transition-colors group-hover:text-primary">{post.title}</h3>
                      <Badge
                        className="uppercase tracking-wider"
                        variant={post.status === "published" ? "default" : "outline"}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mb-3 truncate">
                      /{siteSlug}/<span className="text-foreground">{post.slug}</span>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {post.excerpt || <span className="italic opacity-50">No excerpt yet. This will be used in public summaries later.</span>}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-widest flex items-center gap-2">
                      <span>Updated {formatDate(post.updatedAt)}</span>
                      <span>&bull;</span>
                      <span>Published {formatDate(post.publishedAt)}</span>
                    </p>
                  </Link>
                  <div className="flex md:flex-col gap-2 shrink-0 pt-1">
                    {post.status === "draft" ? (
                      <Button
                        disabled={isBusy}
                        onClick={() => void onPublish(post._id)}
                        size="sm"
                        variant="secondary"
                        type="button"
                      >
                        {isBusy ? "Publishing..." : "Publish"}
                      </Button>
                    ) : (
                      <Button
                        disabled={isBusy}
                        onClick={() => void onUnpublish(post._id)}
                        size="sm"
                        variant="outline"
                        type="button"
                      >
                        {isBusy ? "Updating..." : "Unpublish"}
                      </Button>
                    )}
                    <Button
                      disabled={isBusy}
                      onClick={() => void onDelete(post._id)}
                      size="sm"
                      variant="ghost"
                      type="button"
                    >
                      {isBusy ? "Working..." : "Delete"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
