"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent, type PointerEvent } from "react";

// The hero: a big intro line, then a debate motion to vote on. "For" carries it.
// "Against" slides away along its row a few times before it can be caught,
// and then gets overruled.

const MOUSE_DODGES = 5;
const TAP_DODGES = 2;

// The handwritten note changes each time Against gets away
const DARES = ["go on, try voting against", "nope", "too slow", "so close", "almost…", "fine, it's yours"];

type Props = {
  email: string;
  github: string;
  linkedin: string;
};

export default function Motion({ email, github, linkedin }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const forRef = useRef<HTMLButtonElement>(null);
  const againstRef = useRef<HTMLButtonElement>(null);
  const [carried, setCarried] = useState(false);
  const [overruled, setOverruled] = useState(false);
  // Which vote happened last, for the stamp and the message
  const [last, setLast] = useState<"carried" | "overruled" | null>(null);
  const [escapes, setEscapes] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  // Slide Against to a random spot along its row, between the For button and
  // the right edge of the screen. Positions come from the layout (offsetLeft),
  // not getBoundingClientRect, so a slide that is still animating can't skew them.
  function dodge() {
    const row = rowRef.current;
    const forBtn = forRef.current;
    const btn = againstRef.current;
    if (!row || !forBtn || !btn) return;

    const rowLeft = row.getBoundingClientRect().left;
    const home = btn.offsetLeft;
    const margin = 20;
    const minX = forBtn.offsetLeft + forBtn.offsetWidth + 16 - home;
    const maxX = Math.max(minX, window.innerWidth - margin - rowLeft - btn.offsetWidth - home);

    let next = offsetX;
    for (let i = 0; i < 16; i++) {
      next = minX + Math.random() * (maxX - minX);
      if (Math.abs(next - offsetX) > btn.offsetWidth * 1.2) break;
    }
    setOffsetX(next);
    setEscapes((n) => n + 1);
  }

  function onAgainstEnter(e: PointerEvent) {
    if (e.pointerType === "mouse" && !overruled && escapes < MOUSE_DODGES) dodge();
  }

  function onAgainstClick(e: MouseEvent) {
    if (overruled) return;
    // Taps on a touch screen dodge a couple of times first. Keyboard presses (detail 0) never dodge.
    const fromKeyboard = e.detail === 0;
    if (!fromKeyboard && escapes < TAP_DODGES && !window.matchMedia("(hover: hover)").matches) {
      dodge();
      return;
    }
    setOverruled(true);
    setLast("overruled");
    setOffsetX(0);
  }

  function voteFor() {
    setCarried(true);
    setLast("carried");
  }

  return (
    <section className="chamber">
      <div className="chamber-light" aria-hidden="true" />

      <div className="container chamber-inner">
        <p className="chamber-intro rise" style={{ animationDelay: "0.05s" }}>
          Aiden Trindade · Computer Science, VIT Vellore
        </p>

        <h1 className="hero-title rise" style={{ animationDelay: "0.2s" }}>
          I build for the web, and sweat the <em>details</em>.
        </h1>

        <div className="debate rise" style={{ animationDelay: "0.45s" }}>
          <div className="debate-motion">
            <p className="debate-house">This house believes</p>
            <p className="debate-text">Aiden should be your next intern.</p>
            {last && (
              <span key={last} className={`stamp stamp-${last}`} aria-hidden="true">
                {last === "carried" ? "Carried" : "Overruled"}
              </span>
            )}
          </div>

          <div className="chamber-vote" ref={rowRef}>
            <button type="button" ref={forRef} className="vote vote-for" onClick={voteFor}>
              For
            </button>
            <button
              type="button"
              ref={againstRef}
              className={`vote vote-against ${overruled ? "overruled" : ""}`.trim()}
              style={{ transform: `translateX(${offsetX}px)` }}
              onPointerEnter={onAgainstEnter}
              onClick={onAgainstClick}
              aria-disabled={overruled}
            >
              {overruled ? "Overruled" : "Against"}
            </button>
          </div>

          {!overruled && !carried && (
            <p className="hand chamber-dare" aria-hidden="true">
              {DARES[Math.min(escapes, DARES.length - 1)]}
            </p>
          )}

          <div className="chamber-result" aria-live="polite">
            {last === "carried" && (
              <p>
                Motion carried. Email me at <a href={`mailto:${email}`}>{email}</a>.
              </p>
            )}
            {last === "overruled" && (
              <p>
                Overruled. I&apos;ve won state-level debates, so this was never going your way. Have a look at{" "}
                <Link href="/work">my work</Link> first.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container chamber-foot rise" style={{ animationDelay: "0.7s" }}>
        <span className="chamber-links">
          <a href={`mailto:${email}`}>{email}</a>
          <a href={github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          {/* TODO: add a Resume link once the PDF is in /public, e.g. <a href="/resume.pdf">Resume</a> */}
        </span>
        <a href="#story" className="chamber-scroll">
          Scroll ↓
        </a>
      </div>
    </section>
  );
}
