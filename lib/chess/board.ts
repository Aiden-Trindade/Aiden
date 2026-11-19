import { Chess, type Move, type Square } from "chess.js";

// The board keeps every piece as a stable object with an id, so React can keep
// the same element for a piece as it moves and CSS can animate it between squares.

export type Piece = {
  id: string;
  // Colour + type, like "wN" or "bQ". Matches the keys in PIECE_SVG
  code: string;
  square: Square;
  // Captured by the latest move: it stays on its square until the capturing piece lands
  taken?: boolean;
};

const FILES = "abcdefgh";

export function squareXY(square: Square, flipped = false) {
  const file = FILES.indexOf(square[0]);
  const rank = Number(square[1]) - 1;
  // x and y in squares from the top-left corner of the board
  return flipped ? { x: 7 - file, y: rank } : { x: file, y: 7 - rank };
}

export function squareAt(x: number, y: number, flipped = false): Square | null {
  if (x < 0 || x > 7 || y < 0 || y > 7) return null;
  const file = flipped ? 7 - x : x;
  const rank = flipped ? y : 7 - y;
  return `${FILES[file]}${rank + 1}` as Square;
}

export function piecesFrom(game: Chess): Piece[] {
  const pieces: Piece[] = [];
  game.board().forEach((row) =>
    row.forEach((cell) => {
      if (!cell) return;
      const code = `${cell.color}${cell.type.toUpperCase()}`;
      // The starting square makes a readable, unique id
      pieces.push({ id: `${code}-${cell.square}`, code, square: cell.square });
    }),
  );
  return pieces;
}

// Applies a move to the piece list, returning a new list. The captured piece is kept,
// marked as taken, so it can fade as the capturing piece arrives; the next move (or
// dropTaken) clears it. Castling moves the rook too, and en passant takes the pawn
// beside the target square.
export function applyMove(pieces: Piece[], move: Move): Piece[] {
  let capturedSquare: string | null = move.captured ? move.to : null;
  if (move.flags.includes("e")) capturedSquare = `${move.to[0]}${move.from[1]}`;

  const rank = move.color === "w" ? "1" : "8";
  let rook: { from: string; to: string } | null = null;
  if (move.flags.includes("k")) rook = { from: `h${rank}`, to: `f${rank}` };
  if (move.flags.includes("q")) rook = { from: `a${rank}`, to: `d${rank}` };

  return dropTaken(pieces).map((p) => {
    if (p.square === capturedSquare) return { ...p, taken: true };
    if (p.square === move.from) {
      const code = move.promotion ? `${move.color}${move.promotion.toUpperCase()}` : p.code;
      return { ...p, code, square: move.to };
    }
    if (rook && p.square === rook.from) return { ...p, square: rook.to as Square };
    return p;
  });
}

export function dropTaken(pieces: Piece[]): Piece[] {
  return pieces.some((p) => p.taken) ? pieces.filter((p) => !p.taken) : pieces;
}
