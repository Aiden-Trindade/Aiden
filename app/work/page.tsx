/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import DevelopList from "@/components/DevelopList";
import Page from "@/components/Page";
import { projects } from "@/data/content";
import "./work.css";

export const metadata: Metadata = { title: "Work" };

// Each project opens with a band of its real first screen at 1:1, edge to edge, so the
// four products' own colours cut across the page. Under it, what I did on it.
// The band repeats the name's link for pointer users only: one tab stop per project.
// The inline script settles the bands before first paint on full loads where the develop
// shouldn't play (seen this visit, or reduced motion); DevelopList covers client navigation.
// It never touches a develop that has already started (data-go), wherever it ends up running
const settle = `try{var u=document.querySelector(".wi");if(u&&!u.hasAttribute("data-go")&&(sessionStorage.getItem("work-develop")!==null||matchMedia("(prefers-reduced-motion: reduce)").matches))u.removeAttribute("data-develop")}catch(e){}`;

export default function WorkPage() {
  return (
    <Page className="page work-index">
      <h1 className="sr-only">Work</h1>
      <div className="wrap">
        <p className="wi-lead">Two tools I work on at CodeChef-VIT, two I built on my own.</p>
      </div>
      <DevelopList>
        {projects.map((p, i) => (
          <li key={p.slug} style={{ "--i": i, "--x": p.band.x, "--edge": p.band.edge } as CSSProperties}>
            <Link href={`/work/${p.slug}`} className="wi-band" tabIndex={-1} aria-hidden="true">
              <img
                src={`/work/band/${p.slug}.webp`}
                width={1440}
                height={160}
                alt=""
                fetchPriority={i === 0 ? "high" : undefined}
              />
              <img className="wi-m wi-m10" src={`/work/band/${p.slug}-10.png`} width={144} height={16} alt="" />
              <img className="wi-m wi-m40" src={`/work/band/${p.slug}-40.png`} width={36} height={4} alt="" />
            </Link>
            <div className="wi-row wrap">
              <h2 className="wi-name">
                <Link href={`/work/${p.slug}`}>{p.title}</Link>
              </h2>
              {p.contribution && <p className="wi-did">{p.contribution}</p>}
            </div>
          </li>
        ))}
      </DevelopList>
      <script dangerouslySetInnerHTML={{ __html: settle }} />
    </Page>
  );
}
