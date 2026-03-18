import { Fragment } from "react";

function renderInline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          className="rounded bg-stone-950/8 px-1.5 py-0.5 font-mono text-[0.92em] text-stone-950"
          key={`${part}-${index}`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      index += 1;
      const codeLines: string[] = [];

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push(
        <div className="my-8 overflow-hidden rounded-3xl border border-stone-900/10 bg-stone-950 text-stone-100" key={`code-${blocks.length}`}>
          {language ? (
            <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-400">
              {language}
            </div>
          ) : null}
          <pre className="overflow-x-auto p-4 text-sm leading-7">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 className="mt-10 text-2xl font-medium tracking-[-0.04em] text-stone-950" key={`h3-${blocks.length}`}>
          {renderInline(line.slice(4))}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 className="mt-12 text-3xl font-medium tracking-[-0.05em] text-stone-950" key={`h2-${blocks.length}`}>
          {renderInline(line.slice(3))}
        </h2>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 className="mt-12 text-4xl font-medium tracking-[-0.06em] text-stone-950" key={`h1-${blocks.length}`}>
          {renderInline(line.slice(2))}
        </h1>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [line.slice(2)];
      index += 1;

      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].slice(2));
        index += 1;
      }

      blocks.push(
        <blockquote
          className="my-8 border-l-4 border-orange-500/60 pl-5 text-lg italic text-stone-700"
          key={`quote-${blocks.length}`}
        >
          {quoteLines.join(" ")}
        </blockquote>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [line.slice(2)];
      index += 1;

      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2));
        index += 1;
      }

      blocks.push(
        <ul className="my-6 list-disc space-y-3 pl-6 text-lg leading-8 text-stone-700" key={`list-${blocks.length}`}>
          {items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("#") &&
      !lines[index].startsWith("> ") &&
      !lines[index].startsWith("- ") &&
      !lines[index].startsWith("```")
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push(
      <p className="my-6 text-lg leading-8 text-stone-700" key={`p-${blocks.length}`}>
        {renderInline(paragraphLines.join(" "))}
      </p>,
    );
  }

  return <div>{blocks}</div>;
}
