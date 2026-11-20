export type Tool = {
  name: string;
  icon: string;
};

export type ToolGroup = {
  title: string;
  /** domínio de 1 a 5 (quadradinhos em "sobre") */
  level: number;
  items: Tool[];
};

const si = (slug: string) => `https://cdn.simpleicons.org/${slug}/ecf3ef`;

export const toolGroups: ToolGroup[] = [
  {
    title: "linguagens",
    level: 4,
    items: [
      { name: "Python", icon: si("python") },
      { name: "TypeScript", icon: si("typescript") },
      { name: "JavaScript", icon: si("javascript") },
      { name: "SQL", icon: si("mysql") },
      { name: "HTML / CSS", icon: si("html5") },
    ],
  },
  {
    title: "frontend",
    level: 5,
    items: [
      { name: "Angular", icon: si("angular") },
      { name: "RxJS", icon: si("reactivex") },
      { name: "SCSS", icon: si("sass") },
      { name: "Vitest", icon: si("vitest") },
    ],
  },
  {
    title: "backend",
    level: 5,
    items: [
      { name: "Flask", icon: si("flask") },
      { name: "FastAPI", icon: si("fastapi") },
      { name: "SQLAlchemy", icon: si("sqlalchemy") },
      { name: "JWT", icon: si("jsonwebtokens") },
      { name: "Gunicorn", icon: si("gunicorn") },
    ],
  },
  {
    title: "automação",
    level: 5,
    items: [
      { name: "Selenium", icon: si("selenium") },
      { name: "OpenCV", icon: si("opencv") },
      { name: "Tesseract", icon: "/assets/icons/tesseract.svg" },
      { name: "PyAutoGUI", icon: si("python") },
    ],
  },
  {
    title: "dados & ml",
    level: 4,
    items: [
      { name: "MySQL", icon: si("mysql") },
      { name: "SQLite", icon: si("sqlite") },
      { name: "Redis", icon: si("redis") },
      { name: "Scikit-learn", icon: si("scikitlearn") },
      { name: "Pandas", icon: si("pandas") },
    ],
  },
  {
    title: "infra",
    level: 5,
    items: [
      { name: "Docker", icon: si("docker") },
      { name: "Git", icon: si("git") },
      { name: "Linux / Windows", icon: si("linux") },
      { name: "Cursor", icon: si("cursor") },
      { name: "DBeaver", icon: si("dbeaver") },
    ],
  },
];

export const marqueeItems = [
  "Python",
  "Angular",
  "TypeScript",
  "FastAPI",
  "Flask",
  "Selenium",
  "OpenCV",
  "Docker",
  "MySQL",
  "Redis",
  "RxJS",
  "SQLAlchemy",
] as const;
