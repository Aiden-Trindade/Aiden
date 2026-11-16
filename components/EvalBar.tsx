"use client";

import { useEffect, useState } from "react";

// A chess engine evaluation bar down the right edge. The position "improves"
// as you scroll, from an even 0.0 at the top to a forced mate at the bottom.
export default function EvalBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
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

  const mate = progress > 0.97;
  const score = mate ? "M1" : (progress * 6.5).toFixed(1);
  // White's share of the bar, like a real engine: half at 0.0, nearly full when winning
  const white = mate ? 1 : 0.5 + 0.45 * Math.tanh(progress * 6.5 * 0.45);

  return (
    <div className="eval" aria-hidden="true" title="Engine evaluation">
      <div className="eval-track">
        <div className="eval-white" style={{ transform: `scaleY(${white})` }} />
      </div>
      <span className={`eval-score ${mate ? "mate" : ""}`.trim()}>+{score}</span>
    </div>
  );
}
