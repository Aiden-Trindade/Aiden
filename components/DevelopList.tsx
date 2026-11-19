"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

// The /work list. Once per visit, each band of screenshot develops: it shows as coarse
// pixel blocks, then finer ones, then the real 1:1 pixels, top band first. The steps are
// hard cuts set in CSS; this only starts them once every layer has decoded, so no band
// sharpens before its pixels exist. Reduced motion and later visits skip straight to sharp.
export default function DevelopList({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const ul = ref.current;
    // Effects can run again on the same list (Strict Mode, transitions); a develop that
    // has already started is left to finish
    if (!ul || "go" in ul.dataset) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("work-develop") !== null;
    } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      delete ul.dataset.develop;
      return;
    }
    let cancelled = false;
    Promise.all([...ul.querySelectorAll("img")].map((img) => img.decode())).then(
      () => {
        if (cancelled) return;
        ul.dataset.go = "";
        try {
          sessionStorage.setItem("work-develop", "1");
        } catch {}
      },
      () => {
        if (!cancelled) delete ul.dataset.develop;
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul ref={ref} className="wi" data-develop="" suppressHydrationWarning>
      {children}
    </ul>
  );
}
