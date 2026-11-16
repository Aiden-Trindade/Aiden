/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { links } from "@/data/content";

export const metadata: Metadata = { title: "About" };

const facts = [
  ["2200", "Peak chess rating on Chess.com"],
  ["11th", "In the world at the International MaRRs Spell Bee"],
  ["State level", "Debate competitions won in school"],
  ["97.5%", "In Grade 10"],
  ["8.5", "GPA in my first semester at VIT"],
  ["1500+", "Papers on the site I help build"],
  ["11K+", "Students using FFCS-inator, which I helped revamp"],
];

export default function AboutPage() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title rise">
          About <em>me</em>
        </h1>
        <div className="about-grid">
          <div>
            <p>
              I&apos;m Aiden, a Computer Science student at VIT Vellore and a frontend developer at CodeChef-VIT,
              working on Papers and FFCS-inator.
            </p>
            <p>
              Before code there was chess, debate and spelling bees. They taught me to work through hard problems,
              explain an idea under pressure and sweat the details.
            </p>
            <p>
              I&apos;m looking for a frontend internship. The fastest way to reach me is{" "}
              <a href={`mailto:${links.email}`}>{links.email}</a>.
            </p>
          </div>
          <figure className="polaroid">
            <img src="/profile.jpeg" alt="Aiden Trindade" />
            <figcaption className="hand">that&apos;s me</figcaption>
          </figure>
        </div>
        <dl className="facts">
          {facts.map(([value, label]) => (
            <div key={value}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
        <section className="job">
          <p className="hand job-note">where it got real</p>
          <div className="job-head">
            <h2>Yash Tech</h2>
            <span>AI Intern · Pune</span>
          </div>
          <p className="job-lead">
            Price negotiation is slow, and it rarely comes down to numbers alone. We built an AI model that sits between
            the vendor and the seller and works out a price both sides can agree on.
          </p>
          <ul className="job-points">
            <li>
              <strong>It thinks like a negotiator.</strong> The model weighs real-life context, like how many years two
              companies have worked together, instead of just comparing quotes.
            </li>
            <li>
              <strong>It plugs into real workflows.</strong> The agreed price feeds into enterprise resource planning on
              SAP, cutting out the back-and-forth that slows procurement down.
            </li>
            <li>
              <strong>It taught me how companies run.</strong> I saw how software fits around business rules and
              long-standing relationships, not the other way round.
            </li>
          </ul>
          <p className="work-tags">AI, price negotiation, SAP, ERP</p>
        </section>
      </div>
    </main>
  );
}
