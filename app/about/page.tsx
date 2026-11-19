import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import FinePrint, { Fold } from "@/components/FinePrint";
import Page from "@/components/Page";
import { moreSkills, projects, skills } from "@/data/content";
import "./about.css";

export const metadata: Metadata = { title: "About" };

const titleOf = new Map(projects.map((p) => [p.slug, p.title]));
// Each flight starts on the row of the previous flight's last line
const starts = skills.map((_, i) => skills.slice(0, i).reduce((n, f) => n + f.items.length, 0));
const rest = new Intl.ListFormat("en-GB", { type: "conjunction" }).format(moreSkills);

export default function AboutPage() {
  return (
    <Page className="page wrap about-page">
      <h1 className="sr-only">About Aiden Trindade</h1>

      <FinePrint>
        I’m Aiden, a{" "}
        <Fold id="student" label="computer science student">
          at VIT Vellore; 8.5 GPA in my first semester
        </Fold>{" "}
        who builds{" "}
        <Fold id="codechef" label="the frontend of CodeChef-VIT’s tools for students">
          <Link href="/work/ffcs-inator">FFCS-inator</Link> builds clash-free timetables for 11K+ students; for v2.0.1 I
          built its course selection screen and fixed embedded labs showing up as “undefined”.{" "}
          <Link href="/work/papers">Papers</Link> holds 1500+ past exam papers; I work on its interface and fix bugs
        </Fold>
        . I learned on{" "}
        <Fold id="learned" label="plain HTML, CSS and JavaScript">
          <Link href="/work/pet">PET</Link>, an expense tracker with SVG charts drawn by hand and no framework, works
          offline. Then <Link href="/work/pretty-sure">Pretty Sure</Link>, a prediction journal in React on Supabase and
          PostgreSQL
        </Fold>{" "}
        and now mostly write React and Next.js with TypeScript. I{" "}
        <Fold id="yash" label="interned at Yash Technologies">
          in Pune, on an AI model that negotiates prices between buyers and vendors; agreed prices feed SAP-based ERP
          workflows
        </Fold>{" "}
        and won a state-level debate. I’m looking for an internship for summer 2027.
      </FinePrint>

      <section className="about-skills" aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        <ol className="stair">
          {skills.map(({ items, shownIn }, i) => (
            <li key={shownIn[0]} className="flight" style={{ "--start": starts[i] } as CSSProperties}>
              <ul>
                {items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              {/* The span keeps "in " and the link in one flex item, so the space survives */}
              <p className="flight-proof">
                <span>
                  in{" "}
                  {shownIn.map((slug, j) => (
                    <Fragment key={slug}>
                      {j > 0 && " and "}
                      <Link href={`/work/${slug}`}>{titleOf.get(slug)}</Link>
                    </Fragment>
                  ))}
                </span>
              </p>
            </li>
          ))}
        </ol>
        <p className="stair-rest">
          <span className="muted">I’ve also used </span>
          {rest}.
        </p>
      </section>
    </Page>
  );
}
