import React from "react";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
};

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mt-12 text-4xl font-medium tracking-[-0.06em] text-stone-950">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-12 text-3xl font-medium tracking-[-0.05em] text-stone-950">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-10 text-2xl font-medium tracking-[-0.04em] text-stone-950">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="my-6 text-lg leading-8 text-stone-700">{children}</p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-4 border-orange-500/60 pl-5 text-lg italic text-stone-700">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="my-6 list-disc space-y-3 pl-6 text-lg leading-8 text-stone-700">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="my-6 list-decimal space-y-3 pl-6 text-lg leading-8 text-stone-700">
            {children}
          </ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        a: ({ children, href }) => (
          <a
            className="text-orange-700 underline decoration-orange-400/50 underline-offset-4"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {children}
          </a>
        ),
        pre: ({ children }) => (
          <pre className="my-8 overflow-x-auto rounded-3xl border border-stone-900/10 bg-stone-950 p-4 text-sm leading-7 text-stone-100">
            {children}
          </pre>
        ),
        code: ({ children, inline, ...props }: CodeProps) =>
          inline ? (
            <code
              className="rounded bg-stone-950/8 px-1.5 py-0.5 font-mono text-[0.92em] text-stone-950"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code className="font-mono" {...props}>
              {children}
            </code>
          ),
        table: ({ children }) => (
          <div className="my-8 overflow-x-auto">
            <table className="min-w-full border-collapse overflow-hidden rounded-2xl border border-stone-900/10 bg-white/60 text-left text-stone-700">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-stone-950/6">{children}</thead>,
        th: ({ children }) => (
          <th className="border-b border-stone-900/10 px-4 py-3 text-sm font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-stone-900/10 px-4 py-3 text-sm">{children}</td>
        ),
      }}
      rehypePlugins={[rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
    >
      {markdown}
    </ReactMarkdown>
  );
}
