"use client";

import { useEffect, useRef } from "react";
import type { Eval } from "@/lib/chess/opera";

// A chess engine evaluation bar down the right edge. The position "improves" as you
// scroll, from an even 0.0 at the top to a forced mate at the bottom. Each section
// heading leaves a notch on the bar, so it doubles as a map of the page.
// While the Opera Game board is on screen, the bar reads that game instead: the real
// engine evaluation of the position on the board, move by move.
// It writes straight to the DOM on scroll; there's nothing here for React to re-render.

// White's share of the bar for a real evaluation, using Lichess's winning-chances curve
function share(e: Eval) {
  if ("mate" in e) return 1;
  return 0.5 + 0.5 * (2 / (1 + Math.exp(-0.00368208 * e.cp)) - 1);
}

function label(e: Eval) {
  if ("mate" in e) return e.mate === 0 ? "1-0" : `#${e.mate}`;
  return `${e.cp < 0 ? "−" : "+"}${(Math.abs(e.cp) / 100).toFixed(1)}`;
}

export default function EvalBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const notchesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const score = scoreRef.current;
    const notches = notchesRef.current;
    if (!bar || !score || !notches) return;

    let frame = 0;
    let board: Eval | null = null;
    const update = () => {
      frame = 0;
      bar.dataset.source = board ? "board" : "scroll";
      if (board) {
        bar.style.setProperty("--white", share(board).toFixed(4));
        bar.toggleAttribute("data-mate", "mate" in board);
        score.textContent = label(board);
        return;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const mate = progress > 0.985;
      // White's share of the bar, like a real engine: half at 0.0, nearly full when winning
      const white = mate ? 1 : 0.5 + 0.45 * Math.tanh(progress * 6.5 * 0.45);
      bar.style.setProperty("--white", white.toFixed(4));
      // Plain progress, for the hairline on narrow screens
      bar.style.setProperty("--progress", progress.toFixed(4));
      bar.toggleAttribute("data-mate", mate);
      score.textContent = mate ? "M1" : `+${(progress * 6.5).toFixed(1)}`;
    };

    // Notches where each section starts, placed by how far down the page it sits
    const placeNotches = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      notches.replaceChildren(
        ...[...document.querySelectorAll("main h2")].map((h) => {
          const top = h.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
          const p = Math.min(1, Math.max(0, top / Math.max(1, max)));
          const white = 0.5 + 0.45 * Math.tanh(p * 6.5 * 0.45);
          const notch = document.createElement("i");
          notch.style.setProperty("--at", white.toFixed(4));
          notch.style.setProperty("--p", p.toFixed(4));
          return notch;
        }),
      );
      update();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(placeNotches);
    ro.observe(document.body);
    const onBoard = (e: Event) => {
      board = (e as CustomEvent<Eval | null>).detail;
      update();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("board-eval", onBoard);
    placeNotches();
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("board-eval", onBoard);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="eval" ref={barRef} aria-hidden="true" title="Engine evaluation">
      <div className="eval-track">
        <div className="eval-white" />
        <div className="eval-notches" ref={notchesRef} />
      </div>
      <span className="eval-score" ref={scoreRef}>
        +0.0
      </span>
    </div>
  );
}
