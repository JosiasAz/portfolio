"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { site } from "@/data/site";

export function HeroPhoto() {
  const rootRef = useRef<HTMLDivElement>(null);

  function onMove(event: PointerEvent<HTMLDivElement>) {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
    el.style.setProperty("--glow-x", `${50 + x * 28}%`);
    el.style.setProperty("--glow-y", `${50 + y * 28}%`);
  }

  function onLeave() {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--glow-x", "50%");
    el.style.setProperty("--glow-y", "42%");
  }

  return (
    <div
      className="hero-photo"
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="hero-photo-orbit" aria-hidden="true" />
      <div className="hero-photo-orbit hero-photo-orbit--cross" aria-hidden="true" />
      <div className="hero-photo-core">
        <span className="hud hud-tl" />
        <span className="hud hud-tr" />
        <span className="hud hud-bl" />
        <span className="hud hud-br" />
        <div className="hero-photo-stage">
          <Image
            src="/assets/josias.png"
            alt={`Foto de ${site.name}`}
            width={640}
            height={640}
            priority
          />
          <span className="hero-photo-scan" aria-hidden="true" />
          <span className="hero-photo-sheen" aria-hidden="true" />
        </div>
        <div className="hero-photo-meta" aria-hidden="true">
          <span>ID · JA-01</span>
          <span className="hero-photo-lock">
            <i />
            LOCKED
          </span>
        </div>
      </div>
    </div>
  );
}
