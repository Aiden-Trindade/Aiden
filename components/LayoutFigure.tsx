"use client";

import { useEffect, useRef, useState } from "react";

// FFCS-inator v2.0.1 put course search and the selected courses side by side.
// The drawing starts as the old layout (two separate frames), closes the gap once
// when it's well into view, and after that a button flips between the two.
// With reduced motion, CSS shows a static before/after pair instead and hides the button.
export default function LayoutFigure() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [after, setAfter] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // A short hold so the old layout registers before it changes
        timer = window.setTimeout(() => {
          setAfter(true);
          setPlayed(true);
        }, 300);
      },
      { threshold: 0.6 },
    );
    observer.observe(stage);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <figure className="lf" data-played={played || undefined}>
      <div ref={stageRef} className="lf-stage lf-live" data-state={after ? "after" : "before"} aria-hidden="true">
        <Drawing />
      </div>
      <div className="lf-pair" aria-hidden="true">
        <p className="lf-tag">Before</p>
        <div className="lf-stage" data-state="before">
          <Drawing />
        </div>
        <p className="lf-tag">v2.0.1</p>
        <div className="lf-stage" data-state="after">
          <Drawing />
        </div>
      </div>
      <figcaption>
        Course search and your selected courses, side by side on wide screens (FFCS-inator v2.0.1).
      </figcaption>
      <button type="button" className="lf-flip" aria-pressed={played && !after} onClick={() => setAfter((a) => !a)}>
        Show the old layout
      </button>
    </figure>
  );
}

function Drawing() {
  return (
    <>
      <div className="lf-outer" />
      <div className="lf-frame lf-a">
        <span className="lf-label">Search</span>
        <span className="lf-field" />
        <span className="lf-row" />
        <span className="lf-row" />
        <span className="lf-row lf-short" />
      </div>
      <div className="lf-frame lf-b">
        <span className="lf-label">Your courses</span>
        <span className="lf-row" />
        <span className="lf-row lf-short" />
      </div>
      <div className="lf-divider" />
    </>
  );
}
