import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.blurb } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="page">
      <div className="container">
        <Link href="/work" className="page-back">
          ← All work
        </Link>
        <div className="work-head">
          <h1 className="page-title rise">{project.title}</h1>
          {project.note && <span className="hand work-note">{project.note}</span>}
        </div>
        <p className="work-role">{project.role}</p>
        <p className="work-meta">
          <span className="work-tags">{project.tags.join(", ")}</span>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              Visit
            </a>
          )}
          {project.source && (
            <a href={project.source} target="_blank" rel="noopener noreferrer">
              Code
            </a>
          )}
        </p>
        <div className="case">
          {project.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
