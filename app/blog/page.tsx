import type { Metadata } from "next";
import Page from "@/components/Page";
import Link from "next/link";
import { formatDate, getPosts, type Post } from "@/lib/blog";
import "./blog.css";

export const metadata: Metadata = { title: "Writing" };

// The newest posts show their outline; older ones are just a title and a date
const OUTLINED = 3;

export default function BlogPage() {
  const posts = getPosts();
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];
  const byYear = years.length > 1;

  return (
    <Page className="page wrap post blog-index">
      <h1 className="post-title">
        <span className="md-mark" aria-hidden="true">
          #
        </span>
        Writing
      </h1>
      {posts.length === 0 ? (
        <p className="outline-empty">
          Nothing published yet. What I&apos;m working on is on <Link href="/now">Now</Link>.
        </p>
      ) : byYear ? (
        years.map((year) => (
          <section key={year} className="outline-year" aria-labelledby={`year-${year}`}>
            <h2 id={`year-${year}`} className="outline-year-title">
              {year}
            </h2>
            <Outline posts={posts} year={year} level={3} />
          </section>
        ))
      ) : (
        <Outline posts={posts} level={2} />
      )}
    </Page>
  );
}

function Outline({ posts, year, level }: { posts: Post[]; year?: string; level: 2 | 3 }) {
  const Title = `h${level}` as const;
  return (
    <ul className="outline">
      {posts.map((post, index) =>
        year && !post.date.startsWith(year) ? null : (
          <li key={post.slug} className="outline-post">
            <Title className="outline-title">
              <Link href={`/blog/${post.slug}`}>
                <span className="md-mark" aria-hidden="true">
                  #
                </span>
                {post.title}
              </Link>
            </Title>
            <p className="outline-date">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
            {index < OUTLINED && post.headings.length > 0 && (
              <ul className="outline-headings" aria-label={`Sections of ${post.title}`}>
                {post.headings.map((heading) => (
                  <li key={heading.id}>
                    <Link href={`/blog/${post.slug}#${heading.id}`}>
                      <span className="md-mark" aria-hidden="true">
                        ##
                      </span>
                      {heading.text}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ),
      )}
    </ul>
  );
}
