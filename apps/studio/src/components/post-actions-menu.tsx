import { useState } from "react";
import {
  Copy,
  EyeOff,
  ExternalLink,
  MoreHorizontal,
  PenLine,
  Send,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Id, PostRecord } from "../lib/convex-api";
import { DeletePostDialog } from "./delete-post-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type PostActionsMenuProps = {
  post: PostRecord;
  liveUrl: string;
  busy: boolean;
  /** Hide the "Edit" entry when already inside the editor. */
  showEdit?: boolean;
  /** Hide publish/unpublish when the surrounding UI already offers it. */
  showPublishToggle?: boolean;
  onPublish: (postId: Id<"posts">) => Promise<unknown>;
  onUnpublish: (postId: Id<"posts">) => Promise<unknown>;
  onDelete: (postId: Id<"posts">) => Promise<unknown>;
  onCopy: (text: string, message: string) => Promise<unknown>;
};

export function PostActionsMenu({
  post,
  liveUrl,
  busy,
  showEdit = true,
  showPublishToggle = true,
  onPublish,
  onUnpublish,
  onDelete,
  onCopy,
}: PostActionsMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isLive = post.status === "published";

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Actions for ${post.title || "untitled post"}`}
            disabled={busy}
            size="icon-sm"
            variant="ghost"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {showEdit ? (
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/posts/${post._id}`}>
                <PenLine />
                Edit
              </Link>
            </DropdownMenuItem>
          ) : null}
          {isLive ? (
            <>
              <DropdownMenuItem asChild>
                <a href={liveUrl} rel="noreferrer" target="_blank">
                  <ExternalLink />
                  View live post
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void onCopy(liveUrl, "Post link copied")}>
                <Copy />
                Copy link
              </DropdownMenuItem>
            </>
          ) : null}
          {showPublishToggle ? (
            isLive ? (
              <DropdownMenuItem onSelect={() => void onUnpublish(post._id)}>
                <EyeOff />
                Unpublish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={() => void onPublish(post._id)}>
                <Send />
                Publish
              </DropdownMenuItem>
            )
          ) : null}
          {showEdit || isLive || showPublishToggle ? <DropdownMenuSeparator /> : null}
          <DropdownMenuItem onSelect={() => setConfirmOpen(true)} variant="destructive">
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePostDialog
        isPublished={isLive}
        onConfirm={() => void onDelete(post._id)}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        postTitle={post.title}
      />
    </>
  );
}
