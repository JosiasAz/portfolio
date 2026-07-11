"use client";

import { useEffect, useRef } from "react";
import { initSkyCanvas } from "@/lib/sky-canvas";

export function SkyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const bg = bgRef.current;
    if (!canvas || !bg) return;
    return initSkyCanvas(canvas, bg);
  }, []);

  return (
    <div className="bg" aria-hidden="true" ref={bgRef}>
      <div className="bg-sky" />
      <div className="bg-milky" />
      <div className="bg-glow" />
      <canvas className="bg-canvas" ref={canvasRef} />
    </div>
  );
}
