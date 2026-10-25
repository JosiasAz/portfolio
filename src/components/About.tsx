"use client";

import { useRef } from "react";
import { projects } from "@/data/projects";
import { toolGroups } from "@/data/tools";
import { gsap, MOTION, SplitText, useGSAP } from "@/lib/gsap";
import { revealSection } from "@/lib/reveal";

const toolCount = toolGroups.reduce((sum, group) => sum + group.items.length, 0);

const stats = [
  { value: projects.length, label: "projetos em destaque" },
  { value: toolCount, label: "ferramentas no loadout" },
  { value: toolGroups.length, label: "frentes de atuação" },
];

export function About() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const root = rootRef.current!;
        revealSection(root);

        // Cada palavra do manifesto acende conforme a rolagem.
        SplitText.create(".manifesto", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: ".manifesto",
                  start: "top 80%",
                  end: "bottom 45%",
                  scrub: true,
                },
              }
            ),
        });

        root.querySelectorAll<HTMLElement>(".about-stat-value").forEach((el) => {
          const target = Number(el.dataset.value);
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value)).padStart(2, "0");
            },
          });
        });

        gsap.from(".status-row", {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.7,
          ease: "power3.inOut",
          stagger: 0.15,
          scrollTrigger: { trigger: ".status-board", start: "top 85%" },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="sobre" className="section about" ref={rootRef}>
      <p className="eyebrow">01 // quem sou</p>
      <h2>por trás da silhueta</h2>

      <p className="manifesto">
        Sou desenvolvedor focado em <em>interfaces</em> e <em>automação</em>.
        Construo fluxos que tiram trabalho repetitivo do caminho e sistemas que
        aguentam o uso real, do protótipo à entrega. Prefiro stack enxuto e
        responsabilidade clara: <em>menos ruído, mais resultado.</em>
      </p>

      <div className="about-layout">
        <div className="about-stats" aria-label="Destaques" data-reveal>
          {stats.map((stat) => (
            <div className="about-stat" key={stat.label}>
              <span className="about-stat-value" data-value={stat.value}>
                {String(stat.value).padStart(2, "0")}
              </span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
        <dl className="status-board" aria-label="Status atual">
          <div className="status-row">
            <dt>classe</dt>
            <dd>dev · frontend · full stack</dd>
          </div>
          <div className="status-row">
            <dt>foco</dt>
            <dd>interfaces · APIs · automação</dd>
          </div>
          <div className="status-row">
            <dt>stack</dt>
            <dd>angular · typescript · python</dd>
          </div>
          <div className="status-row">
            <dt>modo</dt>
            <dd>
              <span className="status-live" /> aberto a oportunidades
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
