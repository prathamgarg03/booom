import type { ReactNode } from "react";
import type { SiteRecord } from "../lib/convex-api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

type DashboardOverviewProps = {
  site: SiteRecord;
  publicAppLabel: string;
  statusTitle: string;
  statusBody: ReactNode;
  embedSnippet: string;
  embedDemoUrl: string;
  copyState: "idle" | "copied";
  onCopySnippet: () => void;
};

export function DashboardOverview({
  site,
  publicAppLabel,
  statusTitle,
  statusBody,
  embedSnippet,
  embedDemoUrl,
  copyState,
  onCopySnippet,
}: DashboardOverviewProps) {
  return (
    <section className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="bg-card/50 backdrop-blur border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Site</p>
          <CardTitle className="text-xl font-bold tracking-tight">{site.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-mono text-muted-foreground mb-2">
            {publicAppLabel}/<span className="text-foreground">{site.slug}</span>
          </p>
          {site.description ? <p className="text-sm text-muted-foreground leading-relaxed">{site.description}</p> : null}
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Workspace</p>
          <CardTitle className="text-xl font-bold tracking-tight">{statusTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground font-medium flex gap-2 items-center [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:opacity-80">
            {statusBody}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Embed</p>
          <CardTitle className="text-xl font-bold tracking-tight">One-line script</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted/50 border border-border/50 overflow-hidden relative group">
            <pre className="p-3 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
              {embedSnippet}
            </pre>
            <Separator />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {embedDemoUrl ? (
                <Button
                  asChild
                  size="xs"
                  variant="outline"
                >
                  <a href={embedDemoUrl} rel="noreferrer" target="_blank">
                    Demo
                  </a>
                </Button>
              ) : null}
              <Button
                onClick={onCopySnippet}
                size="xs"
                type="button"
              >
                {copyState === "copied" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
