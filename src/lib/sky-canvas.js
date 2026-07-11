/** @param {HTMLCanvasElement} canvas @param {HTMLElement} bg */
export function initSkyCanvas(canvas, bg) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return () => {};

  const TAU = Math.PI * 2;
  const FOV = 1.05;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let milkyClouds = [];
  let meteors = [];
  let raf = 0;
  let nextMeteorAt = 0;
  let nextCometBurstAt = 0;
  let last = performance.now();

  let yaw = 0;
  let pitch = 0;
  let targetLookX = 0;
  let targetLookY = 0;
  let lookX = 0;
  let lookY = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let pointerActive = false;

  const depthParallax = { far: 0.85, mid: 1, near: 1.18 };
  const POINTER_RADIUS = 150;

  function wrapPi(a) {
    a = ((a + Math.PI) % TAU + TAU) % TAU;
    return a - Math.PI;
  }

  function starCount() {
    const area = width * height;
    return Math.min(480, Math.max(260, Math.floor(area / 3200)));
  }

  function pickStarColor() {
    const roll = Math.random();
    if (roll < 0.38) {
      return {
        r: 232 + Math.floor(Math.random() * 18),
        g: 238 + Math.floor(Math.random() * 12),
        b: 255,
      };
    }
    if (roll < 0.62) {
      return {
        r: 248 + Math.floor(Math.random() * 7),
        g: 248 + Math.floor(Math.random() * 7),
        b: 250 + Math.floor(Math.random() * 5),
      };
    }
    if (roll < 0.8) {
      return {
        r: 255,
        g: 240 + Math.floor(Math.random() * 12),
        b: 220 + Math.floor(Math.random() * 18),
      };
    }
    if (roll < 0.92) {
      return {
        r: 255,
        g: 220 + Math.floor(Math.random() * 18),
        b: 210 + Math.floor(Math.random() * 20),
      };
    }
    return {
      r: 230 + Math.floor(Math.random() * 15),
      g: 255,
      b: 235 + Math.floor(Math.random() * 12),
    };
  }

  function createMilkyClouds() {
    const bandTilt = 0.34;
    const clouds = [];

    function bandLat(lon, spread) {
      return (
        Math.sin(lon) * bandTilt +
        Math.sin(lon * 2.4) * 0.05 +
        (Math.random() - 0.5) * spread
      );
    }

    function tint() {
      const roll = Math.random();
      if (roll < 0.4) return [195, 205, 235]; // azul frio
      if (roll < 0.7) return [220, 222, 235]; // branco leitoso
      if (roll < 0.88) return [200, 185, 205]; // lavanda / poeira
      return [180, 170, 155]; // poeira quente sutil
    }

    /* Camada 1: nebulosas grandes e difusas */
    for (let i = 0; i < 28; i += 1) {
      const lon = (i / 28) * TAU + (Math.random() - 0.5) * 0.2;
      clouds.push({
        kind: "nebula",
        lon,
        lat: bandLat(lon, 0.1),
        r: 70 + Math.random() * 110,
        alpha: 0.028 + Math.random() * 0.03,
        stretch: 1.05 + Math.random() * 0.35,
        angle: -0.35 + (Math.random() - 0.5) * 0.25,
        tint: tint(),
        parallax: 0.78 + Math.random() * 0.12,
      });
    }

    /* Camada 2: aglomerados de poeira */
    for (let i = 0; i < 55; i += 1) {
      const lon = Math.random() * TAU;
      clouds.push({
        kind: "clump",
        lon,
        lat: bandLat(lon, 0.14),
        r: 22 + Math.random() * 48,
        alpha: 0.035 + Math.random() * 0.045,
        stretch: 1 + Math.random() * 0.4,
        angle: (Math.random() - 0.5) * 0.8,
        tint: tint(),
        parallax: 0.82 + Math.random() * 0.14,
      });
    }

    /* Camada 3: grãos finos (poeira + estrelas de fundo densas) */
    for (let i = 0; i < 280; i += 1) {
      const lon = Math.random() * TAU;
      const nearCore = Math.random() < 0.35;
      clouds.push({
        kind: "grain",
        lon,
        lat: bandLat(lon, nearCore ? 0.08 : 0.2),
        r: nearCore ? 0.7 + Math.random() * 1.6 : 0.35 + Math.random() * 1.1,
        alpha: nearCore ? 0.14 + Math.random() * 0.22 : 0.06 + Math.random() * 0.12,
        glow: 3 + Math.random() * 7,
        glowAlpha: 0.015 + Math.random() * 0.025,
        tint: tint(),
        parallax: 0.88 + Math.random() * 0.12,
      });
    }

    /* Camada 4: faixas escuras (lanes de poeira) */
    for (let i = 0; i < 14; i += 1) {
      const lon = (i / 14) * TAU + (Math.random() - 0.5) * 0.15;
      clouds.push({
        kind: "lane",
        lon,
        lat: bandLat(lon, 0.06),
        r: 40 + Math.random() * 70,
        alpha: 0.045 + Math.random() * 0.04,
        stretch: 1.2 + Math.random() * 0.5,
        angle: -0.4 + (Math.random() - 0.5) * 0.2,
        parallax: 0.8 + Math.random() * 0.1,
      });
    }

    milkyClouds = clouds;
  }

  function drawMilkyWay() {
    const scale = 0.55 + Math.min(width, height) / 1600;

    for (const cloud of milkyClouds) {
      const p = project(cloud.lon, cloud.lat, cloud.parallax);
      if (!p.visible) continue;

      if (cloud.kind === "grain") {
        const [cr, cg, cb] = cloud.tint;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, cloud.glow);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${cloud.glowAlpha})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, cloud.glow, 0, TAU);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${cloud.alpha})`;
        ctx.arc(p.x, p.y, cloud.r, 0, TAU);
        ctx.fill();
        continue;
      }

      const rx = cloud.r * cloud.stretch * scale;
      const ry = cloud.r * (0.72 + (1.15 - cloud.stretch) * 0.4) * scale;
      const [cr, cg, cb] = cloud.tint || [0, 0, 0];

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(cloud.angle || 0);

      if (cloud.kind === "lane") {
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
        g.addColorStop(0, `rgba(2,3,8,${cloud.alpha})`);
        g.addColorStop(0.55, `rgba(2,3,8,${cloud.alpha * 0.35})`);
        g.addColorStop(1, "rgba(2,3,8,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry * 0.55, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
        continue;
      }

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${cloud.alpha})`);
      g.addColorStop(0.35, `rgba(${cr},${cg},${cb},${cloud.alpha * 0.45})`);
      g.addColorStop(0.7, `rgba(${cr},${cg},${cb},${cloud.alpha * 0.12})`);
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  function createStars() {
    const count = starCount();
    const bandTilt = 0.34;
    stars = Array.from({ length: count }, () => {
      const roll = Math.random();
      const depth = roll < 0.62 ? "far" : roll < 0.9 ? "mid" : "near";
      const color = pickStarColor();
      const lon = Math.random() * TAU;
      /* ~40% das estrelas ficam perto da faixa da Via Láctea */
      const inBand = Math.random() < 0.4;
      const lat = inBand
        ? Math.sin(lon) * bandTilt +
          Math.sin(lon * 2.4) * 0.05 +
          (Math.random() - 0.5) * 0.18
        : (Math.random() - 0.5) * Math.PI * 0.92;
      const canBlink =
        depth === "near" ||
        (depth === "mid" && Math.random() < 0.55) ||
        (depth === "far" && Math.random() < 0.06);

      const base =
        depth === "near"
          ? {
              r: 1.05 + Math.random() * 0.65,
              base: 0.62 + Math.random() * 0.28,
              amp: 0.07 + Math.random() * 0.09,
              glow: 2.2 + Math.random() * 1.2,
              spikeScale: 1.4,
            }
          : depth === "mid"
            ? {
                r: 0.55 + Math.random() * 0.7,
                base: 0.4 + Math.random() * 0.32,
                amp: 0.06 + Math.random() * 0.09,
                glow: 1.4 + Math.random() * 0.9,
                spikeScale: 1.05,
              }
            : {
                r: 0.28 + Math.random() * 0.45,
                base: 0.22 + Math.random() * 0.28,
                amp: 0.05 + Math.random() * 0.08,
                glow: 0.85 + Math.random() * 0.5,
                spikeScale: 0.7,
              };

      return {
        depth,
        lon,
        lat,
        ...base,
        speed: 0.035 + Math.random() * 0.08,
        phase: Math.random() * TAU,
        canBlink,
        flare: 0,
        flareState: "idle",
        flareHold: 0,
        flareRise: 0.55 + Math.random() * 0.45,
        flareFall: 0.4 + Math.random() * 0.35,
        nextBlinkAt: performance.now() + 400 + Math.random() * 9000,
        blinkGap: 2.8 + Math.random() * 7.5,
        spikeAngle: (Math.random() - 0.5) * 0.4,
        color,
        chromaSpeed: 0.15 + Math.random() * 0.35,
        chromaPhase: Math.random() * TAU,
        chromaAmt: 2 + Math.random() * 6,
      };
    });

    const order = { far: 0, mid: 1, near: 2 };
    stars.sort((a, b) => order[a.depth] - order[b.depth]);

    /* Só 1–2 já piscando no começo */
    const blinkers = stars.filter((s) => s.canBlink);
    for (let i = 0; i < Math.min(2, blinkers.length); i += 1) {
      const star = blinkers[(Math.random() * blinkers.length) | 0];
      star.flareState = "rise";
      star.flare = Math.random() * 0.4;
      star.nextBlinkAt = performance.now() + star.blinkGap * 1000;
    }
  }

  function project(lon, lat, parallax) {
    const dLon = wrapPi(lon - yaw * parallax - lookX * parallax * 0.55);
    const dLat = lat - pitch - lookY * parallax * 0.35;
    const cosLat = Math.cos(dLat);
    const xNdc = (dLon * cosLat) / FOV;
    const yNdc = dLat / (FOV * 0.78);
    return {
      x: (xNdc * 0.5 + 0.5) * width,
      y: (yNdc * 0.5 + 0.5) * height,
      visible: Math.abs(xNdc) < 1.35 && Math.abs(yNdc) < 1.35 && cosLat > 0.08,
    };
  }

  function starFill(star, alpha, boost = 0, hueShift = null) {
    if (hueShift) {
      const { r, g, b } = hueShift;
      return `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
    }
    const c = star.color;
    const wobble = Math.sin(star.chromaPhase) * star.chromaAmt;
    const r = Math.min(255, Math.max(200, c.r + wobble * 0.9 + boost));
    const g = Math.min(
      255,
      Math.max(200, c.g + Math.sin(star.chromaPhase + 2.1) * star.chromaAmt * 0.7 + boost * 0.4)
    );
    const b = Math.min(255, Math.max(200, c.b - wobble * 0.75 + boost * 0.2));
    return `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
  }

  function mouseHue(angle, phase) {
    const hues = [
      [61, 255, 200],
      [200, 245, 66],
      [120, 200, 255],
      [255, 120, 200],
      [255, 200, 90],
      [180, 130, 255],
      [90, 255, 160],
      [255, 90, 120],
    ];
    const t = (((angle / TAU) + phase) % 1 + 1) % 1;
    const scaled = t * hues.length;
    const idx = Math.floor(scaled) % hues.length;
    const next = hues[(idx + 1) % hues.length];
    const cur = hues[idx];
    const f = scaled - Math.floor(scaled);
    return {
      r: cur[0] + (next[0] - cur[0]) * f,
      g: cur[1] + (next[1] - cur[1]) * f,
      b: cur[2] + (next[2] - cur[2]) * f,
    };
  }

  function spawnMeteor(overrides = {}) {
    const lon = yaw + (Math.random() - 0.35) * 1.4;
    const lat = (Math.random() - 0.55) * 0.9;
    const angle = (24 + Math.random() * 32) * (Math.PI / 180);
    const speed = 0.55 + Math.random() * 0.45;
    meteors.push({
      lon,
      lat,
      vLon: Math.cos(angle) * speed,
      vLat: Math.sin(angle) * speed,
      life: 0,
      maxLife: 0.55 + Math.random() * 0.45,
      len: 0.045 + Math.random() * 0.06,
      width: 0.8 + Math.random() * 0.7,
      parallax: 1.05 + Math.random() * 0.35,
      palette: "white",
      ...overrides,
    });
  }

  /* Chuva tipo Perseidas: 8 trilhas longas e paralelas atravessando o céu */
  function spawnGreenCometBurst() {
    const angle = (14 + Math.random() * 10) * (Math.PI / 180);
    const count = 8;
    const radiantLon = yaw - 1.05;
    const radiantLat = 0.62;
    const speed = 1.65 + Math.random() * 0.35;

    for (let i = 0; i < count; i += 1) {
      const slot = i / (count - 1);
      const along = 0.2 + slot * 0.95 + (Math.random() - 0.5) * 0.06;
      const perp = (slot - 0.5) * 1.55 + (Math.random() - 0.5) * 0.1;
      const lon =
        radiantLon + Math.cos(angle) * along - Math.sin(angle) * perp;
      const lat =
        radiantLat + Math.sin(angle) * along * 0.72 + Math.cos(angle) * perp * 0.55;

      spawnMeteor({
        lon,
        lat,
        vLon: Math.cos(angle) * (speed + (Math.random() - 0.5) * 0.12),
        vLat: Math.sin(angle) * (speed * 0.78 + (Math.random() - 0.5) * 0.08),
        life: -(i * 0.11 + Math.random() * 0.04),
        maxLife: 1.05 + Math.random() * 0.35,
        len: 0.2 + Math.random() * 0.12,
        width: 1.05 + Math.random() * 0.75,
        parallax: 1.08 + Math.random() * 0.2,
        palette: "green",
      });
    }
  }

  function syncBgLayers() {
    const tilt = (pitch + lookY * 0.5) * height * 0.04;
    bg.style.setProperty("--sky-look-x", String(lookX));
    bg.style.setProperty("--sky-look-y", String(lookY));
    bg.style.setProperty("--sky-pitch", `${tilt}px`);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
    createMilkyClouds();
    meteors = [];
    nextMeteorAt = performance.now() + 1800;
    nextCometBurstAt = performance.now() + 2800;
    syncBgLayers();
  }

  function drawStarAt(star, x, y, alpha, flareCurve, mouseBoost = 0, hue = null) {
    const energy = Math.max(flareCurve, mouseBoost * 0.95);
    if (energy > 0.04) {
      const glowR = star.r * star.glow * (0.9 + energy * 2.6 + mouseBoost * 3.2);
      const glowAlpha = energy * (star.depth === "near" ? 0.55 : 0.38) + mouseBoost * 0.45;

      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      glow.addColorStop(
        0,
        starFill(star, Math.min(0.95, glowAlpha * 1.55), 10 + energy * 14, hue)
      );
      glow.addColorStop(0.4, starFill(star, glowAlpha * 0.5, 4, hue));
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.fillStyle = glow;
      ctx.arc(x, y, glowR, 0, TAU);
      ctx.fill();

      if (mouseBoost > 0.2 && hue) {
        const ringHue = mouseHue(star.chromaPhase + 1.7, mouseBoost);
        const ring = ctx.createRadialGradient(x, y, glowR * 0.35, x, y, glowR * 1.55);
        ring.addColorStop(
          0,
          `rgba(${ringHue.r | 0},${ringHue.g | 0},${ringHue.b | 0},0)`
        );
        ring.addColorStop(
          0.55,
          `rgba(${ringHue.r | 0},${ringHue.g | 0},${ringHue.b | 0},${0.22 * mouseBoost})`
        );
        ring.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.fillStyle = ring;
        ctx.arc(x, y, glowR * 1.55, 0, TAU);
        ctx.fill();
      }

      const scale = star.spikeScale || 1;
      const len =
        (5 + energy * (star.depth === "near" ? 15 : star.depth === "mid" ? 10 : 6) + mouseBoost * 10) *
        scale;
      const thin = 0.65 + energy * (star.depth === "near" ? 0.8 : 0.4) + mouseBoost * 0.5;
      const spikeAlpha = 0.2 + energy * 0.6 + mouseBoost * 0.35;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(star.spikeAngle + mouseBoost * star.chromaPhase * 0.15);
      ctx.lineCap = "round";
      drawSpike(len, thin, spikeAlpha, energy, hue);
      ctx.rotate(Math.PI / 2);
      drawSpike(
        len * (star.depth === "near" ? 0.7 : 0.48),
        thin * 0.7,
        spikeAlpha * 0.7,
        energy,
        hue
      );
      if (energy > 0.55 && (star.depth === "near" || mouseBoost > 0.45)) {
        ctx.rotate(Math.PI / 4);
        drawSpike(len * 0.36, thin * 0.4, spikeAlpha * 0.32, energy, hue);
      }
      ctx.restore();
    }

    ctx.beginPath();
    ctx.fillStyle = starFill(
      star,
      Math.min(1, alpha + energy * 0.35 + mouseBoost * 0.4),
      energy * (star.depth === "near" ? 14 : 8) + mouseBoost * 20,
      hue
    );
    ctx.arc(x, y, star.r * (1 + energy * 0.28 + mouseBoost * 0.7), 0, TAU);
    ctx.fill();

    if (energy > 0.4 || mouseBoost > 0.35) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.25 + energy * 0.55 + mouseBoost * 0.35})`;
      ctx.arc(x, y, Math.max(0.4, star.r * 0.32), 0, TAU);
      ctx.fill();
    }
  }

  function drawSpike(len, thin, alpha, flareCurve, hue = null) {
    const grad = ctx.createLinearGradient(-len, 0, len, 0);
    const mid = hue
      ? `rgba(${hue.r | 0},${hue.g | 0},${hue.b | 0},${alpha})`
      : `rgba(255,248,240,${alpha})`;
    const core = `rgba(255,255,255,${Math.min(1, alpha * 1.25)})`;
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.35, mid);
    grad.addColorStop(0.5, core);
    grad.addColorStop(0.65, mid);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = thin * (1 + flareCurve * 0.35);
    ctx.beginPath();
    ctx.moveTo(-len, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();
  }

  function drawStaticSky() {
    ctx.clearRect(0, 0, width, height);
    drawMilkyWay();
    for (const star of stars) {
      const p = project(star.lon, star.lat, depthParallax[star.depth]);
      if (!p.visible) continue;
      const a = Math.min(1, Math.max(0.12, star.base));
      drawStarAt(star, p.x, p.y, a, 0);
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    yaw += dt * 0.042;
    pitch = Math.sin(now * 0.00012) * 0.035;

    lookX += (targetLookX - lookX) * Math.min(1, dt * 3.2);
    lookY += (targetLookY - lookY) * Math.min(1, dt * 3.2);
    syncBgLayers();

    ctx.clearRect(0, 0, width, height);
    drawMilkyWay();

    let activeBlinks = 0;
    for (const star of stars) {
      if (star.flareState !== "idle") activeBlinks += 1;
    }

    const MAX_BLINKS = 4;

    for (const star of stars) {
      star.phase += star.speed * dt;
      star.chromaPhase += star.chromaSpeed * dt;

      let twinkle = star.base + Math.sin(star.phase) * star.amp;

      if (star.canBlink && star.flareState === "idle" && now >= star.nextBlinkAt) {
        if (activeBlinks < MAX_BLINKS) {
          star.flareState = "rise";
          activeBlinks += 1;
          star.nextBlinkAt =
            now + (star.blinkGap + Math.random() * star.blinkGap * 0.6) * 1000;
        } else {
          star.nextBlinkAt = now + 180 + Math.random() * 520;
        }
      }

      if (star.flareState === "rise") {
        star.flare = Math.min(1, star.flare + star.flareRise * dt);
        if (star.flare >= 1) {
          star.flare = 1;
          star.flareState = "hold";
          star.flareHold = 0.12 + Math.random() * 0.28;
        }
      } else if (star.flareState === "hold") {
        star.flareHold -= dt;
        if (star.flareHold <= 0) star.flareState = "fall";
      } else if (star.flareState === "fall") {
        star.flare = Math.max(0, star.flare - star.flareFall * dt);
        if (star.flare <= 0) {
          star.flare = 0;
          star.flareState = "idle";
        }
      }

      const flareCurve = star.flare * star.flare * (3 - 2 * star.flare);
      twinkle += flareCurve * (star.depth === "near" ? 0.58 : 0.4);

      const alpha = Math.min(1, Math.max(0.05, twinkle));
      const p = project(star.lon, star.lat, depthParallax[star.depth]);
      if (!p.visible) continue;

      let mouseBoost = 0;
      let hue = null;
      if (pointerActive) {
        const dx = p.x - pointerX;
        const dy = p.y - pointerY;
        const dist = Math.hypot(dx, dy);
        if (dist < POINTER_RADIUS) {
          mouseBoost = Math.pow(1 - dist / POINTER_RADIUS, 1.35);
          const ang = Math.atan2(dy, dx);
          hue = mouseHue(ang + star.chromaPhase * 0.35, now * 0.00035);
          star.chromaPhase += dt * (1.8 + mouseBoost * 4);
        }
      }

      drawStarAt(star, p.x, p.y, alpha, flareCurve, mouseBoost, hue);
    }

    if (now >= nextCometBurstAt && meteors.length < 3) {
      spawnGreenCometBurst();
      nextCometBurstAt = now + 7000 + Math.random() * 9000;
      nextMeteorAt = now + 2500;
    } else if (now >= nextMeteorAt && meteors.length < 2) {
      spawnMeteor();
      nextMeteorAt = now + 4500 + Math.random() * 8000;
    }

    meteors = meteors.filter((m) => {
      m.life += dt;
      if (m.life < 0) return true;

      m.lon += m.vLon * dt;
      m.lat += m.vLat * dt;

      const t = m.life / m.maxLife;
      if (t >= 1) return false;

      const fade = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;
      const alpha = Math.max(0, fade);
      const head = project(m.lon, m.lat, m.parallax);
      const tail = project(m.lon - m.vLon * m.len, m.lat - m.vLat * m.len, m.parallax);
      if (!head.visible && !tail.visible) return true;

      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      if (m.palette === "green") {
        grad.addColorStop(0, "rgba(20,80,50,0)");
        grad.addColorStop(0.15, `rgba(40,160,100,${0.12 * alpha})`);
        grad.addColorStop(0.45, `rgba(80,230,150,${0.42 * alpha})`);
        grad.addColorStop(0.78, `rgba(180,255,90,${0.78 * alpha})`);
        grad.addColorStop(0.92, `rgba(230,255,190,${0.95 * alpha})`);
        grad.addColorStop(1, `rgba(255,255,240,${alpha})`);
      } else {
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.4, `rgba(190,210,255,${0.18 * alpha})`);
        grad.addColorStop(0.75, `rgba(255,245,235,${0.55 * alpha})`);
        grad.addColorStop(1, `rgba(255,255,255,${0.95 * alpha})`);
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = m.palette === "green" ? m.width * 0.85 : m.width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.stroke();

      if (m.palette === "green") {
        /* trilha fotográfica secundária, mais fina */
        ctx.strokeStyle = `rgba(200,255,140,${0.22 * alpha})`;
        ctx.lineWidth = Math.max(0.6, m.width * 0.28);
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.fillStyle =
        m.palette === "green"
          ? `rgba(235,255,200,${alpha})`
          : `rgba(255,252,245,${alpha})`;
      ctx.arc(head.x, head.y, m.width * (m.palette === "green" ? 1.15 : 1.1), 0, TAU);
      ctx.fill();

      if (m.palette === "green") {
        const glow = ctx.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          m.width * 7
        );
        glow.addColorStop(0, `rgba(200,245,66,${0.4 * alpha})`);
        glow.addColorStop(0.45, `rgba(61,255,200,${0.12 * alpha})`);
        glow.addColorStop(1, "rgba(61,255,200,0)");
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(head.x, head.y, m.width * 7, 0, TAU);
        ctx.fill();
      }

      return true;
    });

    raf = requestAnimationFrame(frame);
  }

  function onPointerMove(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerActive = true;
    const x = event.clientX / width;
    const y = event.clientY / height;
    targetLookX = (x - 0.5) * 0.42;
    targetLookY = (y - 0.5) * 0.22;
  }

  function onPointerLeave() {
    pointerActive = false;
    pointerX = -9999;
    pointerY = -9999;
    targetLookX = 0;
    targetLookY = 0;
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    drawStaticSky();
    return () => {
      window.removeEventListener("resize", resize);
    };
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave);

  nextMeteorAt = performance.now() + 2200;
  nextCometBurstAt = performance.now() + 1600;
  raf = requestAnimationFrame(frame);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (!reduceMotion) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerleave", onPointerLeave);
  };
}
