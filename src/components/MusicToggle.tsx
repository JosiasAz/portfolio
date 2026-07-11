"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "portfolio-music-on";

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState("Música");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.32;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setHint("Clique para retomar a música");
      }
    } catch {
      /* ignore */
    }

    function onVisibility() {
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        audio.dataset.wasPlaying = "1";
        audio.pause();
      } else if (!document.hidden && audio.dataset.wasPlaying === "1") {
        audio.dataset.wasPlaying = "";
        void audio.play().then(() => setOn(true)).catch(() => setOn(false));
      }
    }

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setOn(true);
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
      } catch {
        setOn(false);
      }
    } else {
      audio.pause();
      setOn(false);
      try {
        localStorage.setItem(STORAGE_KEY, "0");
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <>
      <button
        className={`music-toggle${on ? " is-on" : ""}`}
        type="button"
        aria-pressed={on}
        aria-label={on ? "Desativar música de fundo" : "Ativar música de fundo"}
        title={hint}
        onClick={() => void toggle()}
      >
        <svg
          className="music-icon music-icon-off"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M11 5 6.5 9H3v6h3.5L11 19V5zM15.5 9.5l5 5m0-5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="music-icon music-icon-on"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M11 5 6.5 9H3v6h3.5L11 19V5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.2 9.8a4.2 4.2 0 0 1 0 4.4M17.8 7.5a7.2 7.2 0 0 1 0 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span className="music-label">som</span>
      </button>
      <audio
        ref={audioRef}
        src="/assets/ambient.wav"
        loop
        preload="none"
        playsInline
      />
    </>
  );
}
