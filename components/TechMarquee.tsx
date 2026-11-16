import {
  siC,
  siCplusplus,
  siCss,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMongodb,
  siMysql,
  siNextdotjs,
  siPostgresql,
  siPwa,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

// Two rows of tech logos drifting in opposite directions. Each logo picks up
// its brand colour on hover, and hovering a row pauses it.

type Tech = { icon: SimpleIcon; label?: string };

const ROWS: Tech[][] = [
  [
    { icon: siPython },
    { icon: siJavascript },
    { icon: siTypescript },
    { icon: siCplusplus },
    { icon: siC },
    { icon: siNextdotjs },
    { icon: siReact },
    { icon: siTailwindcss },
  ],
  [
    { icon: siHtml5, label: "HTML" },
    { icon: siCss },
    { icon: siMysql },
    { icon: siPostgresql },
    { icon: siMongodb },
    { icon: siGit },
    { icon: siGithub },
    { icon: siPwa, label: "PWAs" },
  ],
];

// Some brand colours are near-black and would disappear on the dark theme
function brandColour(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.25 ? "var(--text)" : `#${hex}`;
}

function Item({ tech }: { tech: Tech }) {
  return (
    <li className="tech" style={{ "--brand": brandColour(tech.icon.hex) } as React.CSSProperties}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={tech.icon.path} />
      </svg>
      <span>{tech.label ?? tech.icon.title}</span>
    </li>
  );
}

export default function TechMarquee() {
  return (
    <div className="marquee" aria-label="Technologies I use">
      {ROWS.map((row, i) => (
        <div className={`marquee-row ${i % 2 ? "reverse" : ""}`.trim()} key={i}>
          {/* The list is drawn twice so the loop is seamless; the copy is hidden from screen readers */}
          <ul className="marquee-track">
            {row.map((t) => (
              <Item tech={t} key={t.icon.slug} />
            ))}
          </ul>
          <ul className="marquee-track" aria-hidden="true">
            {row.map((t) => (
              <Item tech={t} key={t.icon.slug} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
