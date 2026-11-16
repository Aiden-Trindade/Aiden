"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

// Fades its content in the first time it scrolls into view
export default function Reveal({ as: Tag = "div", className = "", children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const check = () => {
      frame = 0;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        setShown(true);
        stop();
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return stop;
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${shown ? "shown" : ""} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
