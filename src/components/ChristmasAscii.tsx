"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];
type Pt = { x: number; y: number; z: number; nx: number; ny: number; nz: number; kind: number; color: RGB; phase: number };

const LEAF = 0;
const LIGHT = 1;
const BALL = 2;
const SOLID = 3;

const H = 1.7;
const FLOOR = -0.2;
const MID = (FLOOR + H + 0.18) / 2;
const D = 4;
const TILT = -0.22;
const RAMP = " .:-=+*#%@";
// letras 5x7 para o letreiro "FELIZ" / "NATAL"
const GLYPHS: Record<string, string[]> = {
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  N: ["#...#", "##..#", "##..#", "#.#.#", "#..##", "#..##", "#...#"],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
};
const SIGN_COLORS = ["#ffe56a", "#ff3b4e", "#3dff7a", "#3d8dff", "#fff6c2", "#ff9f40"];
// cada pixel da letra = 2 caracteres de largura x 1 linha (fica quase quadrado)
const WORD_COLS = (5 * 5 + 4) * 2;
const LIGHT_DIR = (() => {
  const v = [-0.45, 0.55, -0.7];
  const l = Math.hypot(v[0], v[1], v[2]);
  return v.map((n) => n / l) as [number, number, number];
})();
const HALF = (() => {
  const v = [LIGHT_DIR[0], LIGHT_DIR[1], LIGHT_DIR[2] - 1];
  const l = Math.hypot(v[0], v[1], v[2]);
  return v.map((n) => n / l) as [number, number, number];
})();

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// layered cone: each of the 6 tiers flares out at its bottom
function radius(y: number) {
  const t = y / H;
  const f = (t * 6) % 1;
  return (1 - t) * 0.8 * (0.55 + 0.45 * (1 - f)) + 0.02;
}

