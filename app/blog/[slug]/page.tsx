import type { Metadata } from "next";
import Page from "@/components/Page";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPosts } from "@/lib/blog";
import "../blog.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const posts = getPosts().map((post) => ({ slug: post.slug }));
  // A static export needs at least one page here. Until the first post exists,
  // this placeholder slug finds no post and renders the 404 page
  return posts.length > 0 ? posts : [{ slug: "first-post" }];
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
    <Page className="page wrap post">
      <article>
        <Link href="/blog" className="back">
          All writing
        </Link>
        <div className="post-head">
          {/* The title is written as its Markdown source: the # steps out into the margin as the post opens */}
          <h1 className="post-title" data-step>
            <span className="md-mark" aria-hidden="true">
              #
            </span>
            <span className="md-text">{post.title}</span>
          </h1>
          <p className="post-date">
            <time dateTime={post.date}>{formatDate(post.date)}</time>, {post.minutes} min read
          </p>
        </div>
        {/* Posts are my own Markdown files in content/blog, so this HTML is trusted */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Page>
  );
}
