"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// The About sentence with its fine print. Four phrases open one level of evidence each,
// and the sentence parts to let it in: every word is measured before and after, words that
// kept their line slide over, lines that only moved down slide together, words that changed
// line fade in where they landed, and everything below the sentence slides by the change in
// height in one move. Nothing animates size: the layout changes at the click, the motion is
// transforms and opacity on stand-in copies of the words, which are removed when it ends.

// Hides every fold, except the one the URL points at, and marks the block ready. Runs as an
// inline script while the page is parsed (so the folds are shut before the first paint) and
// again from a layout effect when the page arrives by client-side navigation. It is
// serialised with toString(), so it must not use anything outside its own body.
function init(root: HTMLElement | null) {
  if (!root || root.hasAttribute("data-ready")) return;
  const find = "onbeforematch" in HTMLElement.prototype;
  const hash = location.hash.slice(1);
  root.querySelectorAll(".fp-fine").forEach(function (fold) {
    if (fold.id === hash) document.getElementById(hash + "-trigger")?.setAttribute("aria-expanded", "true");
    else fold.setAttribute("hidden", find ? "until-found" : "");
  });
  root.setAttribute("data-ready", "");
}

const INIT_SCRIPT = `(${init.toString()})(document.getElementById("fp"))`;

const OPEN_MS = 380;
const CLOSE_MS = 300;
const NEAR = 0.5;

type Box = { x: number; y: number; h: number };
// `join`: continues the previous token with no space between (the half after a hyphen)
type Token = { node: Text; start: number; end: number; join: boolean };
type Op = { anims: Animation[]; now: () => void };

// One phrase of the sentence and its fine print. `hidden` is never a React prop: React writes
// it as a boolean, which would turn "until-found" into a plain, unsearchable hidden
export function Fold({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <>
      <span
        id={`${id}-trigger`}
        className="fp-trigger"
        role="button"
        tabIndex={0}
        aria-expanded={false}
        aria-controls={id}
        suppressHydrationWarning
      >
        {label}
      </span>
      <span id={id} className="fp-fine" tabIndex={-1} suppressHydrationWarning>
        {" ("}
        {children})
      </span>
    </>
  );
}

export default function FinePrint({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleAllRef = useRef<() => void>(() => {});
  const [allOpen, setAllOpen] = useState(false);

  useLayoutEffect(() => {
    init(rootRef.current);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const folds = createFolds(root, setAllOpen);
    toggleAllRef.current = folds.toggleAll;
    return folds.destroy;
  }, []);

  return (
    <div id="fp" className="fp" ref={rootRef} suppressHydrationWarning>
      <button type="button" className="fp-all" onClick={() => toggleAllRef.current()}>
        {allOpen ? "Fold it up" : "Read it all"}
      </button>
      <p className="fp-text">{children}</p>
      <div className="fp-ghosts" aria-hidden="true" />
      {/* Executes from the server HTML only. On the client it is rendered as an inert data
          block, so React doesn't warn about a script it would never run */}
      <script
        type={typeof window === "undefined" ? undefined : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }}
      />
    </div>
  );
}

