export type Tool = {
  name: string;
  icon: string;
};

export type ToolGroup = {
  title: string;
  items: Tool[];
};

const si = (slug: string) => `https://cdn.simpleicons.org/${slug}/e8e8e8`;

export const toolGroups: ToolGroup[] = [
  {
    title: "linguagens",
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
    items: [
      { name: "Angular", icon: si("angular") },
      { name: "RxJS", icon: si("reactivex") },
      { name: "SCSS", icon: si("sass") },
      { name: "Vitest", icon: si("vitest") },
    ],
  },
  {
    title: "backend",
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
    items: [
      { name: "Selenium", icon: si("selenium") },
      { name: "OpenCV", icon: si("opencv") },
      { name: "Tesseract", icon: "/assets/icons/tesseract.svg" },
      { name: "PyAutoGUI", icon: si("python") },
    ],
  },
  {
    title: "dados & ml",
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
