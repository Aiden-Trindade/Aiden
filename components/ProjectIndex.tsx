"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition, type PointerEvent } from "react";
import { projects } from "@/data/content";

// The project list. Each row is one big link. On a device with a mouse, hovering a row
// shows that project's screenshot below the pointer, over the dimmed rows rather than
// the one being read. The preview eases after the pointer and leans a little with it.
// Opening a project, the row's title grows into the page title, and the screenshot
// (the hover preview, or the thumbnail that was tapped on a phone) grows into the page's.

// Gap between the pointer and the preview, between the hovered row and the preview, and
// the margin it keeps from the screen edges (wider on the right, where the eval bar sits)
const OFFSET = 28;
const GAP = 8;
const EDGE = 16;
const EDGE_RIGHT = 64;

export default function ProjectIndex() {
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0, tilt: 0 });
  const frame = useRef(0);
  const [active, setActive] = useState<string | null>(null);
  // The row a touch or pen opened, so its thumbnail can morph into the page
  const [tapped, setTapped] = useState<string | null>(null);
  // The row being opened, whose title morphs into the project page's
  const [opening, setOpening] = useState<string | null>(null);
  // The first-hover check reads the latest value outside render
  const activeRef = useRef<string | null>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  function tick() {
    const el = previewRef.current;
    if (!el) return;
    const c = current.current;
    const t = target.current;
    const dx = t.x - c.x;
    // With reduced motion the preview sits at the pointer, with no easing or lean
    const ease = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.18;
    c.x += dx * ease;
    c.y += (t.y - c.y) * ease;
    if (ease === 1) c.tilt = 0;
    // Lean into horizontal movement, capped low so it reads as weight, not wobble
    else c.tilt += (Math.max(-4, Math.min(4, dx * 0.08)) - c.tilt) * 0.2;
    el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) rotate(${c.tilt}deg)`;

    const moving = Math.abs(dx) > 0.3 || Math.abs(t.y - c.y) > 0.3 || Math.abs(c.tilt) > 0.05;
    frame.current = moving ? requestAnimationFrame(tick) : 0;
  }

  // Beside the pointer horizontally, and below the hovered row (above it near the bottom
  // of the screen), so it covers the dimmed rows rather than the one being read
  function place(x: number, row: DOMRect) {
    const el = previewRef.current;
    const w = el?.offsetWidth ?? 0;
    const h = el?.offsetHeight ?? 0;
    let tx = x + OFFSET;
    if (tx + w > innerWidth - EDGE_RIGHT) tx = x - w - OFFSET;
    let ty = row.bottom + GAP;
    if (ty + h > innerHeight - EDGE) ty = row.top - h - GAP;
    return { x: Math.max(EDGE, tx), y: Math.max(EDGE, ty) };
  }

  function pointAt(x: number, row: DOMRect) {
    target.current = place(x, row);
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }

  function show(slug: string, x: number, row: DOMRect) {
    // First hover: appear in place rather than flying in from the corner
    if (!activeRef.current) {
      const at = place(x, row);
      current.current = { ...at, tilt: 0 };
      if (previewRef.current) previewRef.current.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
    }
    pointAt(x, row);
    setActive(slug);
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const shown = projects.find((p) => p.slug === active);

  return (
    <div className="index" onPointerLeave={() => setActive(null)}>
      <ul className="index-list">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              className="index-row"
              onPointerEnter={(e: PointerEvent<HTMLElement>) => {
                if (e.pointerType === "mouse") show(p.slug, e.clientX, e.currentTarget.getBoundingClientRect());
              }}
              onPointerMove={(e: PointerEvent<HTMLElement>) => {
                if (e.pointerType === "mouse") pointAt(e.clientX, e.currentTarget.getBoundingClientRect());
              }}
              onPointerDown={(e: PointerEvent<HTMLElement>) => {
                if (e.pointerType !== "mouse") setTapped(p.slug);
              }}
              // A mouse press focuses the link too; only keyboard focus hides the preview,
              // so a click keeps it for the morph
              onFocus={(e) => {
                if (e.currentTarget.matches(":focus-visible")) setActive(null);
              }}
              // Only the row being opened carries the title morph. If every row did, the row
              // for the project shown as "Next project" would fly down the new page too
              onClick={() => setOpening(p.slug)}
            >
              {p.slug === opening ? (
                <ViewTransition name={`title-${p.slug}`} share="title-morph" default="none">
                  <span className="index-title">{p.title}</span>
                </ViewTransition>
              ) : (
                <span className="index-title">{p.title}</span>
              )}
              <span className="index-summary">{p.summary}</span>
              <span className="index-proof">{p.proof}</span>
              {p.image &&
                (p.slug === tapped ? (
                  <ViewTransition name={`shot-${p.slug}`} share="shot-morph" default="none">
                    <img className="index-thumb" src={p.image} alt="" loading="lazy" />
                  </ViewTransition>
                ) : (
                  <img className="index-thumb" src={p.image} alt="" loading="lazy" />
                ))}
            </Link>
          </li>
        ))}
      </ul>

      <div ref={previewRef} className={`index-preview ${shown?.image ? "on" : ""}`.trim()} aria-hidden="true">
        {projects
          .filter((p) => p.image)
          .map((p) =>
            // Only the visible preview takes part in the morph into the project page
            p.slug === active ? (
              <ViewTransition key={p.slug} name={`shot-${p.slug}`} share="shot-morph" default="none">
                <img src={p.image} alt="" className="on" />
              </ViewTransition>
            ) : (
              <img key={p.slug} src={p.image} alt="" />
            ),
          )}
      </div>
    </div>
  );
}
