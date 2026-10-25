import { gsap, SplitText } from "@/lib/gsap";

/**
 * Entradas padrão de uma seção: eyebrow, título letra a letra e
 * qualquer elemento marcado com `data-reveal`. Chamar dentro de um
 * `gsap.matchMedia` com movimento permitido.
 */
export function revealSection(root: HTMLElement) {
  const eyebrow = root.querySelector(".eyebrow");
  const title = root.querySelector("h2");

  if (eyebrow) {
    gsap.from(eyebrow, {
      autoAlpha: 0,
      y: 12,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: eyebrow, start: "top 88%" },
    });
  }

  if (title) {
    SplitText.create(title, {
      type: "words, chars",
      mask: "chars",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 100,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.02,
          scrollTrigger: { trigger: title, start: "top 85%" },
        }),
    });
  }

  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 24,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
}
