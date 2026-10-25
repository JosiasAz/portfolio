"use client";

import { useRef } from "react";
import { marqueeItems, toolGroups } from "@/data/tools";
import { DESKTOP, gsap, MOBILE, MOTION, useGSAP } from "@/lib/gsap";
import { revealSection } from "@/lib/reveal";

export function Tools() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => revealSection(rootRef.current!));

      // Desktop: a seção trava e os cards deslizam na horizontal.
      mm.add(DESKTOP, () => {
        const track = rootRef.current!.querySelector<HTMLElement>(".tools-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".tools-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>(".tool-block").forEach((block) => {
          gsap.from(block.querySelectorAll(".pill"), {
            autoAlpha: 0,
            y: 16,
            stagger: 0.04,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              containerAnimation: slide,
              start: "left 85%",
            },
          });
        });

        gsap.to(".tools-progress span", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".tools-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      mm.add(MOBILE, () => {
        gsap.utils.toArray<HTMLElement>(".tool-block").forEach((block) => {
          gsap.from(block, {
            autoAlpha: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 90%" },
          });
        });
      });

      // Marquee: duas faixas em sentidos opostos, velocidade constante.
      mm.add(MOTION, () => {
        gsap.utils.toArray<HTMLElement>(".stack-marquee-track").forEach((row, i) => {
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 40, ease: "none", repeat: -1 }
          );
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="ferramentas" className="section tools-section" ref={rootRef}>
      <p className="eyebrow">02 // loadout</p>
      <h2>ferramentas</h2>

      <div className="tools-pin">
        <div className="tools-track">
          <p className="tools-intro" aria-hidden="true">
            o que eu
            <br />
            levo para
            <br />
            <em>cada missão</em> →
          </p>
          {toolGroups.map((group, i) => (
            <div className="tool-block" key={group.title}>
              <span className="tool-block-index">0{i + 1}</span>
              <h3>{group.title}</h3>
              <div className="pills">
                {group.items.map((item) => (
                  <span className="pill" key={item.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.icon} alt="" width={16} height={16} />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="tools-progress" aria-hidden="true">
          <span />
        </div>
      </div>

      <div className="stack-marquee" aria-hidden="true">
        {[0, 1].map((row) => (
          <div className="stack-marquee-track" key={row}>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