function buildScene() {
  const pts: Pt[] = [];
  const rnd = Math.random;
  const add = (x: number, y: number, z: number, nx: number, ny: number, nz: number, kind: number, color: RGB, phase = 0) => {
    const l = Math.hypot(nx, ny, nz) || 1;
    pts.push({ x, y, z, nx: nx / l, ny: ny / l, nz: nz / l, kind, color, phase });
  };

  const greens: RGB[] = [[22, 120, 52], [34, 160, 72], [60, 200, 100], [110, 235, 130]];
  for (let n = 0; n < 26000; ) {
    const y = rnd() * H;
    const r = radius(y);
    if (rnd() * 0.84 > r) continue;
    n += 1;
    const a = rnd() * Math.PI * 2;
    const d = r * (0.8 + 0.2 * rnd());
    const j = () => (rnd() - 0.5) * 0.7;
    add(Math.cos(a) * d, y, Math.sin(a) * d, Math.cos(a) + j(), 0.55 + j(), Math.sin(a) + j(), LEAF, greens[Math.floor(rnd() * 4)]);
  }

  const warm: RGB[] = [[255, 229, 106], [255, 246, 194], [255, 190, 80], [255, 120, 90]];
  for (let i = 0; i < 170; i += 1) {
    const t = i / 170;
    const a = t * Math.PI * 16;
    const y = 0.05 + t * (H - 0.15);
    const r = radius(y) * 1.04;
    add(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(a), 0.3, Math.sin(a), LIGHT, warm[i % 4], i * 0.7);
  }

  for (let b = 0; b < 16; b += 1) {
    const y = 0.12 + rnd() * 1.25;
    const a = rnd() * Math.PI * 2;
    const r = radius(y) * 0.97;
    const R = 0.075 + 0.025 * rnd();
    const color: RGB = b % 5 === 4 ? [255, 200, 60] : [235, 40, 60];
    for (let k = 0; k < 400; k += 1) {
      const z1 = rnd() * 2 - 1;
      const p = rnd() * Math.PI * 2;
      const s = Math.sqrt(1 - z1 * z1);
      const nx = s * Math.cos(p);
      const nz = s * Math.sin(p);
      add(Math.cos(a) * r + nx * R, y + z1 * R, Math.sin(a) * r + nz * R, nx, z1, nz, BALL, color);
    }
  }

  for (let k = 0; k < 700; k += 1) {
    const a = rnd() * Math.PI * 2;
    add(Math.cos(a) * 0.09, FLOOR + rnd() * 0.25, Math.sin(a) * 0.09, Math.cos(a), 0, Math.sin(a), SOLID, [125, 80, 42]);
  }

  const gifts: { x: number; z: number; w: number; h: number; d: number; c: RGB }[] = [
    { x: 0.62, z: -0.35, w: 0.34, h: 0.26, d: 0.3, c: [255, 213, 74] },
    { x: -0.55, z: -0.45, w: 0.3, h: 0.32, d: 0.3, c: [61, 120, 255] },
    { x: 0.08, z: 0.72, w: 0.4, h: 0.24, d: 0.32, c: [255, 59, 78] },
    { x: -0.62, z: 0.45, w: 0.26, h: 0.2, d: 0.26, c: [170, 90, 255] },
  ];
  for (const g of gifts) {
    for (let i = 0; i < 1400; i += 1) {
      const face = Math.floor(rnd() * 5);
      const u = rnd() - 0.5;
      const v = rnd() - 0.5;
      let lx = u * g.w;
      let ly = (v + 0.5) * g.h;
      let lz = v * g.d;
      let nx = 0;
      let ny = 0;
      let nz = 0;
      if (face === 0) {
        ly = g.h;
        ny = 1;
      } else if (face < 3) {
        lx = (face === 1 ? 0.5 : -0.5) * g.w;
        lz = u * g.d;
        nx = face === 1 ? 1 : -1;
      } else {
        lz = (face === 3 ? 0.5 : -0.5) * g.d;
        nz = face === 3 ? 1 : -1;
      }
      const ribbon = Math.abs(lx) < g.w * 0.07 || Math.abs(lz) < g.d * 0.07;
      add(g.x + lx, FLOOR + ly, g.z + lz, nx, ny, nz, SOLID, ribbon ? [255, 240, 200] : g.c);
    }
  }
  return pts;
}

