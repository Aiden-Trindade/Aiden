export type Project = {
  // Used for the project's page, at /work/<slug>
  slug: string;
  title: string;
  role: string;
  // A short handwritten-style note shown in the margin
  note?: string;
  blurb: string;
  tags: string[];
  live?: string;
  source?: string;
  // Featured projects get the full write-up, the rest are listed briefly
  featured?: boolean;
  // The longer write-up on the project's own page
  sections: { heading: string; text: string }[];
};

export const projects: Project[] = [
  {
    slug: "papers",
    title: "Papers",
    featured: true,
    role: "Frontend developer, CodeChef-VIT",
    note: "1500+ papers and counting",
    blurb:
      "Every previous-year CAT and FAT paper at VIT, in one place, free and with no login. Students search by exam, slot, year and subject, and download papers and answer keys in seconds. I work on the interface and help fix bugs across the app.",
    // TODO: add the user count once confirmed, e.g. "1500+ papers, N+ students"
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    live: "https://papers.codechefvit.com",
    source: "https://github.com/CodeChefVIT/papers-codechef",
    sections: [
      {
        heading: "The problem",
        text: "When exams come around, every VIT student goes looking for the same thing: previous-year papers. Papers puts every CAT and FAT paper in one place, free, with no login in the way.",
      },
      {
        heading: "What it does",
        text: "Students search by exam, slot, year and subject, then download papers and answer keys in seconds. The collection has passed 1500 papers and keeps growing.",
      },
      {
        heading: "My part",
        text: "I'm a frontend developer on the project at CodeChef-VIT. I work on the interface and help fix bugs across the app, on a site real students depend on at the worst possible time of the semester.",
      },
    ],
  },
  {
    slug: "ffcs-inator",
    title: "FFCS-inator",
    featured: true,
    role: "Frontend developer, CodeChef-VIT",
    note: "11K+ students and counting",
    blurb:
      "Every semester, VIT students fight FFCS for a timetable without clashes. FFCS-inator ends the fight: pick your favourite faculties, rank them, and get every clash-free timetable in seconds. I worked on the v2.0.1 UX revamp, which reached 11K+ active users and 45K+ views.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    live: "https://ffcs.codechefvit.com",
    source: "https://github.com/CodeChefVIT/ffcs",
    sections: [
      {
        heading: "The problem",
        text: "FFCS is how VIT students build their timetables, and it's a race. Courses, slots and faculties all have to line up without a single clash, and the seats you want fill up fast. Most students plan it by hand, in spreadsheets, the night before.",
      },
      {
        heading: "What it does",
        text: "You pick your courses and your favourite faculties, ranked in order. FFCS-inator generates every clash-free timetable, sorted by your priorities, so you walk into FFCS with a plan and a backup.",
      },
      {
        heading: "The revamp",
        text: "Version 2.0.1 was a full UX revamp, built by a team of designers, developers and maintainers at CodeChef-VIT just before FFCS opened. It reached 11K+ active users and 45K+ views.",
      },
      {
        heading: "My part",
        text: "I turned the new design into code for the main screen. Course selection and Your Courses now sit side by side on wide screens, with restyled panels, rows and buttons, and one layout replaced two. I also fixed a bug where embedded lab courses showed up as \"undefined\". Next up is a pencil button to edit a course you've already added.",
      },
    ],
  },
  {
    slug: "pretty-sure",
    title: "Pretty Sure",
    featured: true,
    role: "Personal project",
    note: "turns out I'm not",
    blurb:
      "\"Pretty sure\" isn't a number, so this app makes it one. Make a call, say how sure you are, stake play-money chips on it and settle it later. Over time it shows whether your 80% sure really comes true 80% of the time. You can also open a table with friends and bet on each other's goals.",
    tags: ["React", "Supabase", "PostgreSQL", "PWA"],
    live: "https://pretty-sure-one.vercel.app",
    source: "https://github.com/Aiden-Trindade/Pretty-Sure",
    sections: [
      {
        heading: "The idea",
        text: "Everyone says \"pretty sure\" and nobody checks. Pretty Sure is a prediction journal that keeps score: every call gets a confidence, and once it's settled, a calibration chart shows how honest your gut has been.",
      },
      {
        heading: "What it does",
        text: "You make a call, stake chips on it and settle it later. Tables let friends bet on each other's goals, like runs, deadlines and matches, with live updates and betting that closes on time. Parlays chain calls together, for people who like being wrong in bulk. It signs in with Google, syncs through Supabase and installs as an app.",
      },
      {
        heading: "The look",
        text: "It's designed like a real card table, not a dashboard: green felt, cream cards, red and black ink, two fonts and one accent colour. I wrote the design system down before building screens, so every new one looks like it came out of the same deck.",
      },
    ],
  },
  {
    slug: "pet",
    title: "PET",
    featured: true,
    role: "Personal project",
    note: "zero frameworks, on purpose",
    blurb:
      "A personal expense tracker that shows you exactly where the money went. Donut chart, weekly bars and a 12-week spending heatmap, all drawn by hand in plain JavaScript. Install it like an app and it works offline.",
    tags: ["JavaScript", "CSS", "PWA"],
    live: "https://aiden-trindade.github.io/No-More-Vanilla-JS/",
    source: "https://github.com/Aiden-Trindade/No-More-Vanilla-JS",
    sections: [
      {
        heading: "The idea",
        text: "PET is a personal expense tracker that shows you exactly where the money went.",
      },
      {
        heading: "What it does",
        text: "It has a donut chart, weekly bars and a 12-week spending heatmap. It installs like an app and works offline.",
      },
      {
        heading: "Why no frameworks",
        text: "Every chart is drawn by hand in plain JavaScript, with zero frameworks, on purpose.",
      },
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "C++", "C"] },
  { group: "Web", items: ["Next.js", "React", "Tailwind CSS", "HTML", "CSS", "PWAs"] },
  { group: "Data", items: ["MySQL", "PostgreSQL", "MongoDB"] },
  { group: "Spoken", items: ["English", "French", "Hindi"] },
];