function createFolds(root: HTMLElement, onChange: (allOpen: boolean) => void) {
  const text = root.querySelector<HTMLElement>(".fp-text")!;
  const layer = root.querySelector<HTMLElement>(".fp-ghosts")!;
  const folds = Array.from(root.querySelectorAll<HTMLElement>(".fp-fine"));
  const triggers = new Map(folds.map((fold) => [fold, document.getElementById(`${fold.id}-trigger`)!]));
  const find = "onbeforematch" in HTMLElement.prototype;
  const ease =
    getComputedStyle(document.documentElement).getPropertyValue("--ease-glide").trim() ||
    "cubic-bezier(0.32, 0.72, 0, 1)";
  const range = document.createRange();
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let op: Op | null = null;
  let spaceOn: Element | null = null;

  const isOpen = (fold: HTMLElement) => triggers.get(fold)!.getAttribute("aria-expanded") === "true";
  const report = () => onChange(folds.every(isOpen));

  function reveal(fold: HTMLElement) {
    fold.removeAttribute("hidden");
    triggers.get(fold)!.setAttribute("aria-expanded", "true");
  }

  function conceal(fold: HTMLElement) {
    fold.setAttribute("hidden", find ? "until-found" : "");
  }

  // Runs `anims` as the current step. `now` completes the step instantly (a click arriving
  // mid-animation finishes it first); `then` runs instead when the step ends by itself, which
  // includes an animation being cancelled from outside, so the stand-ins never get stuck.
  function run(anims: Animation[], now: () => void, then: () => void = now) {
    const step: Op = { anims, now };
    op = step;
    Promise.allSettled(anims.map((a) => a.finished)).then(() => {
      if (op !== step) return;
      op = null;
      then();
    });
  }

  function settle() {
    const step = op;
    if (!step) return;
    op = null;
    for (const a of step.anims) a.finish();
    step.now();
  }

  function tokens() {
    const out: Token[] = [];
    const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
    // A line can break after a hyphen, so "CodeChef-" and "VIT’s" are measured separately
    const word = /[^\s-]*-+|[^\s-]+/g;
    for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
      let end = -1;
      for (const m of node.data.matchAll(word)) {
        out.push({ node, start: m.index, end: m.index + m[0].length, join: m.index === end });
        end = m.index + m[0].length;
      }
    }
    return out;
  }

  function measure(list: Token[]) {
    const base = root.getBoundingClientRect();
    return list.map((t): Box | null => {
      if (t.node.parentElement!.closest("[hidden]")) return null;
      range.setStart(t.node, t.start);
      range.setEnd(t.node, t.end);
      const r = range.getClientRects()[0];
      return r ? { x: r.left - base.left, y: r.top - base.top, h: r.height } : null;
    });
  }

  // Line number of each word: in left-to-right text a new line starts wherever x goes back
  function lines(boxes: (Box | null)[]) {
    let line = 0;
    let prev = -Infinity;
    return boxes.map((b) => {
      if (!b) return -1;
      if (b.x < prev - 1) line++;
      prev = b.x;
      return line;
    });
  }

  // The stand-in copies the words, and the decoration of the nearest decorated ancestor
  // (the dotted underline of a phrase, the underline of a link)
  const looks = new Map<Element, Partial<CSSStyleDeclaration>>();
  function look(el: Element) {
    let found = looks.get(el);
    if (found) return found;
    const s = getComputedStyle(el);
    found = {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      fontStyle: s.fontStyle,
      fontVariationSettings: s.fontVariationSettings,
      letterSpacing: s.letterSpacing,
      color: s.color,
    };
    for (let d: Element | null = el; d && d !== text.parentElement; d = d.parentElement) {
      const ds = getComputedStyle(d);
      if (ds.textDecorationLine === "none") continue;
      Object.assign(found, {
        textDecorationLine: ds.textDecorationLine,
        textDecorationStyle: ds.textDecorationStyle,
        textDecorationColor: ds.textDecorationColor,
        textDecorationThickness: ds.textDecorationThickness,
        textUnderlineOffset: ds.textUnderlineOffset,
        textDecorationSkipInk: ds.textDecorationSkipInk,
      });
      break;
    }
    looks.set(el, found);
    return found;
  }

  // Measures every word, applies the change, measures again, then animates stand-ins from
  // the old places to the new ones while the real text is transparent
  function flip(change: () => void, entering: HTMLElement[], duration: number): Animation[] {
    looks.clear();
    const list = tokens();
    const height0 = text.offsetHeight;
    const before = measure(list);
    change();
    const after = measure(list);
    const delta = text.offsetHeight - height0;
    const lineBefore = lines(before);
    const lineAfter = lines(after);

    // A line moved intact if all its words land together on one line that holds nothing else
    const intact = new Map<number, boolean>();
    const members = new Map<number, number[]>();
    list.forEach((_, i) => {
      if (!before[i] || !after[i]) return;
      members.set(lineBefore[i], [...(members.get(lineBefore[i]) ?? []), i]);
    });
    for (const [line, ids] of members) {
      const target = lineAfter[ids[0]];
      const same =
        ids.every((i) => lineAfter[i] === target) &&
        list.every((_, j) => !before[j] || !after[j] || lineAfter[j] !== target || lineBefore[j] === line);
      intact.set(line, same);
    }

    const anims: Animation[] = [];
    const ghosts = document.createDocumentFragment();
    let last: { ghost: HTMLElement; i: number } | null = null;
    list.forEach((t, i) => {
      const a = before[i];
      const b = after[i];
      if (!a || !b) return;
      const word = t.node.data.slice(t.start, t.end);
      // The second half of a hyphenated word that stayed on one line both times rides on the
      // first half's stand-in, so the pair keeps its kerning
      const prev = before[i - 1];
      const prevAfter = after[i - 1];
      if (t.join && last?.i === i - 1 && prev && prevAfter && Math.abs(a.y - prev.y) < NEAR && Math.abs(b.y - prevAfter.y) < NEAR) {
        last.ghost.textContent += word;
        last.i = i;
        return;
      }
      const ghost = document.createElement("span");
      ghost.className = "fp-ghost";
      ghost.textContent = word;
      Object.assign(ghost.style, look(t.node.parentElement!), {
        left: `${b.x}px`,
        top: `${b.y}px`,
        lineHeight: `${b.h}px`,
      });
      ghosts.append(ghost);
      last = { ghost, i };
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if (Math.abs(dx) < NEAR && Math.abs(dy) < NEAR) return;
      if (Math.abs(dy) < NEAR || intact.get(lineBefore[i])) {
        anims.push(ghost.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], { duration, easing: ease }));
      } else {
        anims.push(
          ghost.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 160,
            delay: 120,
            easing: "ease-out",
            fill: "backwards",
          }),
        );
      }
    });
    layer.append(ghosts);
    for (const fold of entering) fold.setAttribute("data-entering", "");
    root.setAttribute("data-flipping", "");

    for (const fold of entering) {
      anims.push(
        fold.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 80, easing: "ease-out", fill: "backwards" }),
      );
    }
    if (Math.abs(delta) >= NEAR) {
      for (const el of below()) {
        anims.push(el.animate([{ translate: `0 ${-delta}px` }, { translate: "0 0" }], { duration, easing: ease }));
      }
    }
    return anims;
  }

  function unflip() {
    layer.replaceChildren();
    root.removeAttribute("data-flipping");
    for (const fold of folds) fold.removeAttribute("data-entering");
  }

  // Everything after the sentence that is on screen and in flow: the rest of <main>, the footer
  function below() {
    const out: HTMLElement[] = [];
    for (let n: Element | null = root; n && n !== document.body; n = n.parentElement) {
      for (let s = n.nextElementSibling; s; s = s.nextElementSibling) {
        if (!(s instanceof HTMLElement)) continue;
        const pos = getComputedStyle(s).position;
        if (pos !== "static" && pos !== "relative") continue;
        if (s.getBoundingClientRect().top < innerHeight) out.push(s);
      }
    }
    return out;
  }

  function open(list: HTMLElement[]) {
    settle();
    const opening = list.filter((fold) => !isOpen(fold));
    if (!opening.length) return;
    if (motion.matches) {
      opening.forEach(reveal);
      const fades = opening.map((fold) => fold.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: "ease-out" }));
      run(fades, () => {});
    } else {
      const anims = flip(() => opening.forEach(reveal), opening, OPEN_MS);
      run(anims, unflip);
    }
    report();
  }

  function close(list: HTMLElement[]) {
    settle();
    const closing = list.filter(isOpen);
    if (!closing.length) return;
    for (const fold of closing) triggers.get(fold)!.setAttribute("aria-expanded", "false");
    const fades = closing.map((fold) =>
      fold.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "ease-in", fill: "forwards" }),
    );
    const shut = () => {
      closing.forEach(conceal);
      for (const a of fades) a.cancel();
    };
    run(fades, shut, () => {
      if (motion.matches) return shut();
      const anims = flip(shut, [], CLOSE_MS);
      run(anims, unflip);
    });
    report();
  }

  function toggle(fold: HTMLElement) {
    if (isOpen(fold)) close([fold]);
    else open([fold]);
  }

  function toggleAll() {
    if (folds.every(isOpen)) close(folds);
    else open(folds);
  }

  const triggerOf = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLElement>(".fp-trigger") : null;
  const foldOf = (trigger: HTMLElement) => folds.find((fold) => triggers.get(fold) === trigger);

  function onClick(e: MouseEvent) {
    const trigger = triggerOf(e.target);
    const fold = trigger && foldOf(trigger);
    if (fold) toggle(fold);
  }

  // role="button" on a span: Enter acts on keydown, Space on keyup, and Space never scrolls
  function onKeyDown(e: KeyboardEvent) {
    const trigger = triggerOf(e.target);
    if (!trigger) return;
    if (e.key === "Enter") {
      e.preventDefault();
      const fold = foldOf(trigger);
      if (fold) toggle(fold);
    } else if (e.key === " ") {
      e.preventDefault();
      spaceOn = trigger;
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key !== " ") return;
    const trigger = triggerOf(e.target);
    const fold = trigger && trigger === spaceOn && foldOf(trigger);
    spaceOn = null;
    if (fold) toggle(fold);
  }

  // Find in page opened a fold: the browser shows it, the phrase just has to agree
  function onBeforeMatch(e: Event) {
    const fold = folds.find((f) => f === e.target);
    if (!fold) return;
    settle();
    triggers.get(fold)!.setAttribute("aria-expanded", "true");
    report();
  }

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  root.addEventListener("keyup", onKeyUp);
  root.addEventListener("beforematch", onBeforeMatch);
  report();

  return {
    toggleAll,
    destroy() {
      settle();
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("keyup", onKeyUp);
      root.removeEventListener("beforematch", onBeforeMatch);
    },
  };
}
