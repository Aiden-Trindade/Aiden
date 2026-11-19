// A part of a screenshot, as fractions of its width and height: [left, top, width, height]
export type Region = [x: number, y: number, w: number, h: number];

export type Project = {
  // Used for the project's page, at /work/<slug>
  slug: string;
  title: string;
  // The sentence under the name on the project's page. Without one, the summary is used
  headline?: string;
  // What I did on it, in a few words
  role: string;
  // One plain sentence: what it is
  summary: string;
  // One plain sentence: what I did on it (the caption under its band on /work).
  // Left out until it's written; the band then stands on its name alone
  contribution?: string;
  // Its band on /work: a 160px strip of the screenshot at 1:1, cut once into
  // /public/work/band. `x` is where narrow screens look along it (0 left, 1 right) and
  // `edge` fills the band past 1440px, matching the strip's own edge colour
  band: { x: number; edge: string };
  // The single number or fact that shows it's real
  proof: string;
  tags: string[];
  // Screenshot in /public/work, shown on hover in the list and at the top of the project page
  image?: string;
  live?: string;
  source?: string;
  // The longer write-up on the project's own page. While a section is being read, the
  // screenshot frames its `focus`: real interface that the text describes, never an empty
  // state. `focusLabel` marks a section about my own work and captions the frame
  sections: { heading: string; text: string; focus?: Region; focusLabel?: string }[];
};

export const projects: Project[] = [
  {
    slug: "ffcs-inator",
    title: "FFCS-inator",
    headline: "Clash-free timetables for 11K+ VIT students.",
    role: "Frontend, CodeChef-VIT",
    summary: "Builds clash-free VIT timetables from the faculties you pick.",
    contribution: "Built the course selection screen for v2.0.1 and fixed embedded labs showing up as \"undefined\".",
    band: { x: 0.5, edge: "#cee5e5" },
    proof: "11K+ active users",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/work/ffcs-inator.png",
    live: "https://ffcs.codechefvit.com",
    source: "https://github.com/CodeChefVIT/ffcs",
    sections: [
      {
        heading: "The problem",
        text: "Every semester, VIT students build their timetables in FFCS. Courses, slots and faculties all have to line up without a clash, and the seats people want fill up in minutes. Most students plan it by hand the night before.",
      },
      {
        heading: "What it does",
        text: "You pick your courses and rank the faculties you want. FFCS-inator generates every timetable that works, sorted by your preferences, so you go into registration with a plan and a backup.",
        // The course search panel
        focus: [0.022, 0.853, 0.481, 0.147],
      },
      {
        heading: "What I did",
        text: "For the v2.0.1 redesign, I built the main course selection screen: course search and your selected courses now sit side by side on wide screens, replacing two separate layouts. I also fixed a bug where embedded lab courses showed up as \"undefined\". The release reached 11K+ active users and 45K+ views.",
        // Both panels of the course selection screen
        focus: [0.022, 0.853, 0.958, 0.147],
        focusLabel: "Course search and your courses, side by side",
      },
    ],
  },
  {
    slug: "papers",
    title: "Papers",
    headline: "1500+ past VIT papers, free and without a login.",
    role: "Frontend, CodeChef-VIT",
    summary: "Every previous-year VIT CAT and FAT paper, free and without a login.",
    band: { x: 0, edge: "linear-gradient(#130e1f 80px, #070114 80px)" },
    proof: "1500+ papers",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/work/papers.png",
    live: "https://papers.codechefvit.com",
    source: "https://github.com/CodeChefVIT/papers-codechef",
    sections: [
      {
        heading: "The problem",
        text: "Before exams, every VIT student goes looking for previous-year papers, usually through group chats and seniors' drives.",
      },
      {
        heading: "What it does",
        text: "Papers collects them in one place. You search by subject, filter by exam, slot and year, and download the paper or its answer key. There's no login, and the collection has passed 1500 papers.",
        // The subject search
        focus: [0.3, 0.244, 0.4, 0.056],
      },
      {
        heading: "What I did",
        text: "I work on the interface and fix bugs across the app, on a site that gets most of its traffic in the week before exams.",
      },
    ],
  },
  {
    slug: "pretty-sure",
    title: "Pretty Sure",
    role: "Personal project",
    summary: "A prediction journal that checks whether your \"80% sure\" comes true 80% of the time.",
    contribution: "All of it: the design system, the React app and its Supabase sync.",
    band: { x: 0.4, edge: "#0f4a33" },
    proof: "Calibration tracking, live tables with friends",
    tags: ["React", "Supabase", "PostgreSQL", "PWA"],
    image: "/work/pretty-sure.png",
    live: "https://pretty-sure-one.vercel.app",
    source: "https://github.com/Aiden-Trindade/Pretty-Sure",
    sections: [
      {
        heading: "The idea",
        text: "People say \"pretty sure\" all the time and never check. Pretty Sure makes you put a number on it, then keeps score.",
      },
      {
        heading: "What it does",
        text: "You make a call, set your confidence, stake play-money chips and settle it later. A calibration chart shows how your confidence compares with what actually happened. Tables let friends bet on each other's goals with live updates, and parlays chain several calls together. It signs in with Google, syncs through Supabase and installs as an app.",
      },
      {
        heading: "The design",
        text: "It looks like a card table: green felt, cream cards, red and black ink. I wrote the design system down first, with tokens for colour, type, spacing and motion, so new screens stay consistent.",
        // The header: the logo card, the fanned cards of the nav and the chip count
        focus: [0.303, 0.02, 0.396, 0.111],
        focusLabel: "Cream cards on green felt, from the design system",
      },
    ],
  },
  {
    slug: "pet",
    title: "PET",
    role: "Personal project",
    summary: "An expense tracker with charts drawn by hand in plain JavaScript.",
    contribution: "All of it, with no framework: every chart is plain JavaScript and SVG.",
    band: { x: 0.5, edge: "#000" },
    proof: "No frameworks, works offline",
    tags: ["JavaScript", "CSS", "PWA"],
    image: "/work/pet.png",
    live: "https://aiden-trindade.github.io/No-More-Vanilla-JS/",
    source: "https://github.com/Aiden-Trindade/No-More-Vanilla-JS",
    sections: [
      {
        heading: "What it does",
        text: "PET tracks what you spend and shows where it went: a category donut chart, weekly bars and a 12-week heatmap.",
      },
      {
        heading: "Why no frameworks",
        text: "I built it to learn how the browser actually works, so every chart is drawn with plain JavaScript and SVG, with no libraries. It installs as an app and works offline.",
        // The install prompt
        focus: [0.37, 0.112, 0.26, 0.059],
        focusLabel: "Installs as an app and works offline",
      },
    ],
  },
];

