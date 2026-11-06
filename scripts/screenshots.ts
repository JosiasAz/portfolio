// Tira print dos demos com front-end e salva em public/screens/.
// Roda no GitHub Actions (.github/workflows/screenshots.yml); REFRESH=true refaz todos.
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import screenshots from "../src/data/screenshots.json";
import { screenImages } from "../src/data/screens";
import { getDemos, getProjects, screenSlug } from "../src/lib/github";

async function main() {
  const refresh = process.env.REFRESH === "true";
  const done = new Set<string>(screenshots);
  const demos = (await getDemos(await getProjects())).filter((d) => !screenImages[d.href]);

  mkdirSync("public/screens", { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  let failed: string[] = [];
  // API fora do ar = site preso em skeleton; melhor não publicar esse print.
  page.on("requestfailed", (req) => failed.push(req.url()));
  page.on("response", (res) => res.status() >= 500 && failed.push(res.url()));

  for (const { href } of demos) {
    const slug = screenSlug(href);
    if (done.has(slug) && !refresh) continue;
    failed = [];
    try {
      await page.goto(href, { waitUntil: "networkidle", timeout: 60_000 });
      await page.waitForTimeout(4000); // animações de entrada e dados que chegam atrasados
      if (failed.length) throw new Error(`requisições falharam: ${failed.join(", ")}`);
      await page.screenshot({ path: `public/screens/${slug}.jpg`, type: "jpeg", quality: 82 });
      done.add(slug);
      console.log("ok", href);
    } catch (err) {
      // Falhou: mantém o print anterior (se houver) e tenta de novo na próxima execução.
      console.error("falhou", href, err);
    }
  }

  await browser.close();
  writeFileSync("src/data/screenshots.json", JSON.stringify([...done].sort(), null, 2) + "\n");
}

main();
