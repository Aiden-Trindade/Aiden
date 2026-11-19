import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { cache } from "react";

// Each Markdown file in content/blog is a post, and its filename is the URL

const DIR = path.join(process.cwd(), "content", "blog");

export type Heading = { id: string; text: string };

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  html: string;
  /** The post's ## headings, for the outline on /blog */
  headings: Heading[];
  minutes: number;
};

const WORDS_PER_MINUTE = 220;

function escapeAttr(text: string) {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function slugify(text: string) {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
  return slug || "section";
}

type FootnoteDef = Tokens.Generic & { id: string; tokens: Tokens.Generic[] };
type FootnoteRef = Tokens.Generic & { id: string };

// A fresh parser per post, so heading ids and footnote numbers never leak between posts.
// Markdown's own marks are kept and hung in the margin by app/blog/blog.css.
function render(markdown: string) {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  let headingCount = 0;

  // Footnotes are numbered in the order they're first referenced
  const defined = new Set<string>();
  const numbers = new Map<string, number>();
  const refCounts = new Map<string, number>();
  const notes = new Map<string, string>();

  const marked = new Marked({
    renderer: {
      heading({ tokens, depth }) {
        // Plain text for the id, the link's label and the outline (inline HTML tags dropped)
        const text = this.parser.parseInline(tokens, this.parser.textRenderer).replace(/<[^>]*>/g, "");
        const base = slugify(text);
        const seen = used.get(base) ?? 0;
        used.set(base, seen + 1);
        const id = seen === 0 ? base : `${base}-${seen + 1}`;
        if (depth === 2) headings.push({ id, text });
        // The title steps out first, then the first two headings
        headingCount += 1;
        const step = headingCount <= 2 ? ` data-step style="--n:${headingCount}"` : "";
        const mark = "#".repeat(depth);
        return (
          `<div class="md-h md-h${depth}"${step}>` +
          `<a class="md-mark" href="#${id}" aria-label="Link to section: ${escapeAttr(text)}">${mark}</a>` +
          `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>` +
          `</div>\n`
        );
      },
    },
    extensions: [
      {
        name: "footnoteDef",
        level: "block",
        start: (src) => src.match(/^\[\^/m)?.index,
        tokenizer(src) {
          const match = /^\[\^([^\]\s]+)\]:[ \t]*([^\n]*(?:\n(?!\n|\[\^)[^\n]*)*)(?:\n+|$)/.exec(src);
          if (!match) return;
          defined.add(match[1]);
          return {
            type: "footnoteDef",
            raw: match[0],
            id: match[1],
            tokens: this.lexer.inlineTokens(match[2].trim()),
          } satisfies FootnoteDef;
        },
        renderer(token) {
          const { id, tokens } = token as FootnoteDef;
          notes.set(id, this.parser.parseInline(tokens));
          return "";
        },
      },
      {
        name: "footnoteRef",
        level: "inline",
        start: (src) => src.indexOf("[^"),
        tokenizer(src) {
          const match = /^\[\^([^\]\s]+)\]/.exec(src);
          // Inline text is lexed after every block, so all definitions are known here
          if (!match || !defined.has(match[1])) return;
          return { type: "footnoteRef", raw: match[0], id: match[1] } satisfies FootnoteRef;
        },
        renderer(token) {
          const { id } = token as FootnoteRef;
          const n = numbers.get(id) ?? numbers.size + 1;
          numbers.set(id, n);
          const count = (refCounts.get(id) ?? 0) + 1;
          refCounts.set(id, count);
          const refId = count === 1 ? `fnref-${n}` : `fnref-${n}-${count}`;
          return `<sup class="fn-ref"><a id="${refId}" href="#fn-${n}" aria-label="Footnote ${n}">${n}</a></sup>`;
        },
      },
    ],
    hooks: {
      postprocess(html) {
        const list = [...numbers]
          .filter(([id]) => notes.has(id))
          .sort((a, b) => a[1] - b[1])
          .map(
            ([id, n]) =>
              `<li id="fn-${n}"><a class="md-mark" href="#fnref-${n}" aria-label="Back to footnote ${n} in the text">[^${n}]:</a> ${notes.get(id)}</li>`,
          );
        if (list.length === 0) return html;
        return `${html}<section class="footnotes" aria-label="Footnotes"><ol>${list.join("")}</ol></section>\n`;
      },
    },
  });

  const html = marked.parse(markdown, { async: false });
  return { html, headings };
}

function readPost(file: string): Post {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  const { html, headings } = render(content);
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    date: data.date,
    description: data.description,
    html,
    headings,
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}

// Newest first. The layout, a page and its metadata all ask for the posts on one
// request, so the Markdown is parsed once per request
export const getPosts = cache((): Post[] => {
  // Git doesn't keep empty folders, so the folder may not exist before the first post
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
