"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/data/site";
import { gsap, MOTION, SplitText, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const split = SplitText.create(".hero-name-row", { type: "chars", mask: "chars" });

        // Estado inicial: foto coberta pela sombra até a intro abrir a cortina.
        // (opacity numa camada por cima é bem mais leve que animar `filter` na imagem)
        gsap.set(".hero-shade", { autoAlpha: 1 });
        gsap.set(".hero-photo", { scale: 1.06 });
        gsap.set(".hero-glow", { autoAlpha: 0, scale: 0.7 });
        gsap.set(split.chars, { yPercent: 115 });
        gsap.set("[data-hero-in]", { autoAlpha: 0, y: 30 });

        const intro = gsap
          .timeline({ paused: true })
          .to(".hero-glow", { autoAlpha: 1, scale: 1, duration: 2.2, ease: "power2.out" })
          .to(".hero-shade", { autoAlpha: 0, duration: 2, ease: "power2.inOut" }, 0)
          .to(".hero-photo", { scale: 1, duration: 2.2, ease: "power2.out" }, 0)
          .to(split.chars, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.04 }, 0.5)
          .to(
            "[data-hero-in]",
            { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 },
            1.1
          );

        const offIntro = onIntroDone(() => intro.play());

        // Rolagem: a silhueta recua e se apaga na fumaça enquanto o nome se abre.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "+=100%",
              pin: true,
              scrub: true,
            },
          })
          .to(".hero-photo", { scale: 0.86, yPercent: -4 }, 0)
          .to(".hero-photo", { autoAlpha: 0, duration: 0.6 }, 0.2)
          .to(".hero-name-row--a", { xPercent: -40, autoAlpha: 0 }, 0)
          .to(".hero-name-row--b", { xPercent: 40, autoAlpha: 0 }, 0)
          .to(".hero-side", { y: -60, autoAlpha: 0, duration: 0.5 }, 0)
          .to(".hero-glow", { scale: 1.6, autoAlpha: 0 }, 0)
          .fromTo(".hero-whisper", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.55);

        return () => offIntro();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-glow", { autoAlpha: 1 });
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero-glow-wrap" aria-hidden="true">
        <div className="hero-glow" />
      </div>

      <div className="hero-media">
        <div className="hero-photo">
          <Image
            src="/assets/josias-silhueta.webp"
            alt={`Retrato de ${site.name} em contraluz`}
            width={1530}
            height={2048}
            // Já vem tratada (cor, grão, WebP 90); a recompressão do Next criaria faixas no escuro.
            unoptimized
            priority
          />
          <span className="hero-shade" aria-hidden="true" />
        </div>
      </div>

      <h1 className="hero-name" aria-label={site.name}>
        <span className="hero-name-row hero-name-row--a" aria-hidden="true">
          Josias
        </span>
        <span className="hero-name-row hero-name-row--b" aria-hidden="true">
          Azevedo
        </span>
      </h1>

      <div className="hero-side hero-side--left">
        <p className="hero-available" data-hero-in>
          <span className="status-live" /> disponível para projetos
        </p>
        <p className="hero-lead" data-hero-in>
          Desenvolvedor frontend &amp; full stack. Transformo processos manuais em
          sistemas que <em>rodam sozinhos</em>.
        </p>
        <div className="hero-actions" data-hero-in>
          <a className="btn btn-primary" href="#projetos">
            ver projetos
          </a>
          <a className="btn btn-ghost" href="#contato">
            falar comigo
          </a>
        </div>
      </div>

      <div className="hero-side hero-side--right">
        <ul className="hero-tags" aria-label="Foco" data-hero-in>
          <li>Angular</li>
          <li>TypeScript</li>
          <li>Python</li>
          <li>APIs</li>
        </ul>
        <a className="scroll-hint" href="#sobre" data-hero-in>
          <span>role para descobrir</span>
          <span className="scroll-hint-line" aria-hidden="true" />
        </a>
      </div>

      <p className="hero-whisper" aria-hidden="true">
        continue descendo.
      </p>
    </section>
  );
}
