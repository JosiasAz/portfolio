"use client";

import { useEffect, useRef } from "react";
import { initSmokeCanvas } from "@/lib/smoke-canvas";

export function SmokeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initSmokeCanvas(canvas);
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-glow" />
      <canvas className="bg-canvas" ref={canvasRef} />
      <div className="bg-grain" />
    </div>
  );
}
