import { useState } from "react";
import { makeSlug } from "../lib/studio";
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

type SiteSetupPanelProps = {
  isProvisioning: boolean;
  isCreatingSite: boolean;
  onCreateSite: (args: {
    name: string;
    slug: string;
    description?: string;
  }) => Promise<boolean>;
};

export function SiteSetupPanel({
  isProvisioning,
  isCreatingSite,
  onCreateSite,
}: SiteSetupPanelProps) {
  const [siteName, setSiteName] = useState("");
  const [siteSlug, setSiteSlug] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteSlugTouched, setSiteSlugTouched] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await onCreateSite({
      name: siteName,
      slug: siteSlug,
      description: siteDescription || undefined,
    });

    if (!created) {
      return;
    }

    setSiteName("");
    setSiteSlug("");
    setSiteDescription("");
    setSiteSlugTouched(false);
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Foundation</p>
        <h2 className="text-4xl font-extrabold tracking-tight mb-4">Create the home for your posts.</h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
          The MVP starts with one site per account. Later this can expand into
          multiple sites, teams, and settings without rewriting the dashboard
          routes.
        </p>
      </section>

      <Card className="border-border/50 bg-card/60 shadow-xl backdrop-blur">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Site setup
          </p>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create your first site.
          </CardTitle>
          <CardDescription>
            This becomes the root for your hosted blog, embed, and future theme settings.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">

        {isProvisioning ? (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">Provisioning your Booom profile...</p>
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-foreground">Site name</span>
              <Input
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

            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-foreground">Site slug</span>
              <div className="flex items-center overflow-hidden rounded-lg border border-input bg-background">
                <span className="pl-3 pr-1 py-2 text-sm text-muted-foreground bg-muted/30 border-r border-border/50 select-none">booom.dev/</span>
                <Input
                  className="border-0 bg-transparent font-mono shadow-none focus-visible:ring-0"
                  onChange={(event) => {
                    setSiteSlugTouched(true);
                    setSiteSlug(makeSlug(event.target.value));
                  }}
                  placeholder="booom-engineering"
                  value={siteSlug}
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-foreground">Description</span>
              <Textarea
                className="min-h-28 resize-y"
                onChange={(event) => setSiteDescription(event.target.value)}
                placeholder="Write concise product notes, devlogs, or release breakdowns."
                rows={4}
                value={siteDescription}
              />
            </label>

            <Button
              className="mt-2 w-full"
              disabled={isCreatingSite}
              type="submit"
            >
              {isCreatingSite ? "Creating site..." : "Create site"}
            </Button>
          </form>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
