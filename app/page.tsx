/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Experience from "@/components/Experience";
import OperaBoard from "@/components/OperaBoard";
import Page from "@/components/Page";
import ProjectIndex from "@/components/ProjectIndex";
import TechMarquee from "@/components/TechMarquee";
import { links } from "@/data/content";
import { formatDate, getPosts } from "@/lib/blog";
import LichessRatings from "@/components/LichessRatings";
import { fetchRatings } from "@/lib/lichess";
import "./home.css";

export default async function Home() {
  const ratings = await fetchRatings();
  const [latest, ...older] = getPosts().slice(0, 3);

  return (
    <Page className="home">
      <section className="intro wrap">
        <h1 className="name">
          <span>Aiden</span> <span>Trindade</span>
        </h1>
        <figure className="intro-photo">
          <img src="/profile.jpeg" alt="Aiden Trindade" width={1308} height={1340} fetchPriority="high" />
        </figure>
        <div className="intro-text">
          <p>
            I study computer science at VIT Vellore and build the frontend for FFCS-inator and Papers, two tools VIT
            students use every semester.
          </p>
          <p>
            I&apos;m looking for an{" "}
            <span className="scribbled">
              internship
              <svg className="scribble" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 13 C 40 6, 80 5, 120 9 S 180 15, 197 7" pathLength="1" />
              </svg>
            </span>
            .
          </p>
          <p className="link-row">
            <a href={`mailto:${links.email}`}>Email</a>
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          </p>
        </div>
      </section>

      <section className="block block-loud wrap" aria-labelledby="work-heading">
        <h2 id="work-heading" className="block-title">
          Work
        </h2>
        <ProjectIndex />
      </section>

      <section className="block block-loud" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="block-title wrap">
          Tools
        </h2>
        <TechMarquee />
      </section>

      <section className="block block-quiet wrap" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="block-title">
          Experience
        </h2>
        <Experience />
      </section>

      {latest && (
        <section className="block block-quiet wrap" aria-labelledby="writing-heading">
          <h2 id="writing-heading" className="block-title">
            Writing
          </h2>
          {latest.description && <p className="hw-line">{latest.description}</p>}
          <p className="hw-latest">
            <Link href={`/blog/${latest.slug}`}>{latest.title}</Link>{" "}
            <time dateTime={latest.date}>{formatDate(latest.date)}</time>
          </p>
          {older.length > 0 && (
            <ul className="hw-more">
              {older.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>{" "}
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="block block-loud wrap opera" aria-labelledby="chess-heading">
        <div className="opera-copy">
          <h2 id="chess-heading" className="block-title">
            Off the clock
          </h2>
          <p className="opera-lead">I play a lot of chess. This is my favourite short game.</p>
          <p className="opera-note">
            Paul Morphy beat a duke and a count at the Paris opera in 1858, in 17 moves, and gave up his queen to do it.
            Here it is, move by move.
          </p>
          <LichessRatings initial={ratings} />
        </div>
        <OperaBoard />
      </section>
    </Page>
  );
}
