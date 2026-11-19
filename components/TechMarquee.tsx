"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  siC,
  siCplusplus,
  siCss,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNextdotjs,
  siPostgresql,
  siPwa,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

// Two rows of tech logos drifting in opposite directions. The rows are coupled to
// the page: scrolling speeds them up and leans them into the motion, scrolling back
// up runs them backwards. Hovering a row brings it to a gentle stop, and a row can be
// grabbed and flung. Each logo picks up its brand colour when you point at it.

type Tech = { icon: SimpleIcon; label?: string };

const ROWS: Tech[][] = [
  [
    { icon: siPython },
    { icon: siJavascript },
    { icon: siTypescript },
    { icon: siCplusplus },
    { icon: siC },
    { icon: siNextdotjs },
    { icon: siReact },
    { icon: siTailwindcss },
  ],
  [
    { icon: siHtml5, label: "HTML" },
    { icon: siCss },
    { icon: siMysql },
    { icon: siPostgresql },
    { icon: siSupabase },
    { icon: siMongodb },
    { icon: siGit },
    { icon: siGithub },
    { icon: siPwa, label: "PWAs" },
  ],
];

// Pixels per second when nothing is going on
const CRUISE = 46;
const COPIES = [0, 1, 2];

// Some brand colours are near-black and would disappear on the dark theme
function brandColour(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.25 ? "var(--text)" : `#${hex}`;
}

function Item({ tech }: { tech: Tech }) {
  return (
    <li className="tech" style={{ "--brand": brandColour(tech.icon.hex) } as React.CSSProperties}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={tech.icon.path} />
      </svg>
      <span>{tech.label ?? tech.icon.title}</span>
    </li>
  );
}

type RowState = { offset: number; hover: boolean; ease: number; fling: number; drag: { x: number; t: number } | null };

// Whether motion is welcome, kept in sync with the system setting
const motionQuery = "(prefers-reduced-motion: no-preference)";
function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function TechMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rows = useRef<RowState[]>(ROWS.map(() => ({ offset: 0, hover: false, ease: 1, fling: 0, drag: null })));
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  // Before hydration, and without motion, the rows render as static lists
  const moving = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );

  useEffect(() => {
    if (!moving) return;
    const tracks = trackRefs.current;
    let frame = 0;
    let visible = false;
    let lastT = 0;
    let lastY = window.scrollY;
    let scrollV = 0;

    const tick = (t: number) => {
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      // Scroll velocity in px/s, smoothed so a flick reads as a surge, not a jolt
      const y = window.scrollY;
      const raw = dt ? (y - lastY) / dt : 0;
      lastY = y;
      scrollV += (raw - scrollV) * Math.min(1, dt * 6);

      rows.current.forEach((row, i) => {
        const track = trackRefs.current[i];
        if (!track) return;
        const width = track.scrollWidth / COPIES.length;
        const dir = i % 2 ? 1 : -1;
        row.ease += ((row.hover || pausedRef.current ? 0 : 1) - row.ease) * Math.min(1, dt * 5);
        row.fling *= Math.exp(-dt * 3);
        if (!row.drag) {
          const surge = Math.max(-2400, Math.min(2400, scrollV * 0.9));
          row.offset += (dir * (CRUISE + surge) * row.ease + row.fling) * dt;
        }
        row.offset = ((row.offset % width) + width) % width;
        const lean = pausedRef.current ? 0 : Math.max(-7, Math.min(7, (scrollV / 260) * -dir * row.ease));
        track.style.transform = `translate3d(${-row.offset}px, 0, 0) skewX(${lean.toFixed(2)}deg)`;
      });

      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        lastT = 0;
        lastY = window.scrollY;
        // Start from rest, not from whatever lean the rows had when they left the screen
        scrollV = 0;
        frame = requestAnimationFrame(tick);
      }
    });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      // If motion gets switched off, the rows fall back to their static layout
      tracks.forEach((track) => track?.style.removeProperty("transform"));
    };
  }, [moving]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>, i: number) {
    if (!moving || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    rows.current[i].drag = { x: e.clientX, t: e.timeStamp };
    rows.current[i].fling = 0;
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>, i: number) {
    const row = rows.current[i];
    if (!row.drag) return;
    const now = e.timeStamp;
    const dx = e.clientX - row.drag.x;
    row.offset -= dx;
    // Remember how fast it was thrown, for the fling on release
    // Blend with the previous reading, so a little settle before letting go doesn't kill a throw
    row.fling = row.fling * 0.6 + (-dx / Math.max(1, now - row.drag.t)) * 1000 * 0.4;
    row.drag = { x: e.clientX, t: now };
  }

  function onPointerUp(i: number) {
    rows.current[i].drag = null;
  }

  return (
    <>
      <div className="marquee" ref={rootRef} data-moving={moving || undefined}>
        <ul className="sr-only">
          {ROWS.flat().map((t) => (
            <li key={t.icon.slug}>{t.label ?? t.icon.title}</li>
          ))}
        </ul>
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="marquee-row"
            aria-hidden="true"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") rows.current[i].hover = true;
            }}
            onPointerLeave={() => {
              rows.current[i].hover = false;
            }}
            onPointerDown={(e) => onPointerDown(e, i)}
            onPointerMove={(e) => onPointerMove(e, i)}
            onPointerUp={() => onPointerUp(i)}
            onPointerCancel={() => onPointerUp(i)}
          >
            <div
              className="marquee-track"
              ref={(el) => {
                trackRefs.current[i] = el;
              }}
            >
              {/* Drawn three times so the loop is seamless even on very wide screens */}
              {COPIES.map((copy) => (
                <ul key={copy} className="marquee-set">
                  {row.map((t) => (
                    <Item tech={t} key={t.icon.slug} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
      {moving && (
        // Moving content needs a way to stop it, for anyone who finds it distracting
        <p className="marquee-foot wrap">
          <button
            type="button"
            className="marquee-pause"
            onClick={() => {
              pausedRef.current = !paused;
              setPaused(!paused);
            }}
          >
            {paused ? "Play the logos" : "Pause the logos"}
          </button>
        </p>
      )}
    </>
  );
}
