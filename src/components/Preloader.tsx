"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, REDUCED } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";

const STORAGE_KEY = "portfolio-intro-seen";

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      let seen = false;
      try {
        seen = sessionStorage.getItem(STORAGE_KEY) === "1";
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }

      function end() {
        document.documentElement.classList.remove("is-loading");
        setDone(true);
        finishIntro();
      }

      if (seen || window.matchMedia(REDUCED).matches) {
        end();
        return;
      }

      document.documentElement.classList.add("is-loading");
      window.scrollTo(0, 0);

      const counter = { value: 0 };
      const tl = gsap.timeline({ onComplete: end });
      tl.from(".preloader-word", { yPercent: 110, duration: 0.8, ease: "power4.out", stagger: 0.08 })
        .to(
          counter,
          {
            value: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current) {
                countRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
              }
            },
          },
          0.1
        )
        .to(".preloader-bar span", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0.1)
        .to(".preloader-content", { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" })
        .fromTo(
          ".preloader-line",
          { scaleX: 0, autoAlpha: 1 },
          { scaleX: 1, duration: 0.6, ease: "expo.inOut" }
        )
        .to(".preloader-panel--top", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "+=0.05")
        .to(".preloader-panel--bottom", { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
        .to(".preloader-line", { autoAlpha: 0, scaleY: 8, duration: 0.6, ease: "power2.out" }, "<0.1");
    },
    { scope: rootRef }
  );

  if (done) return null;

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <div className="preloader-panel preloader-panel--top" />
      <div className="preloader-panel preloader-panel--bottom" />
      <div className="preloader-line" />
      <div className="preloader-content">
        <p className="preloader-name">
          <span className="preloader-mask">
            <span className="preloader-word">josias</span>
          </span>{" "}
          <span className="preloader-mask">
            <span className="preloader-word">azevedo</span>
          </span>
        </p>
        <span className="preloader-count" ref={countRef}>
          000
        </span>
        <div className="preloader-bar">
          <span />
        </div>
      </div>
    </div>
  );
}
