import { projects, type Project } from "@/data/projects";
import screenshots from "@/data/screenshots.json";
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

// Nome do arquivo do print em public/screens/ (gerado por scripts/screenshots.ts).
export const screenSlug = (href: string) =>
  (new URL(href).host + new URL(href).pathname).replace(/[^a-z0-9]+/gi, "-").replace(/-+$/, "").toLowerCase();

// Demos com front-end: só links que respondem HTML; APIs que devolvem JSON ficam de fora.
export async function getDemos(list: Project[]) {
  const demos = list.flatMap((p) => p.links.filter((l) => l.label === "demo").map((l) => ({ p, href: l.href })));
  const checked = await Promise.all(
    demos.map(async (d) => {
      const res = await fetch(d.href, { signal: AbortSignal.timeout(5000) }).catch(() => null);
      return res?.ok && res.headers.get("content-type")?.includes("text/html") ? d : null;
    })
  );
  return checked.filter((d) => d !== null);
}

// Previews: demo com print feito à mão ou já capturado pela Action; sem print ainda, fica de fora.
export async function getScreens(list: Project[]): Promise<Screen[]> {
  return (await getDemos(list)).flatMap(({ p, href }) => {
    const image = screenImages[href] ?? ((screenshots as string[]).includes(screenSlug(href)) ? `/screens/${screenSlug(href)}.jpg` : null);
    if (!image) return [];
    return [{ href, chrome: new URL(href).host, image, alt: `Tela do ${p.title}`, label: `${p.index} · demo`, title: p.title }];
  });
}
