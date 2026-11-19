"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

// The Now page's heading. Once the best-before month ("2026-12") is over it reads "Now-ish".
// The date is only known in the browser, so the server (and hydration) render the fresh "Now"
// and the browser swaps the word in place. The heading sits on its own line, so nothing moves.
export default function NowTitle({ bestBefore }: { bestBefore: string }) {
  const stale = useSyncExternalStore(
    noSubscribe,
    () => {
      const [year, month] = bestBefore.split("-").map(Number);
      const today = new Date();
      return today.getFullYear() * 12 + today.getMonth() + 1 > year * 12 + month;
    },
    () => false,
  );

  return <h1 className="now-title">{stale ? "Now-ish" : "Now"}</h1>;
}
