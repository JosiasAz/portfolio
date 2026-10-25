"use client";

import { useRef } from "react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { revealSection } from "@/lib/reveal";

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        revealSection(rootRef.current!);

        // Cards empilhados: o card de baixo encolhe e escurece quando o próximo cobre.
        const cards = gsap.utils.toArray<HTMLElement>(".project");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const trigger = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
          gsap.to(card.querySelector(".project-inner"), { scale: 0.95, ease: "none", scrollTrigger: trigger });
          gsap.to(card.querySelector(".project-shade"), { opacity: 0.5, ease: "none", scrollTrigger: trigger });
        });

        cards.forEach((card) => {
          gsap.from(card.querySelector(".project-index"), {
            y: 24,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 75%" },
          });
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="projetos" className="section projects" ref={rootRef}>
      <p className="eyebrow">03 // missões</p>
      <h2>projetos</h2>
      <p className="lead" data-reveal>
        Seleção do meu{" "}
        <a className="inline-link" href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        : sistemas web, automação, dados e experimentos com stack real.
      </p>

      <div className="project-list">
        {projects.map((project, i) => (
          <article
            className="project"
            key={project.index}
            style={{ ["--i" as string]: i }}
          >
            <div className="project-inner">
              <p className="project-index" aria-hidden="true">
                {project.index}
              </p>
              <div className="project-body">
                <p className="project-tags">{project.tags}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-links">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <span className="project-shade" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
