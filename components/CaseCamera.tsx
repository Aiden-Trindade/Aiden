"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, useSyncExternalStore, ViewTransition, type CSSProperties } from "react";
import type { Region } from "@/data/content";

// A project page's write-up beside its screenshot. The screenshot is a camera that the
// text steers: as each section crosses the reading line, the camera frames the part of
// the product that section describes, and four viewfinder corners close in on it. On a
// section about my own work the corners turn accent and the frame gets a caption. The
// page loads on the whole screenshot, so the morph from the home list lands on a still
// figure. Wide screens pin the figure beside the text; tall narrow ones pin it as a band
// above it; short, landscape phones get a plain screenshot.

type Shot = { focus?: Region; label?: string };

const WIDE = "(min-width: 1200px)";
const TALL = "(min-height: 640px)";

// The reading line: the middle of the screen, lower on phones where the band covers the top
const LINE = { wide: "-50% 0px -50% 0px", band: "-62% 0px -38% 0px" };
// Zooming further than this softens the screenshot's text too much
const CAP = { wide: 2.2, band: 1.8 };
// Corners stay this far inside the frame, so its rounded edge never clips them
const INSET = 0.02;

type Mode = "wide" | "band" | "off";

function subscribe(onChange: () => void) {
  const queries = [matchMedia(WIDE), matchMedia(TALL)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

function getMode(): Mode {
  if (matchMedia(WIDE).matches) return "wide";
  return matchMedia(TALL).matches ? "band" : "off";
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// The camera for a region: zoom until the region fills ~80% of the frame, centre on it,
// then slide the window back inside the image so the frame never shows past its edges
function aim(focus: Region | undefined, cap: number) {
  if (!focus) return { s: 1, left: 0, top: 0, box: [INSET, INSET, 1 - INSET, 1 - INSET] };
  const [x, y, w, h] = focus;
  const s = clamp(0.8 / Math.max(w, h), 1, cap);
  const view = 1 / s;
  const left = clamp(x + w / 2 - view / 2, 0, 1 - view);
  const top = clamp(y + h / 2 - view / 2, 0, 1 - view);
  // The region's edges in the frame, as fractions of its width and height
  const edge = (v: number, from: number) => clamp((v - from) * s, INSET, 1 - INSET);
  return { s, left, top, box: [edge(x, left), edge(y, top), edge(x + w, left), edge(y + h, top)] };
}

export default function CaseCamera({
  slug,
  image,
  alt,
  shots,
  children,
}: {
  slug: string;
  image: string;
  alt: string;
  shots: Shot[];
  children: React.ReactNode;
}) {
  const mode = useSyncExternalStore(subscribe, getMode, () => "off" as Mode);
  const stepsRef = useRef<HTMLDivElement>(null);
  // The section last crossed by the reading line; none yet on load
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const steps = stepsRef.current;
    if (mode === "off" || !steps) return;
    const sections = Array.from(steps.children);
    // Only a section crossing the line changes the shot. In the gaps between sections
    // nothing is crossing it, and the camera holds rather than snapping back
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setStep(sections.indexOf(entry.target));
        }
      },
      { rootMargin: LINE[mode] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [mode]);

  const shot = mode === "off" ? undefined : shots[step];
  const { s, left, top, box } = aim(shot?.focus, mode === "off" ? 1 : CAP[mode]);
  const state = !shot?.focus ? "full" : shot.label ? "mine" : "region";
  const vars = {
    "--s": s,
    "--l": left,
    "--t": top,
    "--x1": box[0],
    "--y1": box[1],
    "--x2": box[2],
    "--y2": box[3],
  } as CSSProperties;
  const labels = shots.filter((sh) => sh.label);

  return (
    <div className="cam">
      <div className="cam-pin">
        {/* The hover preview on the home list grows into this screenshot */}
        <ViewTransition name={`shot-${slug}`} share="shot-morph" default="none">
          <figure className="cam-frame" data-state={state} style={vars}>
            <img src={image} alt={alt} />
            {(["tl", "tr", "br", "bl"] as const).map((c) => (
              <svg key={c} className={`cam-corner cam-${c}`} viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 13V1h12" />
                <path d="M1 13V1h12" />
              </svg>
            ))}
          </figure>
        </ViewTransition>
        {labels.length > 0 && (
          // Says what the accent frame shows; the section beside it already says it in words
          <p className="cam-caption" aria-hidden="true">
            {labels.map((sh) => (
              <span key={sh.label} data-on={sh === shot || undefined}>
                {sh.label}
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="cam-steps" ref={stepsRef}>
        {children}
      </div>
    </div>
  );
}
