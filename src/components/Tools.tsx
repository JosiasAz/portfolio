"use client";

import { useRef } from "react";
import { toolGroups } from "@/data/tools";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { revealSection } from "@/lib/reveal";

export function Tools() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => revealSection(rootRef.current!));
    },
    { scope: rootRef }
  );

  return (
    <section id="ferramentas" className="section" ref={rootRef}>
      <h2>Competências</h2>
      <div className="skill-board">
        {toolGroups.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item.name}>{item.name}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
