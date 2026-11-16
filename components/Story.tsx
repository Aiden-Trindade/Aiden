"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/data/content";

// Three chapters with a thin line that fills as you scroll. Chapters you
// haven't reached yet stay slightly faded.
export default function Story({ chapters }: { chapters: Chapter[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight * 0.6;
      const box = list.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (middle - box.top) / box.height)));

      let current = 0;
      [...list.children].forEach((item, i) => {
        if (item.getBoundingClientRect().top < middle) current = i;
      });
      setReached(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol ref={ref} className="story" style={{ "--progress": progress } as React.CSSProperties}>
      {chapters.map((c, i) => (
        <li key={c.when} className={`chapter ${i <= reached ? "reached" : ""}`.trim()}>
          <p className="chapter-when">{c.when}</p>
          <div className="chapter-body">
            <h3 className="chapter-title">{c.title}</h3>
            {c.paragraphs.map((p) => (
              <p className="chapter-text" key={p.slice(0, 24)}>
                {p}
              </p>
            ))}
          </div>
          <div className="chapter-side">
            {c.photo && (
              <figure className="polaroid">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.photo.src} alt="Aiden Trindade" />
                <figcaption className="hand">{c.photo.caption}</figcaption>
              </figure>
            )}
            <ul className="chapter-notes">
              {c.notes.map((n) => (
                <li key={n} className="hand">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