export type Chapter = {
  when: string;
  title: string;
  paragraphs: string[];
  // Small handwritten highlights next to the chapter
  notes: string[];
  // An optional polaroid shown above the notes
  photo?: { src: string; caption: string };
};

// The About and Achievements content, told in three chapters
export const story: Chapter[] = [
  {
    when: "Before code",
    title: "Thinking a few moves ahead",
    paragraphs: [
      "Chess is where I learned to sit with a hard problem, work through the lines and live with the result. I took that all the way to a 2200 peak on Chess.com.",
      "School gave me the rest. Debate taught me to explain an idea under pressure, and I won state-level competitions doing it. Spelling bees taught me to sweat the details, all the way to 11th place globally at the International MaRRs Spell Bee.",
    ],
    notes: ["2200 peak", "11th in the world", "97.5% in Grade 10"],
    photo: { src: "/profile.jpeg", caption: "that's me" },
  },
  {
    when: "VIT Vellore",
    title: "Learning to build",
    paragraphs: [
      "At VIT I started building things for real. I learned the web with plain HTML, CSS and JavaScript, and shipped PET without a single framework.",
      "Then I picked up React, Next.js and TypeScript, and learned to work with real databases in MySQL, PostgreSQL and MongoDB.",
      "Then came my first taste of real industry work: an AI internship at Yash Tech in Pune. We built a model that negotiates prices between vendors and sellers, weighing things a spreadsheet can't, like years of working together, and speeds up enterprise resource planning on SAP.",
    ],
    notes: ["8.5 GPA, semester 1"],
  },
  {
    when: "Right now",
    title: "Building things people use",
    paragraphs: [
      "Today I'm a frontend developer at CodeChef-VIT, on Papers, the site VIT students open when exams come around, and FFCS-inator, the one they open to build their timetables. Real users, real bugs, real deadlines.",
      "Next, I'm looking for an internship in frontend development, somewhere people care about getting the details right.",
    ],
    notes: ["open to internships"],
  },
];

export const links = {
  email: "ajef1479@gmail.com",
  github: "https://github.com/Aiden-Trindade",
  githubUser: "Aiden-Trindade",
  linkedin: "https://www.linkedin.com/in/aiden-trindade-10a6a9375",
};
