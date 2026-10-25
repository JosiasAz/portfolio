"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

if (typeof window !== "undefined") {
  // Evita recálculo de pins quando a barra de endereço do mobile some/aparece.
  ScrollTrigger.config({ ignoreMobileResize: true });
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const MOBILE = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
