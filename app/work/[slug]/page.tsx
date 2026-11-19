import type { Metadata } from "next";
import { ViewTransition } from "react";
import Page from "@/components/Page";
import CaseCamera from "@/components/CaseCamera";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/content";
import "../work.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const sections = project.sections.map((s) => (
    <section key={s.heading}>
      <h2>{s.heading}</h2>
      <p>{s.text}</p>
    </section>
  ));

  return (
    <Page className="page wrap">
      <Link href="/work" className="back">
        All work
      </Link>
      <h1 className="case-title">
        {/* The name arrives from the row (or the "Next project" link) that opened it */}
        <ViewTransition name={`title-${project.slug}`} share="title-morph" default="none">
          <span className="case-name">{project.title}</span>
        </ViewTransition>
        <span className="case-headline">{project.headline ?? project.summary}</span>
      </h1>

      <dl className="case-facts">
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Built with</dt>
          <dd>{project.tags.join(", ")}</dd>
        </div>
        <div>
          <dt>Links</dt>
          <dd className="link-row">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                Live site
              </a>
            )}
            {project.source && (
              <a href={project.source} target="_blank" rel="noopener noreferrer">
                Source code
              </a>
            )}
          </dd>
        </div>
      </dl>

      {project.image ? (
        <CaseCamera
          slug={project.slug}
          image={project.image}
          alt={`Screenshot of ${project.title}`}
          shots={project.sections.map((s) => ({ focus: s.focus, label: s.focusLabel }))}
        >
          {sections}
        </CaseCamera>
      ) : (
        <div className="cam-steps">{sections}</div>
      )}

      <Link href={`/work/${next.slug}`} className="next">
        <span>Next project</span>
        <ViewTransition name={`title-${next.slug}`} share="title-morph" default="none">
          <strong>{next.title}</strong>
        </ViewTransition>
        <span className="next-headline">{next.headline ?? next.summary}</span>
      </Link>
    </Page>
  );
}
