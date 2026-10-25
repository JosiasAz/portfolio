"use client";

import { useRef } from "react";
import { site } from "@/data/site";
import { DESKTOP, gsap, MOTION, SplitText, useGSAP } from "@/lib/gsap";

const channels = [
  { label: "email", value: site.email, href: `mailto:${site.email}`, action: "abrir", external: false },
  { label: "whatsapp", value: site.whatsapp, href: site.whatsappUrl, action: "chat", external: true },
  { label: "linkedin", value: site.linkedinHandle, href: site.linkedin, action: "perfil", external: true },
  { label: "github", value: site.githubHandle, href: site.github, action: "repos", external: true },
];

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        gsap.from(".eyebrow", {
          autoAlpha: 0,
          y: 12,
          duration: 0.7,
          scrollTrigger: { trigger: ".eyebrow", start: "top 88%" },
        });

        // Título gigante cresce e acende letra a letra com o scroll.
        SplitText.create(".contact-title", {
          type: "words, chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".contact-title",
                  start: "top 95%",
                  end: "top 30%",
                  scrub: 1,
                },
              })
              .from(".contact-title", { scale: 0.85, ease: "none" }, 0)
              .from(self.chars, { color: "rgba(236,243,239,0.1)", stagger: 0.04, ease: "none" }, 0),
        });

        gsap.from(".contact-channel, .contact-copy > *", {
          autoAlpha: 0,
          y: 24,
          stagger: 0.06,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-layout", start: "top 85%" },
        });
      });

      // Canais magnéticos.
      mm.add(DESKTOP, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>(".magnetic").map((el) => {
          const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          function onMove(event: PointerEvent) {
            const rect = el.getBoundingClientRect();
            x((event.clientX - rect.left - rect.width / 2) * 0.15);
            y((event.clientY - rect.top - rect.height / 2) * 0.2);
          }
          function onLeave() {
            x(0);
            y(0);
          }
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
          return () => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: rootRef }
  );

  return (
    <section id="contato" className="section contact" ref={rootRef}>
      <p className="eyebrow">05 // missão</p>
      <h2 className="contact-title">bora construir algo?</h2>
      <div className="contact-layout">
        <div className="contact-copy">
          <p className="lead">
            Tem um processo para automatizar, uma interface para construir ou uma
            vaga em mente? Manda a missão. Respondo com clareza.
          </p>
          <p className="contact-note">
            <span className="status-live" />
            disponível para oportunidades e colaborações
          </p>
          <a className="contact-email magnetic" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="contact-channels">
          {channels.map((channel) => (
            <a
              key={channel.label}
              className="contact-channel magnetic"
              href={channel.href}
              {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="contact-channel-meta">
                <span className="contact-channel-label">{channel.label}</span>
                <span className="contact-channel-value">{channel.value}</span>
              </span>
              <span className="contact-channel-action">{channel.action} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
