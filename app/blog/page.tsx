import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title rise">
          The <em>blog</em>
        </h1>
        <p className="page-lead rise">What I&apos;m building, and what I&apos;m getting wrong along the way.</p>
        <ul className="post-list">
          {getPosts().map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <strong>{post.title}</strong>
                <span>{post.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
