import { useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { PostActionsMenu } from "../components/post-actions-menu";
import { PostStatus } from "../components/post-status";
import { SiteSetupPanel } from "../components/site-setup-panel";
import { Button } from "../components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../components/ui/empty";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import type { PostRecord } from "../lib/convex-api";
import { formatDate, formatRelative } from "../lib/studio";
import { useDashboardWorkspace } from "./dashboard-layout";

type Filter = "all" | "published" | "draft";

export function DashboardIndexRoute() {
  const workspace = useDashboardWorkspace();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const posts = workspace.posts;

  const sorted = useMemo(
    () => (posts ? [...posts].sort((a, b) => b.updatedAt - a.updatedAt) : undefined),
    [posts],
  );

  const visible = useMemo(() => {
    if (!sorted) {
      return undefined;
    }

    const needle = query.trim().toLowerCase();

    return sorted.filter((post) => {
      if (filter !== "all" && post.status !== filter) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return (
        post.title.toLowerCase().includes(needle) ||
        post.slug.includes(needle) ||
        (post.excerpt ?? "").toLowerCase().includes(needle)
      );
    });
  }, [filter, query, sorted]);

  if (!workspace.site) {
    return (
      <SiteSetupPanel
        isCreatingSite={workspace.isCreatingSite}
        isProvisioning={workspace.viewer === undefined || workspace.viewer === null}
        onCreateSite={workspace.createSite}
        publicAppLabel={workspace.publicAppLabel}
      />
    );
  }

  const site = workspace.site;
  const publishedCount = posts?.filter((post) => post.status === "published").length ?? 0;
  const draftCount = posts?.filter((post) => post.status === "draft").length ?? 0;
  const hasPosts = (posts?.length ?? 0) > 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {posts === undefined
              ? "Loading your posts…"
              : hasPosts
                ? `${publishedCount} live on ${site.name}, ${draftCount} in progress.`
                : `Nothing on ${site.name} yet.`}
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/posts/new">
            <Plus data-icon="inline-start" />
            New post
          </Link>
        </Button>
      </div>

      {hasPosts ? (
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs onValueChange={(value) => setFilter(value as Filter)} value={filter}>
            <TabsList>
              <TabsTrigger value="all">
                All <Count value={posts?.length ?? 0} />
              </TabsTrigger>
              <TabsTrigger value="published">
                Published <Count value={publishedCount} />
              </TabsTrigger>
              <TabsTrigger value="draft">
                Drafts <Count value={draftCount} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search posts"
              className="pl-8"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts"
              type="search"
              value={query}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        {visible === undefined ? (
          <PostListSkeleton />
        ) : !hasPosts ? (
          <Empty className="mt-6 border border-dashed py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>Write your first post</EmptyTitle>
              <EmptyDescription>
                Posts are written in Markdown. Save drafts as you go and publish when it reads
                right.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/dashboard/posts/new">Start writing</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
            {query
              ? `No posts match “${query}”.`
              : filter === "draft"
                ? "No drafts. Everything you've written is live."
                : "Nothing published yet. Open a draft and publish it."}
          </div>
        ) : (
          <ul className="divide-y overflow-hidden rounded-xl border bg-card/40">
            {visible.map((post) => (
              <PostRow
                busy={workspace.activeActionPostId === post._id}
                key={post._id}
                liveUrl={`${workspace.blogUrl}/${post.slug}`}
                onCopy={workspace.copyText}
                onDelete={workspace.deletePost}
                onPublish={workspace.publishPost}
                onUnpublish={workspace.unpublishPost}
                post={post}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Count({ value }: { value: number }) {
  return <span className="tabular-nums text-muted-foreground">{value}</span>;
}

type PostRowProps = Omit<React.ComponentProps<typeof PostActionsMenu>, "showEdit">;

function PostRow(props: PostRowProps) {
  const { post } = props;

  return (
    <li className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-3.5 transition-colors hover:bg-accent/40 sm:grid-cols-[minmax(0,1fr)_6.5rem_8.5rem_auto]">
      <div className="min-w-0">
        <Link
          className="block truncate font-medium text-foreground outline-none after:absolute after:inset-0 focus-visible:after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-ring"
          to={`/dashboard/posts/${post._id}`}
        >
          {post.title || "Untitled"}
        </Link>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {post.excerpt || <span className="font-mono text-xs">/{post.slug}</span>}
        </p>
        <PostStatus className="mt-2 sm:hidden" status={post.status} />
      </div>
      <PostStatus className="hidden sm:inline-flex" status={post.status} />
      <PostDate post={post} />
      <div className="relative z-10">
        <PostActionsMenu {...props} />
      </div>
    </li>
  );
}

function PostDate({ post }: { post: PostRecord }) {
  return (
    <span
      className="hidden text-right text-sm text-muted-foreground tabular-nums sm:block"
      title={`Last edited ${formatDate(post.updatedAt)}`}
    >
      {formatRelative(post.updatedAt)}
    </span>
  );
}

function PostListSkeleton() {
  return (
    <div className="mt-4 divide-y overflow-hidden rounded-xl border">
      {[0, 1, 2].map((key) => (
        <div className="flex items-center gap-4 px-4 py-4" key={key}>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="hidden h-3 w-16 sm:block" />
        </div>
      ))}
    </div>
  );
}
