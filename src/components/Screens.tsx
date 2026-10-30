"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Screen } from "@/data/screens";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { revealSection } from "@/lib/reveal";

export function Screens({ screens }: { screens: Screen[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        revealSection(rootRef.current!);

        gsap.utils.toArray<HTMLElement>(".screen-card").forEach((card) => {
          const frame = card.querySelector(".screen-frame");
          const img = card.querySelector(".screen-frame img");

          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 85%" } })
            .from(card, { y: 32, autoAlpha: 0, duration: 0.9, ease: "power3.out" })
            .from(
              frame,
              { clipPath: "inset(100% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" },
              0
            );

          gsap.fromTo(
            img,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="telas" className="section screens" ref={rootRef}>
      <p className="eyebrow">04 // telas</p>
      <h2>previews</h2>
      <p className="lead" data-reveal>
        Telas reais dos sistemas no ar.
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
              <div className="screen-image">
                <Image
                  src={screen.image}
                  alt={screen.alt}
                  width={1400}
                  height={1050}
                  sizes="(max-width: 767px) 92vw, 46vw"
                  loading="lazy"
                />
              </div>
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
