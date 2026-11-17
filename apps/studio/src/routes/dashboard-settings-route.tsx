import { useState } from "react";
import { useMutation } from "convex/react";
import { Loader2, TriangleAlert } from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { api, type SiteRecord } from "../lib/convex-api";
import { makeSlug } from "../lib/studio";
import { useDashboardWorkspace } from "./dashboard-layout";

export function DashboardSettingsRoute() {
  const workspace = useDashboardWorkspace();

  if (!workspace.site) {
    return <Navigate replace to="/dashboard" />;
  }

  // Remount the form when the saved record changes so it starts from the latest values.
  return (
    <SettingsForm
      key={`${workspace.site._id}-${workspace.site.updatedAt}`}
      publicAppLabel={workspace.publicAppLabel}
      site={workspace.site}
    />
  );
}

function SettingsForm({ site, publicAppLabel }: { site: SiteRecord; publicAppLabel: string }) {
  const updateSite = useMutation(api.sites.update);
  const [name, setName] = useState(site.name);
  const [slug, setSlug] = useState(site.slug);
  const [description, setDescription] = useState(site.description ?? "");
  const [saving, setSaving] = useState(false);

  const nextSlug = makeSlug(slug);
  const slugChanged = nextSlug !== site.slug;
  const dirty =
    name.trim() !== site.name || slugChanged || description.trim() !== (site.description ?? "");
  const canSave = dirty && name.trim().length > 0 && nextSlug.length > 0 && !saving;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    setSaving(true);

    try {
      await updateSite({
        siteId: site._id,
        name: name.trim(),
        slug: nextSlug,
        description: description.trim() || undefined,
      });
      toast.success("Blog settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't save your settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Blog settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        How your blog appears to readers, on its own page and in embeds.
      </p>

      <form className="mt-10 space-y-8" onSubmit={(event) => void handleSubmit(event)}>
        <div className="space-y-2">
          <Label htmlFor="blog-name">Blog name</Label>
          <Input id="blog-name" onChange={(event) => setName(event.target.value)} value={name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-description">
            Description <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            className="min-h-20 resize-y"
            id="blog-description"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What you write about, in a sentence."
            value={description}
          />
          <p className="text-xs text-muted-foreground">
            Shown under the blog name and in link previews.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-address">Address</Label>
          <div className="flex h-8 items-center overflow-hidden rounded-lg border border-input bg-input/30 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span className="shrink-0 truncate pl-2.5 font-mono text-xs text-muted-foreground select-none">
              {publicAppLabel}/b/
            </span>
            <Input
              className="h-full rounded-none border-0 bg-transparent pl-0.5 font-mono text-xs shadow-none focus-visible:ring-0 dark:bg-transparent"
              id="blog-address"
              onBlur={() => setSlug((current) => makeSlug(current))}
              onChange={(event) =>
                setSlug(
                  event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, "-")
                    .replace(/-{2,}/g, "-"),
                )
              }
              spellCheck={false}
              value={slug}
            />
          </div>
          {slugChanged && nextSlug ? (
            <p className="flex gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs leading-relaxed text-foreground">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>
                Links to /b/{site.slug} will stop working, and every site that embeds your posts
                needs its script tag updated to data-site=&quot;{nextSlug}&quot;.
              </span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Lowercase letters, numbers and hyphens.</p>
          )}
        </div>

        <div className="flex items-center gap-3 border-t pt-6">
          <Button disabled={!canSave} type="submit">
            {saving ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
            Save settings
          </Button>
          {dirty ? (
            <Button
              onClick={() => {
                setName(site.name);
                setSlug(site.slug);
                setDescription(site.description ?? "");
              }}
              type="button"
              variant="ghost"
            >
              Discard changes
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
