import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPosts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.description } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="page">
      <article className="container">
        <Link href="/blog" className="page-back">
          ← All posts
        </Link>
        <h1 className="page-title post-title rise">{post.title}</h1>
        <p className="post-date">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        {/* Posts are my own Markdown files in content/blog, so this HTML is trusted */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}
