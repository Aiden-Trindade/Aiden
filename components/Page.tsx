import { ViewTransition } from "react";

// Every page's <main>. Moving between pages, the old one lifts away and the new one
// settles in. It lives in each page rather than the layout, because layouts persist
// across navigations and would never enter or exit.
export default function Page({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <main className={className}>{children}</main>
    </ViewTransition>
  );
}
