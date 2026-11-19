"use client";

import type { MouseEvent } from "react";
import { toggleTheme } from "@/lib/theme";

export default function ThemeToggle() {
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    // Keyboard presses have no pointer position, so the circle starts from the button's centre
    const box = e.currentTarget.getBoundingClientRect();
    const fromKeyboard = e.detail === 0;
    toggleTheme(fromKeyboard ? box.left + box.width / 2 : e.clientX, fromKeyboard ? box.top + box.height / 2 : e.clientY);
  }

  return (
    <button className="theme-toggle" type="button" aria-label="Switch colour theme" onClick={onClick}>
      <span className="theme-icon" aria-hidden="true" />
    </button>
  );
}
