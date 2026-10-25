/**
 * Névoa lenta + poucas partículas verdes subindo, num canvas fixo atrás do conteúdo.
 */

type Puff = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  alpha: number;
  sprite: number;
};

type Mote = {
  x: number;
  y: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  phase: number;
};

const TAU = Math.PI * 2;

function makeSprite(seed: number) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let i = 0; i < 14; i++) {
    // Mantém cada círculo dentro do sprite para não aparecer borda reta.
    const x = size / 2 + (rand() - 0.5) * size * 0.3;
    const y = size / 2 + (rand() - 0.5) * size * 0.3;
    const r = size * (0.14 + rand() * 0.18);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255,255,255,0.22)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.08)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
  }

  g.globalCompositeOperation = "source-in";
  g.fillStyle = "rgb(170, 196, 184)";
  g.fillRect(0, 0, size, size);
  return c;
}

function makeMoteSprite() {
  const size = 16;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(167, 243, 208, 1)");
  grad.addColorStop(0.35, "rgba(52, 211, 153, 0.5)");
  grad.addColorStop(1, "rgba(52, 211, 153, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function initSmokeCanvas(canvas: HTMLCanvasElement) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return () => {};

  const sprites = [makeSprite(1), makeSprite(2), makeSprite(3)];
  const moteSprite = makeMoteSprite();
  let width = 0;
  let height = 0;
  let puffs: Puff[] = [];
  let motes: Mote[] = [];
  let raf = 0;
  let last = performance.now();
  let seededWidth = -1;

  function spawnPuff(initial: boolean): Puff {
    const r = Math.max(width, height) * (0.22 + Math.random() * 0.28);
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + r * 0.6,
      r,
      vx: (Math.random() - 0.5) * 6,
      vy: -(3 + Math.random() * 6),
      rot: Math.random() * TAU,
      vr: (Math.random() - 0.5) * 0.03,
      alpha: 0.03 + Math.random() * 0.05,
      sprite: Math.floor(Math.random() * sprites.length),
    };
  }

  function spawnMote(initial: boolean): Mote {
    const maxLife = 8 + Math.random() * 8;
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 10,
      vy: -(8 + Math.random() * 14),
      size: 0.6 + Math.random() * 1.2,
      life: initial ? Math.random() * maxLife : 0,
      maxLife,
      phase: Math.random() * TAU,
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    // Névoa e partículas são suaves: 1x de resolução basta.
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Barra de endereço do mobile muda só a altura: não recria as partículas.
    if (width === seededWidth) return;
    seededWidth = width;
    puffs = Array.from({ length: width < 768 ? 5 : 8 }, () => spawnPuff(true));
    motes = Array.from({ length: width < 768 ? 12 : 22 }, () => spawnMote(true));
  }

  function draw(dt: number) {
    ctx!.clearRect(0, 0, width, height);
    ctx!.globalCompositeOperation = "lighter";

    for (const p of puffs) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.y < -p.r * 1.2) Object.assign(p, spawnPuff(false));

      ctx!.save();
      ctx!.globalAlpha = p.alpha;
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.drawImage(sprites[p.sprite], -p.r, -p.r, p.r * 2, p.r * 2);
      ctx!.restore();
    }

    for (const m of motes) {
      m.life += dt;
      m.phase += dt;
      m.y += m.vy * dt;
      if (m.life > m.maxLife || m.y < -10) Object.assign(m, spawnMote(false));

      const x = m.x + Math.sin(m.phase) * 6;
      const a = Math.sin(Math.PI * (m.life / m.maxLife)) * 0.7;
      const r = m.size * 4;
      ctx!.globalAlpha = Math.max(0, a);
      ctx!.drawImage(moteSprite, x - r, m.y - r, r * 2, r * 2);
    }

    ctx!.globalAlpha = 1;
    ctx!.globalCompositeOperation = "source-over";
  }

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    draw(dt);
    raf = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    draw(0);
    return () => window.removeEventListener("resize", resize);
  }

  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}
