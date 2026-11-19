"use client";

import { useEffect, useState } from "react";
import { fetchRatings, LICHESS_URL, LICHESS_USER, type Rating } from "@/lib/lichess";

// Shows the ratings baked in at build time, then swaps in the live ones from lichess
export default function LichessRatings({ initial }: { initial: Rating[] | null }) {
  const [ratings, setRatings] = useState(initial);

  useEffect(() => {
    let live = true;
    fetchRatings().then((fresh) => {
      if (live && fresh) setRatings(fresh);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className="ratings">
      <p>
        I play as{" "}
        <a href={LICHESS_URL} target="_blank" rel="noopener noreferrer">
          {LICHESS_USER} on lichess
        </a>
        .
      </p>
      {ratings && ratings.length > 0 && (
        <>
          <dl>
            {ratings.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>
                  {r.rating}
                  {r.provisional && <span className="sr-only">, provisional</span>}
                  <small>{r.games.toLocaleString("en-US")} games</small>
                </dd>
              </div>
            ))}
          </dl>
          {/* Lichess marks these "?" after time away from a time control; one note says it once */}
          {ratings.some((r) => r.provisional) && (
            <p className="ratings-note">Lichess counts these as provisional while I&apos;m away from the board.</p>
          )}
        </>
      )}
    </div>
  );
}
