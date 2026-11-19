// The Opera Game, Paris 1858. Paul Morphy played white against the Duke of Brunswick
// and Count Isouard, who consulted on every move from their box at the opera.
// Morphy won in 17 moves with a queen sacrifice. The board replays it.

// An engine's view of a position, from white's side: centipawns, or moves to mate
export type Eval = { cp: number } | { mate: number };

export type Ply = {
  san: string;
  // How long the side to move thinks before playing, in ms
  think: number;
  // The evaluation after the move, from the Lichess cloud analysis (depth 32 to 75)
  eval: Eval;
  // The annotation for Morphy's sacrifices. The replay draws an arrow for these
  // while he thinks, and the scoresheet writes the mark after the move
  note?: "!" | "!!";
};

export const START_EVAL: Eval = { cp: 19 };

// While the board is on screen it tells the page's eval bar what the position is worth;
// null hands the bar back to scroll progress
export function announceEval(value: Eval | null) {
  window.dispatchEvent(new CustomEvent<Eval | null>("board-eval", { detail: value }));
}

export const OPERA: Ply[] = [
  { san: "e4", think: 300, eval: { cp: 18 } },
  { san: "e5", think: 250, eval: { cp: 22 } },
  { san: "Nf3", think: 200, eval: { cp: 18 } },
  { san: "d6", think: 300, eval: { cp: 55 } },
  { san: "d4", think: 200, eval: { cp: 58 } },
  { san: "Bg4", think: 500, eval: { cp: 98 } },
  { san: "dxe5", think: 300, eval: { cp: 95 } },
  { san: "Bxf3", think: 300, eval: { cp: 140 } },
  { san: "Qxf3", think: 200, eval: { cp: 153 } },
  { san: "dxe5", think: 300, eval: { cp: 146 } },
  { san: "Bc4", think: 300, eval: { cp: 168 } },
  { san: "Nf6", think: 400, eval: { cp: 208 } },
  { san: "Qb3", think: 300, eval: { cp: 202 } },
  { san: "Qe7", think: 600, eval: { cp: 203 } },
  { san: "Nc3", think: 200, eval: { cp: 203 } },
  { san: "c6", think: 400, eval: { cp: 214 } },
  { san: "Bg5", think: 300, eval: { cp: 200 } },
  { san: "b5", think: 500, eval: { cp: 354 } },
  { san: "Nxb5", think: 1100, eval: { cp: 346 }, note: "!" },
  { san: "cxb5", think: 300, eval: { cp: 537 } },
  { san: "Bxb5+", think: 300, eval: { cp: 539 } },
  { san: "Nbd7", think: 400, eval: { cp: 560 } },
  { san: "O-O-O", think: 500, eval: { cp: 539 } },
  { san: "Rd8", think: 500, eval: { cp: 628 } },
  { san: "Rxd7", think: 900, eval: { cp: 564 }, note: "!" },
  { san: "Rxd7", think: 300, eval: { cp: 606 } },
  { san: "Rd1", think: 300, eval: { cp: 1088 } },
  { san: "Qe6", think: 600, eval: { cp: 3642 } },
  { san: "Bxd7+", think: 400, eval: { cp: 4466 } },
  { san: "Nxd7", think: 300, eval: { mate: 2 } },
  { san: "Qb8+", think: 1300, eval: { mate: 1 }, note: "!!" },
  { san: "Nxb8", think: 500, eval: { mate: 1 } },
  { san: "Rd8#", think: 700, eval: { mate: 0 } },
];
