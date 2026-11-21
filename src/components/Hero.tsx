import Image from "next/image";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="hero" aria-label="Apresentação">
      <div className="hero-stage">
        <h1 className="hero-name">
          <span className="hero-line">
            <span>Josias</span>
          </span>
          <span className="hero-line">
            <span>Azevedo</span>
          </span>
        </h1>
        <div className="hero-plate">
        <p className="hero-role">Estagiário de Desenvolvimento em Supply Chain</p>
        <p className="hero-lead">
          Sistemas e automações para a operação, em Manaus. Tela que o processo
          entende, regra clara e menos trabalho repetido.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projetos">
            Ver projetos
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
        </div>

        <p className="hero-floor">
        <span>Manaus</span>
        <span className="hero-rule" aria-hidden="true" />
        <span>LG Electronics</span>
        <span>Instituto Eldorado</span>
        <span>FPF Tech</span>
      </p>
      </div>

      <div className="hero-photo">
        <Image
          src="/assets/josias-original.png"
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 58vw"
          unoptimized
          priority
        />
      </div>
    </section>
  );
}
