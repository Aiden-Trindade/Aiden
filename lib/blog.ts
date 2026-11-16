import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Each Markdown file in content/blog is a post, and its filename is the URL

const DIR = path.join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  html: string;
};

function readPost(file: string): Post {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    date: data.date,
    description: data.description,
    html: marked.parse(content, { async: false }),
  };
}

// Newest first
export function getPosts(): Post[] {
  return fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
