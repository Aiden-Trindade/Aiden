"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const nav = [
  ["/work", "Work"],
  ["/blog", "Writing"],
  ["/about", "About"],
  ["/now", "Now"],
];

// Writing only appears once there's something published to read
export default function SiteHeader({ hasPosts }: { hasPosts: boolean }) {
  const pathname = usePathname();

  return (
    <header className="header wrap">
      <Link href="/" className="brand" aria-current={pathname === "/" ? "page" : undefined}>
        Aiden Trindade
      </Link>
      <nav className="nav" aria-label="Main navigation">
        {nav.filter(([href]) => hasPosts || href !== "/blog").map(([href, label]) => (
          <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  );
}
