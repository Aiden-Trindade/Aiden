import EvalBar from "@/components/EvalBar";
import Motion from "@/components/Motion";
import Reveal from "@/components/Reveal";
import Story from "@/components/Story";
import TechMarquee from "@/components/TechMarquee";
import WorkList from "@/components/WorkList";
import { links, skills, story } from "@/data/content";
import { formatDate, getPosts } from "@/lib/blog";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <EvalBar />

      <main id="top">
        {/* Hero: the debate motion */}
        <Motion email={links.email} github={links.github} linkedin={links.linkedin} />

        {/* Story */}
        <section id="story" className="section">
          <div className="container">
            <Reveal as="h2" className="section-title">
              The story <em>so far</em>
            </Reveal>
            <Story chapters={story} />
          </div>
        </section>

        {/* Work */}
        <section id="work" className="section">
          <div className="container">
            <Reveal as="h2" className="section-title">
              Things I&apos;ve <em>made</em>
            </Reveal>

            <WorkList />
          </div>
        </section>

        {/* Toolkit */}
        <section id="toolkit" className="section">
          <div className="container">
            <Reveal as="h2" className="section-title">
              What I <em>work with</em>
            </Reveal>
            <Reveal>
              <TechMarquee />
            </Reveal>
            <Reveal as="dl" className="toolkit">
              {skills.map((s) => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd>{s.items.join(", ")}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Writing */}
        <section id="writing" className="section">
          <div className="container">
            <Reveal as="h2" className="section-title">
              Things I&apos;ve <em>written</em>
            </Reveal>
            <Reveal as="ul" className="post-list">
              {getPosts()
                .slice(0, 3)
                .map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`}>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <strong>{post.title}</strong>
                      <span>{post.description}</span>
                    </Link>
                  </li>
                ))}
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section contact">
          <div className="container">
            <Reveal as="h2" className="contact-title">
              Say <em>hi</em>.
            </Reveal>
            <Reveal as="p" className="contact-text">
              Internships, collaborations, or just a good chess game. Email is the fastest way to reach me.
            </Reveal>
            <Reveal>
              <a className="contact-email" href={`mailto:${links.email}`}>
                {links.email}
              </a>
            </Reveal>
          </div>
        </section>
      </main>

    </>
  );
}
