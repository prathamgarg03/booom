import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function BlogPreviewCard() {
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
            yourname.dev/blog
          </div>
          <div className="w-10" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            Y
          </div>
          <span className="text-xs text-muted-foreground">yourname · Mar 18, 2026</span>
        </div>
        <div>
          <p className="text-sm leading-snug font-bold text-foreground">
            Why I stopped using a CMS and dropped a script tag instead
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            It took me 3 hours to set up my last blog. This time it took 30
            seconds. Here&apos;s what changed...
          </p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>✦ 1.2k views</span>
            <span>· 4 min read</span>
          </div>
          <span className="cursor-pointer text-xs font-semibold text-primary hover:underline">
            Read →
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary" />
    </Card>
  );
}
