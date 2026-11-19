// Aiden's lichess ratings, from the public API. The page is a static export, so the
// numbers are fetched once at build time and again in the browser, so they stay current.

export const LICHESS_USER = "A_Lost_Child";
export const LICHESS_URL = `https://lichess.org/@/${LICHESS_USER}`;

export type Rating = {
  label: string;
  rating: number;
  games: number;
  // Lichess marks a rating provisional (shown with a "?") when it's uncertain,
  // for example after a long break from that time control
  provisional: boolean;
};

// The time controls worth showing, in the order lichess lists them. Four fit on one row
const SHOWN: [key: string, label: string][] = [
  ["bullet", "Bullet"],
  ["blitz", "Blitz"],
  ["rapid", "Rapid"],
  ["puzzle", "Puzzles"],
];

type Perf = { rating?: number; games?: number; prov?: boolean };

export async function fetchRatings(): Promise<Rating[] | null> {
  try {
    const res = await fetch(`https://lichess.org/api/user/${LICHESS_USER}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data: { perfs?: Record<string, Perf> } = await res.json();
    return SHOWN.flatMap(([key, label]) => {
      const perf = data.perfs?.[key];
      return perf?.rating && perf.games
        ? [{ label, rating: perf.rating, games: perf.games, provisional: Boolean(perf.prov) }]
        : [];
    });
  } catch {
    return null;
  }
}
