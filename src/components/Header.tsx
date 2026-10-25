"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/data/site";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onResize() {
      if (window.matchMedia("(min-width: 641px)").matches) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Some ao descer, volta ao subir.
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const header = headerRef.current;
        if (!header) return;
        const hide = self.direction === 1 && self.scroll() > window.innerHeight * 0.5;
        header.classList.toggle("is-hidden", hide);
        header.classList.toggle("is-solid", self.scroll() > 40);
      },
    });
  });

  return (
    <header className="site-header" ref={headerRef}>
      <a className="brand" href="#topo" aria-label="Voltar ao topo">
        JA<span>.</span>
      </a>
      <button
        className="nav-toggle"
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>
      <nav className={`nav${open ? " is-open" : ""}`} aria-label="Principal">
        {navLinks.map((link, i) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            <sup>0{i + 1}</sup>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
