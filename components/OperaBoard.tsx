"use client";

import { Chess, type Move, type Square } from "chess.js";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { applyMove, dropTaken, piecesFrom, squareAt, squareXY, type Piece } from "@/lib/chess/board";
import { announceEval, OPERA, START_EVAL } from "@/lib/chess/opera";
import { PIECE_SVG } from "@/lib/chess/pieces";

// Replays the Opera Game, Morphy against the Duke and the Count in 1858, move by move.
// It's a replay only: the board can be paused and watched again, not played on. While
// it's on screen, the page's eval bar follows the game.

type Mode = "replay" | "over";

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  if (signal.aborted) {
    reject(signal.reason);
    return promise;
  }
  const t = setTimeout(resolve, ms);
  signal.addEventListener(
    "abort",
    () => {
      clearTimeout(t);
      reject(signal.reason);
    },
    { once: true },
  );
  return promise;
}

// Top-left to bottom-right, the order the squares are drawn in
const SQUARES: Square[] = Array.from({ length: 64 }, (_, i) => squareAt(i % 8, Math.floor(i / 8))!);

export default function OperaBoard() {
  // The game is one mutable chess.js instance for the component's lifetime
  const [game] = useState(() => new Chess());
  const frameRef = useRef<HTMLDivElement>(null);
  const replayAbort = useRef<AbortController | null>(null);
  const inView = useRef(false);
  const resetTimer = useRef(0);

  const [pieces, setPieces] = useState<Piece[]>(() => piecesFrom(game));
  const [mode, setMode] = useState<Mode>("replay");
  const [history, setHistory] = useState<string[]>([]);
  const [last, setLast] = useState<{ from: Square; to: Square } | null>(null);
  // The square of the piece that's in the air while it moves
  const [lifted, setLifted] = useState<Square | null>(null);
  const [moveMs, setMoveMs] = useState(0);
  // The arrow drawn while Morphy considers a sacrifice
  const [arrow, setArrow] = useState<{ from: Square; to: Square; key: number } | null>(null);
  const [status, setStatus] = useState("");
  // Paused by the visitor. Scrolling away also stops the replay, but that isn't a pause:
  // it carries on when the board is back
  const [paused, setPaused] = useState(false);
  // Pieces fade out and back in around a restart, instead of sliding home over each other
  const [resetting, setResetting] = useState(false);

  const turn = game.turn();
  const inCheckSquare = game.inCheck() ? (pieces.find((p) => p.code === `${turn}K`)?.square ?? null) : null;

  // The engine's view of the position on the board, for the eval bar
  function syncEval() {
    if (!inView.current) return;
    const ply = game.history().length;
    announceEval(ply === 0 ? START_EVAL : OPERA[ply - 1].eval);
  }

  function show(move: Move) {
    setPieces((ps) => applyMove(ps, move));
    setHistory(game.history());
    setLast({ from: move.from, to: move.to });
    syncEval();
  }

  // One move: a pause to think, then the piece lifts and slides, taking longer for
  // longer trips. Before a sacrifice the move is drawn as an arrow while he thinks
  async function playMove(i: number, signal: AbortSignal) {
    const { san, think, note } = OPERA[i];
    if (note) {
      const planned = game.moves({ verbose: true }).find((m) => m.san === san)!;
      setArrow({ from: planned.from, to: planned.to, key: i });
    }
    try {
      await sleep(think, signal);
    } finally {
      setArrow(null);
    }
    const move = game.move(san);
    const a = squareXY(move.from);
    const b = squareXY(move.to);
    const ms = Math.round(260 + Math.hypot(b.x - a.x, b.y - a.y) * 70);
    setMoveMs(ms);
    setLifted(move.to);
    show(move);
    try {
      await sleep(ms, signal);
    } finally {
      setLifted(null);
      setPieces(dropTaken);
    }
  }

  // Plays the game from wherever it is
  async function runReplay(signal: AbortSignal) {
    await sleep(400, signal);
    for (let i = game.history().length; i < OPERA.length; i++) {
      await playMove(i, signal);
      await sleep(260, signal);
    }
    setMode("over");
    setStatus("Checkmate. Morphy wins the Opera Game in 17 moves.");
  }

  function startReplay() {
    replayAbort.current?.abort("restart");
    const ac = new AbortController();
    replayAbort.current = ac;
    runReplay(ac.signal).catch(() => {});
  }

  function stopReplay() {
    replayAbort.current?.abort("stop");
    setLifted(null);
    setArrow(null);
  }

  // Without motion, show the finished game instead of playing it
  const showFinished = useEffectEvent(() => {
    if (mode !== "replay" || game.history().length > 0) return;
    let ps = piecesFrom(game);
    let lastMove: Move | null = null;
    for (const step of OPERA) {
      lastMove = game.move(step.san);
      ps = applyMove(ps, lastMove);
    }
    setPieces(dropTaken(ps));
    setHistory(game.history());
    if (lastMove) setLast({ from: lastMove.from, to: lastMove.to });
    setMode("over");
    syncEval();
  });
  // On screen: the eval bar follows the board, and the replay starts or carries on (or,
  // without motion, the finished game shows)
  const onVisible = useEffectEvent((reduce: boolean) => {
    syncEval();
    if (reduce) showFinished();
    else if (mode === "replay" && !paused && (!replayAbort.current || replayAbort.current.signal.aborted)) startReplay();
  });
  const onHidden = useEffectEvent(() => {
    announceEval(null);
    stopReplay();
  });

  // The replay runs only while most of the board is on screen
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) onVisible(reduce);
        else onHidden();
      },
      { threshold: 0.6 },
    );
    if (frameRef.current) io.observe(frameRef.current);
    return () => {
      io.disconnect();
      clearTimeout(resetTimer.current);
      replayAbort.current?.abort("unmount");
      replayAbort.current = null;
      if (inView.current) announceEval(null);
    };
  }, []);

  function togglePause() {
    if (paused) {
      setPaused(false);
      startReplay();
    } else {
      setPaused(true);
      stopReplay();
    }
  }

  function watchAgain() {
    stopReplay();
    setResetting(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      game.reset();
      setMoveMs(0);
      setPieces(piecesFrom(game));
      setHistory([]);
      setLast(null);
      setMode("replay");
      setStatus("");
      setResetting(false);
      syncEval();
      // Off screen, the replay starts when the board comes back into view
      if (inView.current) startReplay();
    }, 180);
  }

  const sheet = history.map((san, i) => san + (OPERA[i]?.note ?? ""));
  const moveRows: [string, string?][] = [];
  for (let i = 0; i < sheet.length; i += 2) moveRows.push([sheet[i], sheet[i + 1]]);
  const mated = mode === "over" && game.isCheckmate();

  return (
    <div className="stage">
      <div className="board-frame" ref={frameRef}>
        {/* The scoresheet carries the game for screen readers; the board is a picture of it */}
        <div className="board" aria-hidden="true" style={{ "--move-ms": `${moveMs}ms` } as React.CSSProperties}>
          {SQUARES.map((sq) => (
            <div
              key={sq}
              className="sq"
              data-dark={(sq.charCodeAt(0) - 97 + Number(sq[1])) % 2 === 1 || undefined}
              data-last={last && (last.from === sq || last.to === sq) ? "" : undefined}
              data-check={inCheckSquare === sq || undefined}
            >
              {sq[1] === "1" && <span className="coord file">{sq[0]}</span>}
              {sq[0] === "a" && <span className="coord rank">{sq[1]}</span>}
            </div>
          ))}

          {arrow && <MoveArrow key={arrow.key} from={arrow.from} to={arrow.to} />}

          <div className="pieces" data-resetting={resetting || undefined}>
            {pieces.map((p) => {
              const { x, y } = squareXY(p.square);
              return (
                <div
                  key={p.id}
                  className="piece"
                  data-lifted={(lifted === p.square && !p.taken) || undefined}
                  data-taken={p.taken || undefined}
                  data-fallen={(mated && p.code === "bK") || undefined}
                  style={{ translate: `${x * 100}% ${y * 100}%` }}
                >
                  <svg viewBox="0 0 45 45" dangerouslySetInnerHTML={{ __html: PIECE_SVG[p.code] }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="scoresheet" aria-label="Moves">
        <p className="sheet-head">
          <span>Paris, 1858</span>
          <span>Morphy vs Brunswick &amp; Isouard</span>
        </p>
        <ol className="sheet-moves">
          {moveRows.map(([w, b], i) => (
            <li key={i}>
              <span className="sheet-w">{w}</span>
              <span className="sheet-b">{b ?? ""}</span>
            </li>
          ))}
          {mated && <li className="sheet-result">1–0</li>}
        </ol>
        <div className="sheet-controls">
          {mode === "replay" ? (
            <button type="button" onClick={togglePause}>
              {paused ? "Resume" : "Pause"}
            </button>
          ) : (
            <button type="button" onClick={watchAgain}>
              Watch again
            </button>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
      </aside>
    </div>
  );
}

// An analysis arrow from one square's centre to another's, in board units (8 × 8).
// The shaft draws itself, then the head lands
function MoveArrow({ from, to }: { from: Square; to: Square }) {
  const a = squareXY(from);
  const b = squareXY(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const head = 0.42;
  const tip = { x: b.x + 0.5 - ux * 0.22, y: b.y + 0.5 - uy * 0.22 };
  const base = { x: tip.x - ux * head, y: tip.y - uy * head };
  const half = 0.27;
  return (
    <svg className="move-arrow" viewBox="0 0 8 8">
      <line
        x1={a.x + 0.5 + ux * 0.2}
        y1={a.y + 0.5 + uy * 0.2}
        x2={base.x}
        y2={base.y}
        pathLength={1}
      />
      <polygon
        points={`${tip.x},${tip.y} ${base.x - uy * half},${base.y + ux * half} ${base.x + uy * half},${base.y - ux * half}`}
      />
    </svg>
  );
}
