import { HeroPhoto } from "@/components/HeroPhoto";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="hero">
      <HeroPhoto />

      <div className="hero-text">
        <p className="hero-available">
          <span className="status-live" /> disponível para projetos
        </p>
        <h1 className="hero-name">
          Josias
          <br />
          <span className="hero-name-accent">Azevedo</span>
        </h1>
        <p className="hero-lead">
          Transformo processos manuais em sistemas que <em>rodam sozinhos</em>.
          Do front ao backend, com stack limpo e entrega no prazo.
        </p>
        <ul className="hero-tags" aria-label="Foco">
          <li>Python</li>
          <li>Angular</li>
          <li>Automação</li>
          <li>APIs</li>
        </ul>
        <div className="xp-wrap" aria-hidden="true">
          <div className="xp-label">
            <span>ready</span>
            <span>lvl 99</span>
          </div>
          <div className="xp-bar">
            <span className="xp-fill" />
          </div>
        </div>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projetos">
            ver projetos
          </a>
          <a
            className="btn btn-ghost"
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          <a className="btn btn-ghost" href="#contato">
            falar comigo
          </a>
        </div>
      </div>

      <a className="scroll-hint" href="#sobre" aria-label="Rolar para o conteúdo">
        <span>scroll</span>
        <span className="scroll-hint-arrow" aria-hidden="true" />
      </a>
    </section>
  );
}
