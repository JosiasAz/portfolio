import { projects, type Project } from "@/data/projects";
import { screenImages, type Screen } from "@/data/screens";
import { site } from "@/data/site";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
};

const TOPIC = "portfolio";
const user = site.github.split("/").pop();

// Projetos curados + repos do GitHub com o topic "portfolio" que ainda não estão na lista.
export async function getProjects(): Promise<Project[]> {
  const known = new Set(projects.flatMap((p) => p.links.map((l) => l.href.toLowerCase())));
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=created&direction=asc`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const repos: Repo[] = await res.json();

    const extra = repos
      .filter((r) => r.topics.includes(TOPIC) && !r.fork && !r.archived && !known.has(r.html_url.toLowerCase()))
      .map((r, i): Project => ({
        index: String(projects.length + i + 1).padStart(2, "0"),
        title: r.name.replace(/[-_]/g, " "),
        tags: [r.language, ...r.topics.filter((t) => t !== TOPIC)].filter(Boolean).join(" · "),
        description: r.description ?? "",
        links: [
          { label: "github", href: r.html_url },
          ...(r.homepage ? [{ label: "demo", href: r.homepage }] : []),
        ],
      }));
    return [...projects, ...extra];
  } catch (err) {
    // Sem GitHub (rate limit, rede): o portfólio continua com a lista curada.
    console.error("getProjects:", err);
    return projects;
  }
}

// Previews: só demos que respondem HTML (front-end); APIs que devolvem JSON ficam de fora.
export async function getScreens(list: Project[]): Promise<Screen[]> {
  const demos = list.flatMap((p) => p.links.filter((l) => l.label === "demo").map((l) => ({ p, href: l.href })));
  const screens = await Promise.all(
    demos.map(async ({ p, href }): Promise<Screen | null> => {
      const res = await fetch(href, { signal: AbortSignal.timeout(5000) }).catch(() => null);
      if (!res?.ok || !res.headers.get("content-type")?.includes("text/html")) return null;
      return {
        href,
        chrome: new URL(href).host,
        image:
          screenImages[href] ??
          `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1400&viewport.height=1050&waitForTimeout=2000`,
        alt: `Tela do ${p.title}`,
        label: `${p.index} · demo`,
        title: p.title,
      };
    })
  );
  return screens.filter((s) => s !== null);
}
