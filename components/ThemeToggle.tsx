"use client";

import { toggleTheme } from "@/lib/theme";

export default function ThemeToggle() {
  return (
    <button className="theme-toggle" type="button" aria-label="Switch colour theme" onClick={toggleTheme}>
      <span className="theme-icon" aria-hidden="true" />
    </button>
  );
}
