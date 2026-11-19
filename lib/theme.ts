// Flips between the dark and light theme and remembers the choice.
// Where the browser supports it, the new theme spreads out in a circle from
// the point that was clicked (x, y). It's a rare action, so it gets a moment.
export function toggleTheme(x?: number, y?: number) {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";

  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced || x === undefined || y === undefined) {
    apply();
    return;
  }

  // A radius that reaches the farthest corner of the screen from the click
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  root.style.setProperty("--vt-r", `${r}px`);
  root.classList.add("theme-switching");

  document.startViewTransition(apply).finished.finally(() => root.classList.remove("theme-switching"));
}
