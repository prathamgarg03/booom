import { useState } from "react";
import { Loader2 } from "lucide-react";
import { makeSlug } from "../lib/studio";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type SiteSetupPanelProps = {
  isProvisioning: boolean;
  isCreatingSite: boolean;
  publicAppLabel: string;
  onCreateSite: (args: {
    name: string;
    slug: string;
    description?: string;
  }) => Promise<boolean>;
};

export function SiteSetupPanel({
  isProvisioning,
  isCreatingSite,
  publicAppLabel,
  onCreateSite,
}: SiteSetupPanelProps) {
  const [siteName, setSiteName] = useState("");
  const [siteSlug, setSiteSlug] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteSlugTouched, setSiteSlugTouched] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onCreateSite({
      name: siteName.trim(),
      slug: makeSlug(siteSlug || siteName),
      description: siteDescription.trim() || undefined,
    });
  }

  if (isProvisioning) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Setting up your account…
      </div>
    );
  }

  const canSubmit = siteName.trim().length > 0 && makeSlug(siteSlug || siteName).length > 0;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:py-20">
      <h1 className="font-serif text-4xl leading-tight font-medium">Name your blog</h1>
      <p className="mt-3 text-muted-foreground">
        This is what readers see at the top of every page. You can write your first post right
        after.
      </p>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="site-name">Blog name</Label>
          <Input
            autoFocus
            id="site-name"
            onChange={(event) => {
              const nextName = event.target.value;
              setSiteName(nextName);

              if (!siteSlugTouched) {
                setSiteSlug(makeSlug(nextName));
              }
            }}
            placeholder="Field notes"
            value={siteName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-slug">Address</Label>
          <div className="flex h-8 items-center overflow-hidden rounded-lg border border-input bg-input/30 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span className="shrink-0 truncate pl-2.5 font-mono text-xs text-muted-foreground select-none">
              {publicAppLabel}/b/
            </span>
            <Input
              className="h-full rounded-none border-0 bg-transparent pl-0.5 font-mono text-xs shadow-none focus-visible:ring-0 dark:bg-transparent"
              id="site-slug"
              onBlur={() => setSiteSlug((current) => makeSlug(current))}
              onChange={(event) => {
                setSiteSlugTouched(true);
                setSiteSlug(
                  event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, "-")
                    .replace(/-{2,}/g, "-"),
                );
              }}
              placeholder="field-notes"
              spellCheck={false}
              value={siteSlug}
            />
          </div>
          <p className="text-xs text-muted-foreground">Lowercase letters, numbers and hyphens.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-description">
            Description <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            className="min-h-20 resize-y"
            id="site-description"
            onChange={(event) => setSiteDescription(event.target.value)}
            placeholder="What you write about, in a sentence."
            value={siteDescription}
          />
        </div>

        <Button className="w-full" disabled={!canSubmit || isCreatingSite} size="lg" type="submit">
          {isCreatingSite ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
          {isCreatingSite ? "Creating blog…" : "Create blog"}
        </Button>
      </form>
    </div>
  );
}
