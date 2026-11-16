"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const nav = [
  ["/work", "Work"],
  ["/blog", "Blog"],
  ["/about", "About"],
  ["/now", "Now"],
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          Aiden Trindade
        </Link>
        <nav className="nav" aria-label="Main navigation">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
