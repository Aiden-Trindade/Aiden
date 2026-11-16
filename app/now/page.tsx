import type { Metadata } from "next";

export const metadata: Metadata = { title: "Now" };

const items = [
  ["Building", "The frontend of Papers and FFCS-inator at CodeChef-VIT, and this site."],
  ["Writing", "A blog, starting now."],
  ["Looking for", "A frontend internship, somewhere people care about getting the details right."],
];

export default function NowPage() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title rise">
          Right <em>now</em>
        </h1>
        <p className="page-lead rise">What I&apos;m up to at the moment.</p>
        <ul className="now-list">
          {items.map(([heading, text]) => (
            <li key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        <p className="hand now-updated">last updated November 2026</p>
      </div>
    </main>
  );
}
