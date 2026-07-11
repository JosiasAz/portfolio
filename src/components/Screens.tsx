import Image from "next/image";
import { screens } from "@/data/screens";

export function Screens() {
  return (
    <section id="telas" className="section screens">
      <p className="eyebrow">04 // telas</p>
      <h2>previews</h2>
      <p className="lead">
        Telas reais dos projetos: demos no ar e páginas dos repositórios.
      </p>

      <div className="screen-grid">
        {screens.map((screen) => (
          <a
            className="screen-card"
            href={screen.href}
            target="_blank"
            rel="noopener noreferrer"
            key={screen.title}
          >
            <div className="screen-frame">
              <div className="screen-chrome" aria-hidden="true">
                <span />
                <span />
                <span />
                <p>{screen.chrome}</p>
              </div>
              <Image
                src={screen.image}
                alt={screen.alt}
                width={1400}
                height={1050}
                loading="lazy"
              />
            </div>
            <div className="screen-meta">
              <span className="screen-label">{screen.label}</span>
              <strong>{screen.title}</strong>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
