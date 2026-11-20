"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_ID = "KhqNTjbQ71A";
const STORAGE_KEY = "portfolio-music-on";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

type YTStateEvent = { data: number };

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: object) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.querySelector("script[data-yt-api]")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.dataset.ytApi = "1";
      document.head.appendChild(script);
    }
  });
}

export function MusicToggle() {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const wantPlay = useRef(false);
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dead = false;
    let playing = false;
    // Toca ao entrar, a menos que a pessoa tenha desligado antes.
    try {
      wantPlay.current = localStorage.getItem(STORAGE_KEY) !== "0";
    } catch {
      wantPlay.current = true;
    }

    void loadYouTubeApi().then(() => {
      if (dead || !hostRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: VIDEO_ID,
        width: "320",
        height: "180",
        playerVars: {
          autoplay: 0,
          rel: 0,
          loop: 1,
          playlist: VIDEO_ID,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (dead) return;
            setReady(true);
            if (wantPlay.current) playerRef.current?.playVideo();
          },
          onStateChange: (event: YTStateEvent) => {
            playing = event.data === 1;
            setOn(playing);
          },
        },
      });
    });

    function onVisibility() {
      const player = playerRef.current;
      if (!player) return;
      if (document.hidden && wantPlay.current) player.pauseVideo();
      if (!document.hidden && wantPlay.current) player.playVideo();
    }

    // Navegador bloqueou o autoplay com som: começa na primeira interação com a página.
    // O próprio botão fica de fora para não tocar e pausar no mesmo clique.
    function onFirstInteraction(event: Event) {
      if ((event.target as Element | null)?.closest?.(".music-toggle")) return;
      if (wantPlay.current && !playing) playerRef.current?.playVideo();
    }
    const unlockEvents = ["pointerdown", "keydown", "touchend"] as const;
    unlockEvents.forEach((type) => document.addEventListener(type, onFirstInteraction, { passive: true }));

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      dead = true;
      unlockEvents.forEach((type) => document.removeEventListener(type, onFirstInteraction));
      document.removeEventListener("visibilitychange", onVisibility);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  function toggle() {
    const player = playerRef.current;
    if (!player || !ready) {
      wantPlay.current = true;
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      return;
    }

    if (on) {
      wantPlay.current = false;
      player.pauseVideo();
      setOn(false);
      try {
        localStorage.setItem(STORAGE_KEY, "0");
      } catch {
        /* ignore */
      }
      return;
    }

    wantPlay.current = true;
    player.playVideo();
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <div className="yt-dock" aria-hidden="true">
        <div ref={hostRef} />
      </div>
      <button
        className={`music-toggle${on ? " is-on" : ""}`}
        type="button"
        aria-pressed={on}
        aria-label={on ? "Pausar Last Christmas" : "Tocar Last Christmas"}
        title="Wham! — Last Christmas"
        onClick={toggle}
      >
        <svg className="music-icon music-icon-off" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M11 5 6.5 9H3v6h3.5L11 19V5zM15.5 9.5l5 5m0-5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg className="music-icon music-icon-on" viewBox="0 0 24 24" aria-hidden="true">
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
    </>
  );
}
