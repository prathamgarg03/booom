import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkdownRenderer } from "./markdown-renderer";

test("markdown renderer does not emit raw script tags", () => {
  const html = renderToStaticMarkup(
    createElement(MarkdownRenderer, {
      markdown: "# Title\n\n<script>alert('xss')</script>\n\nRegular text",
    }),
  );

  assert.equal(html.includes("<script>alert"), false);
  assert.equal(html.includes("alert('xss')"), false);
  assert.equal(html.includes("Regular text"), true);
});
