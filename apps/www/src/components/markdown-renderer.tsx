import React from "react";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type CodeProps = ComponentPropsWithoutRef<"code">;

/**
 * Reading typography for published posts. Colors come from the `.blog-theme`
 * tokens so the same markup works in light and dark.
 */
export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <div className="font-reading text-[1.1875rem] leading-[1.75] text-ink-soft sm:text-[1.25rem] [&>*:first-child]:mt-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[1em]">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="mt-14 mb-4 text-[2rem] leading-tight font-medium tracking-[-0.01em] text-ink">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-14 mb-4 text-[1.75rem] leading-snug font-medium tracking-[-0.01em] text-ink">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-10 mb-3 text-[1.375rem] leading-snug font-semibold text-ink">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-8 mb-2 font-ui text-base font-semibold text-ink">{children}</h4>
          ),
          p: ({ children }) => <p className="my-6 text-pretty">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="my-8 border-l-2 border-ink pl-6 text-ink italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="my-6 list-disc space-y-2 pl-6 marker:text-ink-muted">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 list-decimal space-y-2 pl-6 marker:text-ink-muted">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          a: ({ children, href }) => (
            <a
              className="text-link underline decoration-link/40 decoration-1 underline-offset-[3px] transition-colors hover:decoration-link"
              href={href}
              rel="noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="mx-auto my-14 w-24 border-rule" />
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={alt ?? ""}
              className="my-10 w-full rounded-md"
              loading="lazy"
              src={typeof src === "string" ? src : undefined}
            />
          ),
          pre: ({ children }) => (
            <pre className="my-8 overflow-x-auto rounded-md bg-code px-5 py-4 font-mono text-[0.8125rem] leading-6 text-ink sm:-mx-5">
              {children}
            </pre>
          ),
          code: ({ children, className, ...props }: CodeProps) => (
            <code
              className={
                className
                  ? `font-mono ${className}`
                  : "rounded-sm bg-code px-1.5 py-0.5 font-mono text-[0.8em] text-ink"
              }
              {...props}
            >
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto">
              <table className="w-full border-collapse font-ui text-[0.9375rem] leading-normal">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-ink/30 px-3 py-2 text-left font-semibold text-ink">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border-b border-rule px-3 py-2">{children}</td>,
        }}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