export type Job = {
  org: string;
  role: string;
  place: string;
  // When, if it's a finished stint. Ongoing roles leave it out
  when?: string;
  summary: string;
  points: string[];
};

export const experience: Job[] = [
  {
    org: "CodeChef-VIT",
    role: "Frontend developer",
    place: "VIT Vellore",
    summary: "I work on two of the club's tools for VIT students.",
    points: [
      "Built the course selection layout for the FFCS-inator v2.0.1 redesign, used by 11K+ students.",
      "Build interface and fix bugs on Papers, an archive of 1500+ exam papers.",
    ],
  },
  {
    org: "Yash Technologies",
    role: "AI intern",
    place: "Pune",
    when: "June to July",
    summary: "Worked on an AI model that negotiates prices between buyers and vendors.",
    points: [
      "The model weighs context beyond the quote, such as how long two companies have worked together.",
      "Agreed prices feed into SAP-based ERP workflows, cutting the back-and-forth in procurement.",
    ],
  },
];

// Skills in the order the About sentence tells them; each run ends on the projects that
// show it (slugs). A skill moves out of `moreSkills` once a project here shows it
export const skills: { items: string[]; shownIn: string[] }[] = [
  { items: ["HTML", "CSS", "JavaScript", "PWAs"], shownIn: ["pet"] },
  { items: ["React", "Supabase", "PostgreSQL"], shownIn: ["pretty-sure"] },
  { items: ["TypeScript", "Next.js", "Tailwind CSS"], shownIn: ["ffcs-inator", "papers"] },
];

// Skills with no project on the site yet
export const moreSkills = ["Python", "C++", "C", "MySQL", "MongoDB"];

export const links = {
  email: "ajef1479@gmail.com",
  github: "https://github.com/Aiden-Trindade",
  githubUser: "Aiden-Trindade",
  linkedin: "https://www.linkedin.com/in/aiden-trindade-10a6a9375",
};
