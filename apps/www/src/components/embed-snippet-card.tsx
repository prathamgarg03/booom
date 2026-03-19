import { CopyScriptButton } from "@/components/copy-script-button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type EmbedSnippetCardProps = {
  embedSnippet: string;
};

export function EmbedSnippetCard({ embedSnippet }: EmbedSnippetCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
          </div>
          <div className="text-sm font-bold tracking-tight text-foreground">
            index.html
          </div>
          <div className="w-10" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-md border border-border bg-muted/70 p-3 text-xs leading-relaxed text-foreground">
          <pre className="whitespace-pre-wrap break-all pr-8">{embedSnippet}</pre>
          <CopyScriptButton value={embedSnippet} />
        </div>
      </CardContent>
      <CardFooter className="bg-primary" />
    </Card>
  );
}
