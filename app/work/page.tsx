import type { Metadata } from "next";
import WorkList from "@/components/WorkList";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title rise">
          Things I&apos;ve <em>made</em>
        </h1>
        <p className="page-lead rise">Two that thousands of VIT students lean on every semester, one that checks how honest your gut is, and one I built with no frameworks on purpose.</p>
        <WorkList />
      </div>
    </main>
  );
}
