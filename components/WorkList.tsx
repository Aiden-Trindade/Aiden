import Link from "next/link";
import { projects } from "@/data/content";
import Reveal from "./Reveal";

const featured = projects.filter((p) => p.featured);
const others = projects.filter((p) => !p.featured);

export default function WorkList() {
  return (
    <>
      <div className="work-list">
        {featured.map((p) => (
          <Reveal as="article" className="work" key={p.slug}>
            <div className="work-head">
              <h3 className="work-title">
                <Link href={`/work/${p.slug}`}>{p.title}</Link>
              </h3>
              {p.note && <span className="hand work-note">{p.note}</span>}
            </div>
            <p className="work-role">{p.role}</p>
            <p className="work-blurb">{p.blurb}</p>
            <p className="work-meta">
              <span className="work-tags">{p.tags.join(", ")}</span>
              <Link href={`/work/${p.slug}`}>Read more</Link>
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              )}
              {p.source && (
                <a href={p.source} target="_blank" rel="noopener noreferrer">
                  Code
                </a>
              )}
            </p>
          </Reveal>
        ))}
      </div>

      {others.length > 0 && (
        <Reveal className="more">
          <p className="hand more-note">and a few smaller ones</p>
          <ul className="more-list">
            {others.map((p) => (
              <li key={p.slug}>
                <strong>
                  <Link href={`/work/${p.slug}`}>{p.title}</Link>
                </strong>
                <span>{p.blurb}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </>
  );
}
