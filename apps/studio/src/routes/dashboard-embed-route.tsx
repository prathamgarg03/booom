import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useDashboardWorkspace } from "./dashboard-layout";

const LIMITS = [3, 5, 8, 12] as const;

export function DashboardEmbedRoute() {
  const workspace = useDashboardWorkspace();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [limit, setLimit] = useState<(typeof LIMITS)[number]>(5);

  if (!workspace.site) {
    return <Navigate replace to="/dashboard" />;
  }

  const site = workspace.site;
  const snippet = `<script async src="${workspace.publicAppUrl}/embed/v1.js" data-site="${site.slug}" data-limit="${limit}" data-theme="${theme}"></script>`;
  const publishedCount = workspace.posts?.filter((post) => post.status === "published").length ?? 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Embed on your site</h1>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
        Show your latest posts on any website. Paste one script tag where the list should appear
        and it stays up to date as you publish.
      </p>

      <ol className="mt-10 space-y-10">
        <Step number={1} title="Choose how it looks">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Tabs onValueChange={(value) => setTheme(value as "light" | "dark")} value={theme}>
                <TabsList>
                  <TabsTrigger value="light">Light</TabsTrigger>
                  <TabsTrigger value="dark">Dark</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Posts to show</Label>
              <Tabs
                onValueChange={(value) => setLimit(Number(value) as (typeof LIMITS)[number])}
                value={String(limit)}
              >
                <TabsList>
                  {LIMITS.map((value) => (
                    <TabsTrigger className="tabular-nums" key={value} value={String(value)}>
                      {value}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </Step>

        <Step number={2} title="Copy the script">
          <div className="overflow-hidden rounded-lg border bg-card">
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 whitespace-pre-wrap break-all text-foreground/90">
              {snippet}
            </pre>
            <div className="flex items-center justify-end gap-2 border-t bg-muted/30 px-3 py-2">
              <Button asChild size="sm" variant="ghost">
                <a href={workspace.embedDemoUrl} rel="noreferrer" target="_blank">
                  Try it in the playground
                  <ExternalLink data-icon="inline-end" />
                </a>
              </Button>
              <Button
                onClick={() => void workspace.copyText(snippet, "Script copied")}
                size="sm"
              >
                <Copy data-icon="inline-start" />
                Copy script
              </Button>
            </div>
          </div>
        </Step>

        <Step number={3} title="Paste it into your site's HTML">
          <p className="text-sm text-muted-foreground">
            Put it where the post list should render, for example inside your homepage's
            &lt;main&gt;. Only published posts appear
            {publishedCount === 0 ? ", and you don't have any yet." : `. You have ${publishedCount} right now.`}
          </p>
        </Step>
      </ol>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4">
      <span className="flex size-7 items-center justify-center rounded-full border text-xs font-medium tabular-nums text-muted-foreground">
        {number}
      </span>
      <div className="min-w-0 space-y-4 pt-0.5">
        <h2 className="font-medium">{title}</h2>
        {children}
      </div>
    </li>
  );
}
