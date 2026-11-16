import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

/** Mirrors the public blog's reading typography, adapted to the dark studio. */
export function MarkdownPreview({ markdown }: { markdown: string }) {
  if (!markdown.trim()) {
    return (
      <p className="font-serif text-[19px] italic text-muted-foreground">
        Nothing to preview yet. Switch to Write and start your post.
      </p>
    );
  }

  return (
    <div className="font-serif text-[19px] leading-[1.7] text-foreground/90 [&>*:first-child]:mt-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[1em]">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mt-12 mb-4 text-[2rem] leading-tight font-semibold text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 mb-3 text-[1.6rem] leading-snug font-semibold text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-2 text-[1.3rem] leading-snug font-semibold text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-5">{children}</p>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-primary/70 pl-5 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>,
          a: ({ children, href }) => (
            <a
              className="text-foreground underline decoration-primary/60 underline-offset-4 hover:decoration-primary"
              href={href}
              rel="noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-10 border-border" />,
          pre: ({ children }) => (
            <pre className="my-6 overflow-x-auto rounded-lg border bg-muted/60 p-4 font-mono text-sm leading-6">
              {children}
            </pre>
          ),
          code: ({ children, className }) =>
            className ? (
              <code className={`font-mono ${className}`}>{children}</code>
            ) : (
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            ),
          img: ({ src, alt }) => (
            <img alt={alt ?? ""} className="my-6 rounded-lg border" loading="lazy" src={src} />
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse font-sans text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b px-3 py-2 text-left font-medium">{children}</th>
          ),
          td: ({ children }) => <td className="border-b px-3 py-2">{children}</td>,
        }}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
