"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/data/site";
import { toolGroups } from "@/data/tools";
import { gsap, MOTION, SplitText, useGSAP } from "@/lib/gsap";
import { revealSection } from "@/lib/reveal";

const toolCount = toolGroups.reduce((sum, group) => sum + group.items.length, 0);
const maxSlots = 5;

export function About({ projectCount }: { projectCount: number }) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const root = rootRef.current!;
        revealSection(root);

        // O rosto sai da sombra: a silhueta do hero é "desbloqueada" aqui.
        gsap
          .timeline({ scrollTrigger: { trigger: ".player-card", start: "top 70%" } })
          .from(".player-card", { y: 40, autoAlpha: 0, duration: 0.8, ease: "power3.out" })
          .to(".player-shade", { autoAlpha: 0, duration: 1.6, ease: "power2.inOut" }, 0.3)
          .from(".player-photo img", { scale: 1.08, duration: 1.8, ease: "power2.out" }, 0.3)
          .from(".player-unlock", { autoAlpha: 0, y: 8, duration: 0.5, ease: "power3.out" }, 1.4);

        SplitText.create(".manifesto", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.82 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: ".manifesto", start: "top 80%", end: "bottom 50%", scrub: true },
              }
            ),
        });

        gsap.from(".slot.is-filled", {
          scale: 0,
          duration: 0.35,
          ease: "back.out(3)",
          stagger: 0.025,
          scrollTrigger: { trigger: ".inventory", start: "top 85%" },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="sobre" className="section about" ref={rootRef}>
      <h2>Sobre</h2>

      <div className="about-layout">
        <figure className="player-card">
          <div className="player-photo">
            <Image
              src="/assets/josias-original.png"
              alt={`Retrato de ${site.name}`}
              width={1254}
              height={1254}
              sizes="(max-width: 900px) 92vw, 26rem"
              unoptimized
            />
            <span className="player-shade" aria-hidden="true" />
            <span className="player-unlock">
              <span className="status-live" /> disponível
            </span>
          </div>
          <figcaption className="player-info">
            <strong>{site.name}</strong>
            <span>Supply chain · Manaus</span>
            <dl className="player-stats">
              <div>
                <dt>projetos</dt>
                <dd>{String(projectCount).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>ferramentas</dt>
                <dd>{toolCount}</dd>
              </div>
              <div>
                <dt>status</dt>
                <dd className="player-open">em atuação</dd>
              </div>
            </dl>
          </figcaption>
        </figure>

        <div className="about-text">
          <p className="manifesto">
            Sou estagiário de desenvolvimento em supply chain. O trabalho é
            organizar processo em sistema: a regra vem antes da tela, e a
            automação tira do caminho o que a operação repetia à mão.
          </p>
          <p className="lead">
            Passei pela LG Electronics e atuei em projetos com o Instituto
            Eldorado e a FPF Tech, na LG AIX Academy. No dia a dia uso Python,
            RPA e desenvolvimento de sistemas web e desktop.
          </p>

          <div className="inventory" data-reveal>
            <p className="inventory-title">ferramentas</p>
            <ul>
              {toolGroups.map((group) => (
                <li key={group.title}>
                  <span className="inventory-name">{group.title}</span>
                  <span className="slots" aria-label={`domínio ${group.level} de ${maxSlots}`}>
                    {Array.from({ length: maxSlots }, (_, i) => (
                      <span
                        key={i}
                        className={i < group.level ? "slot is-filled" : "slot"}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <a className="inline-link" href="#ferramentas">
              ver a lista completa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
