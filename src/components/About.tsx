"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/data/site";
import { toolGroups } from "@/data/tools";
import { gsap, MOTION, SplitText, useGSAP } from "@/lib/gsap";
import { revealSection } from "@/lib/reveal";

const toolCount = toolGroups.reduce((sum, group) => sum + group.items.length, 0);
const maxSlots = Math.max(...toolGroups.map((group) => group.items.length));

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
              { opacity: 0.15 },
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
      <p className="eyebrow">01 // quem sou</p>
      <h2>por trás da silhueta</h2>

      <div className="about-layout">
        <figure className="player-card">
          <div className="player-photo">
            <Image
              src="/assets/josias.png"
              alt={`Foto de ${site.name}`}
              width={1254}
              height={1254}
              sizes="(max-width: 900px) 92vw, 26rem"
            />
            <span className="player-shade" aria-hidden="true" />
            <span className="player-unlock">
              <span className="status-live" /> desbloqueado
            </span>
          </div>
          <figcaption className="player-info">
            <strong>{site.name}</strong>
            <span>dev full stack · Manaus</span>
            <dl className="player-stats">
              <div>
                <dt>missões</dt>
                <dd>{String(projectCount).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>itens</dt>
                <dd>{toolCount}</dd>
              </div>
              <div>
                <dt>status</dt>
                <dd className="player-open">aberto a projetos</dd>
              </div>
            </dl>
          </figcaption>
        </figure>

        <div className="about-text">
          <p className="manifesto">
            Sou focado em <em>lógica</em>, <em>interfaces</em> e <em>automação</em>:
            penso a regra antes do código, crio telas que as pessoas entendem de
            primeira e automações que poupam tempo em tarefas repetitivas.
          </p>

          <div className="inventory" data-reveal>
            <p className="inventory-title">inventário</p>
            <ul>
              {toolGroups.map((group) => (
                <li key={group.title}>
                  <span className="inventory-name">{group.title}</span>
                  <span className="slots" aria-label={`${group.items.length} ferramentas`}>
                    {Array.from({ length: maxSlots }, (_, i) => (
                      <span
                        key={i}
                        className={i < group.items.length ? "slot is-filled" : "slot"}
                        title={group.items[i]?.name}
                      />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <a className="inline-link" href="#ferramentas">
              ver todos os itens
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
