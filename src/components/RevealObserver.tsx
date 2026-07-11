"use client";

import { useEffect } from "react";

const SELECTOR =
  ".section .eyebrow, .section h2, .section .lead, .about-body, .about-stats, .status-board, .contact-note, .contact-email, .contact-channel, .tool-block, .stack-marquee, .project, .screen-card, .site-footer";

export function RevealObserver() {
  useEffect(() => {
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    revealEls.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${Math.min((i % 6) * 70, 280)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          const section = entry.target.closest(".section");
          if (section) section.classList.add("is-lit");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));

    const sectionObservers: IntersectionObserver[] = [];
    document.querySelectorAll(".section").forEach((section) => {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-lit");
              sectionObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      sectionObserver.observe(section);
      sectionObservers.push(sectionObserver);
    });

    return () => {
      observer.disconnect();
      sectionObservers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}
