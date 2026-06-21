import { useEffect, useRef, useCallback } from "react";

/* ── types ── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  hue: number;
  layer: number;
}

interface Connection {
  from: Particle;
  to: Particle;
  dist: number;
  alpha: number;
}

/* ── constants ── */
const MAX_DIST = 150;
const MOUSE_RADIUS = 120;
const REPEL_FORCE = 0.8;
const PARTICLE_COUNT_BASE = 100;
const LAYER_COUNTS = [30, 45, 25];
const SPEED_RANGES: [number, number][] = [
  [0.1, 0.25],
  [0.15, 0.4],
  [0.3, 0.7],
];
const RADIUS_RANGES: [number, number][] = [
  [0.8, 1.6],
  [1.2, 2.4],
  [1.8, 3.2],
];
const OPACITY_RANGES: [number, number][] = [
  [0.4, 0.7],
  [0.6, 0.9],
  [0.8, 1],
];
const HUE_RANGE: [number, number] = [220, 260];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export function NeuralBackground({
  density = 60,
  className = "",
  interactive = true,
  zIndex = "0",
}: {
  density?: number;
  className?: string;
  interactive?: boolean;
  zIndex?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimensionsRef = useRef({ w: 0, h: 0, dpr: 1 });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxRef.current = ctx;
    }
    dimensionsRef.current = { w, h, dpr };
    initParticles(w, h, density);
  }, [density]);

  const initParticles = useCallback(
    (w: number, h: number, densityVal: number) => {
      const factor = densityVal / 60;
      const total = Math.max(40, Math.floor(PARTICLE_COUNT_BASE * factor));
      const counts = LAYER_COUNTS.map((c) => Math.floor((c / 100) * total));
      const newParticles: Particle[] = [];

      for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < counts[layer]; i++) {
          newParticles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * SPEED_RANGES[layer][1] * 2,
            vy: (Math.random() - 0.5) * SPEED_RANGES[layer][1] * 2,
            radius: rand(...RADIUS_RANGES[layer]),
            baseRadius: rand(...RADIUS_RANGES[layer]),
            opacity: rand(...OPACITY_RANGES[layer]),
            hue: rand(...HUE_RANGE),
            layer,
          });
        }
      }
      particlesRef.current = newParticles;
    },
    [],
  );

  const onMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resize();
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
    }

    let lastTime = 0;

    const animate = (time: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { w, h } = dimensionsRef.current;
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;

      // Soft radial background directly on canvas (no inline style needed)
      const bgGrad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.8,
      );
      bgGrad.addColorStop(0, "rgba(15, 15, 30, 0.95)");
      bgGrad.addColorStop(0.5, "rgba(10, 10, 25, 0.9)");
      bgGrad.addColorStop(1, "rgba(5, 5, 15, 0.8)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx * (delta / 16);
          p.y += p.vy * (delta / 16);

          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;

          if (interactive && mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
              const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
              const angle = Math.atan2(dy, dx);
              p.x += Math.cos(angle) * force * REPEL_FORCE * (delta / 16);
              p.y += Math.sin(angle) * force * REPEL_FORCE * (delta / 16);
              p.radius = p.baseRadius * (1 + force * 1.5);
            } else {
              p.radius += (p.baseRadius - p.radius) * 0.1;
            }
          } else {
            p.radius += (p.baseRadius - p.radius) * 0.1;
          }
        }
      }

      // Spatial hashing for connections
      const connections: Connection[] = [];
      const cellSize = MAX_DIST;
      const grid = new Map<string, Particle[]>();

      for (const p of particles) {
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const key = `${cx},${cy}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(p);
      }

      const checkedPairs = new Set<string>();
      for (const [key, cellParticles] of grid) {
        const [cx, cy] = key.split(",").map(Number);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const neighborKey = `${cx + dx},${cy + dy}`;
            const neighborParticles = grid.get(neighborKey);
            if (!neighborParticles) continue;
            for (const a of cellParticles) {
              for (const b of neighborParticles) {
                if (a === b) continue;
                const id =
                  a.x < b.x
                    ? `${a.x},${a.y}-${b.x},${b.y}`
                    : `${b.x},${b.y}-${a.x},${a.y}`;
                if (checkedPairs.has(id)) continue;
                checkedPairs.add(id);

                const dx2 = a.x - b.x;
                const dy2 = a.y - b.y;
                const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist < MAX_DIST) {
                  const alpha = 1 - dist / MAX_DIST;
                  connections.push({ from: a, to: b, dist, alpha });
                }
              }
            }
          }
        }
      }

      for (const conn of connections) {
        const { from, to, alpha } = conn;
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `hsla(${from.hue}, 80%, 70%, ${alpha * 0.35})`);
        grad.addColorStop(1, `hsla(${to.hue}, 80%, 70%, ${alpha * 0.25})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.min(1.5, alpha * 1.5);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }

      for (const p of particles) {
        const glowRadius = p.radius * 3;
        const glowGrad = ctx.createRadialGradient(
          p.x,
          p.y,
          p.radius * 0.5,
          p.x,
          p.y,
          glowRadius,
        );
        glowGrad.addColorStop(
          0,
          `hsla(${p.hue}, 90%, 70%, ${p.opacity * 0.6})`,
        );
        glowGrad.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity})`;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 65%, 0.8)`;
        ctx.shadowBlur = 6 * p.opacity;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (interactive && mouse.active) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          50,
        );
        mouseGlow.addColorStop(0, "rgba(129, 140, 248, 0.15)");
        mouseGlow.addColorStop(1, "rgba(129, 140, 248, 0)");
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      if (interactive) {
        window.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [resize, interactive, onMouseMove, onMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ zIndex, background: "transparent" }}
      aria-hidden
    />
  );
}