export function ChristmasAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts = buildScene();
    const snow = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.02 + Math.random() * 0.05,
      ch: Math.random() > 0.8 ? "*" : ".",
    }));
    let frame = 0;
    let alive = true;
    let visible = true;
    let last = 0;
    let zbuf = new Float32Array(0);
    let win = new Int32Array(0);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);

    // Arrastar gira a árvore; ao soltar ela segue no embalo e volta ao giro normal.
    const AUTO = reduce ? 0 : 0.35; // rad/s
    let angle = 0.6;
    let spin = AUTO;
    let dragX: number | null = null;
    let dragT = 0;
    const onDown = (e: PointerEvent) => {
      dragX = e.clientX;
      dragT = e.timeStamp;
      spin = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (dragX === null) return;
      const delta = (e.clientX - dragX) * 0.01;
      angle += delta;
      spin = delta / Math.max(0.016, (e.timeStamp - dragT) / 1000);
      dragX = e.clientX;
      dragT = e.timeStamp;
    };
    const onUp = () => {
      dragX = null;
      canvas.classList.remove("is-dragging");
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const draw = (time: number) => {
      if (!alive) return;
      frame = window.requestAnimationFrame(draw);
      const dt = Math.min(0.1, (time - last) / 1000);
      last = time;
      if (!visible) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const fontSize = Math.max(7, Math.floor(Math.min(width / 120, height / 70)));
      const family = getComputedStyle(document.body).fontFamily;
      ctx.font = `bold ${fontSize}px ${family}`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      const charW = Math.max(fontSize * 0.6, ctx.measureText("M").width);
      const charH = fontSize * 1.05;
      const usableH = height - fontSize * 3;
      const cols = Math.floor(width / charW);
      const rows = Math.floor(usableH / charH);
      const offsetX = (width - cols * charW) / 2;
      if (zbuf.length !== cols * rows) {
        zbuf = new Float32Array(cols * rows);
        win = new Int32Array(cols * rows);
      }
      zbuf.fill(Infinity);
      win.fill(-1);

      ctx.fillStyle = "#050806";
      ctx.fillRect(0, 0, width, height);

      for (const s of snow) {
        if (!reduce) {
          s.y += s.v * dt;
          s.x += Math.sin(time * 0.0007 + s.v * 90) * 0.004 * dt;
          if (s.y > 1) {
            s.y = 0;
            s.x = Math.random();
          }
        }
        ctx.fillStyle = `rgba(215,255,228,${0.25 + s.v * 8})`;
        ctx.fillText(s.ch, s.x * width, s.y * usableH);
      }

      if (dragX === null) {
        spin += (AUTO - spin) * Math.min(1, dt * 1.5);
        angle += spin * dt;
      }
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      const scale = Math.min((usableH * 0.82) / 2.1, (width * 0.85) / 1.9);
      const cx = width / 2;
      const cy = usableH * 0.5;

      for (let i = 0; i < pts.length; i += 1) {
        const p = pts[i];
        const x1 = p.x * ca - p.z * sa;
        const z1 = p.x * sa + p.z * ca;
        const y1 = p.y - MID;
        const y2 = y1 * ct - z1 * st;
        const z2 = y1 * st + z1 * ct;
        const persp = D / (z2 + D);
        const col = Math.floor((cx + x1 * scale * persp - offsetX) / charW);
        const row = Math.floor((cy - y2 * scale * persp) / charH);
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        const cell = row * cols + col;
        // lights win ties with the needles they sit on
        const depth = p.kind === LIGHT ? z2 - 0.05 : z2;
        if (depth < zbuf[cell]) {
          zbuf[cell] = depth;
          win[cell] = i;
        }
      }

      for (let cell = 0; cell < win.length; cell += 1) {
        const i = win[cell];
        if (i < 0) continue;
        const p = pts[i];
        let ch: string;
        let r: number;
        let g: number;
        let b: number;
        if (p.kind === LIGHT) {
          const tw = reduce ? 1 : 0.5 + 0.5 * Math.sin(time * 0.004 + p.phase);
          ch = tw > 0.55 ? "*" : "+";
          const k = 0.35 + 0.65 * tw;
          [r, g, b] = [p.color[0] * k, p.color[1] * k, p.color[2] * k];
        } else {
          const nx1 = p.nx * ca - p.nz * sa;
          const nz1 = p.nx * sa + p.nz * ca;
          const ny2 = p.ny * ct - nz1 * st;
          const nz2 = p.ny * st + nz1 * ct;
          const diff = Math.max(0, nx1 * LIGHT_DIR[0] + ny2 * LIGHT_DIR[1] + nz2 * LIGHT_DIR[2]);
          const lum = 0.15 + 0.85 * diff;
          const spec = p.kind === BALL ? Math.pow(Math.max(0, nx1 * HALF[0] + ny2 * HALF[1] + nz2 * HALF[2]), 24) : 0;
          ch = RAMP[Math.min(9, Math.max(1, Math.round(lum * 9)))];
          if (spec > 0.5) ch = "@";
          const k = 0.3 + 0.9 * lum;
          r = p.color[0] * k + spec * 255;
          g = p.color[1] * k + spec * 255;
          b = p.color[2] * k + spec * 255;
        }
        ctx.fillStyle = `rgb(${Math.min(255, r | 0)},${Math.min(255, g | 0)},${Math.min(255, b | 0)})`;
        ctx.fillText(ch, offsetX + (cell % cols) * charW, Math.floor(cell / cols) * charH);
      }

      // star: flat billboard that narrows as it "turns" with the tree
      const top = H + 0.07 - MID;
      const sz = top * st;
      const sp = D / (top * st + D);
      const sx = cx;
      const sy = cy - top * ct * scale * sp;
      const R = scale * 0.12 * (D / (sz + D));
      const wf = reduce ? 1 : 0.3 + 0.7 * Math.abs(Math.cos(angle * 2));
      const pulse = reduce ? 1 : 0.8 + 0.2 * Math.sin(time * 0.005);
      for (let row = Math.floor((sy - R) / charH); row <= (sy + R) / charH; row += 1) {
        for (let col = Math.floor((sx - R - offsetX) / charW); col <= (sx + R - offsetX) / charW; col += 1) {
          const dx = (offsetX + (col + 0.5) * charW - sx) / (R * wf);
          const dy = (row + 0.5) * charH - sy;
          const d = Math.hypot(dx, dy / R);
          const a = Math.atan2(dy, dx) + Math.PI / 2;
          const k = (((a / ((Math.PI * 2) / 5)) % 1) + 1) % 1;
          if (d > 0.42 + 0.58 * Math.abs(k - 0.5) * 2) continue;
          ctx.fillStyle = d < 0.35 ? `rgba(255,250,210,${pulse})` : `rgba(255,214,70,${pulse})`;
          ctx.fillText(d < 0.35 ? "@" : "*", offsetX + col * charW, row * charH);
        }
      }

      // Letreiro: FELIZ à esquerda e NATAL à direita; sem espaço nas laterais (celular), em cima e embaixo.
      const side = (width - scale * 1.75) / 2;
      const wide = side > width * 0.16;
      const signW = wide ? side * 0.86 : width * 0.8;
      const signFont = Math.max(4, signW / WORD_COLS / 0.6);
      const sw = signFont * 0.6;
      const sh = signFont * 1.02;
      const drawWord = (word: string, centerX: number, centerY: number, seed: number) => {
        const left = centerX - (WORD_COLS * sw) / 2;
        const top = centerY - (7 * sh) / 2;
        for (let li = 0; li < word.length; li += 1) {
          const glyph = GLYPHS[word[li]];
          for (let gy = 0; gy < 7; gy += 1) {
            for (let gx = 0; gx < 5; gx += 1) {
              if (glyph[gy][gx] !== "#") continue;
              const n = hash(seed + li * 7 + gx, gy);
              // cor anda pela palavra como pisca-pisca; brilho pisca por pixel
              const shift = reduce ? li : Math.floor(time / 450 + li + (gx + gy) * 0.12);
              const color = SIGN_COLORS[(shift + seed) % SIGN_COLORS.length];
              const tw = reduce ? 1 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * 0.005 + n * 12));
              ctx.globalAlpha = tw;
              ctx.fillStyle = color;
              ctx.shadowColor = color;
              const ch = tw > 0.9 ? "@" : n > 0.5 ? "#" : "*";
              const x = left + (li * 6 + gx) * 2 * sw;
              const y = top + gy * sh;
              ctx.fillText(ch, x, y);
              ctx.fillText(ch, x + sw, y);
            }
          }
        }
      };
      ctx.font = `bold ${signFont}px ${family}`;
      ctx.textAlign = "left";
      ctx.shadowBlur = signFont * 0.9;
      if (wide) {
        drawWord("FELIZ", side / 2, cy, 0);
        drawWord("NATAL", width - side / 2, cy, 3);
      } else {
        const gap = (height - (cy + scale * 1.05)) / 2;
        const treeTop = cy - scale * 1.2; // topo da estrela
        drawWord("FELIZ", width / 2, Math.max(7 * sh * 0.6, treeTop / 2), 0);
        drawWord("NATAL", width / 2, height - Math.max(7 * sh * 0.6, gap), 3);
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    frame = window.requestAnimationFrame(draw);
    return () => {
      alive = false;
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="xmas-screen" id="natal" aria-label="Árvore de Natal 3D em caracteres">
      <canvas ref={canvasRef} title="Arraste para girar a árvore" />
    </section>
  );
}
