import { useEffect, useRef } from "react";

/**
 * RelaxBackground
 * A layered, performant animated background with:
 * 1) Animated conic/radial gradient
 * 2) Blurred color blobs drifting slowly
 * 3) Subtle grain overlay
 * 4) Discreet floating particles (canvas)
 *
 * - Honors prefers-reduced-motion (disables animations)
 * - No heavy images, pure CSS + light JS
 */
export const RelaxBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; color: string }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Build palette from CSS variables for consistent theming
    const root = document.documentElement;
    const paletteVars = ["--palette-violet", "--palette-cyan", "--palette-mint", "--palette-amber"] as const;
    const colors = paletteVars
      .map((v) => getComputedStyle(root).getPropertyValue(v).trim())
      .filter(Boolean)
      .map((hsl) => `hsla(${hsl} / 0.14)`);

    // Fallback if vars not found
    const fallback = `hsla(${getComputedStyle(root).getPropertyValue("--accent").trim() || "270 70% 70%"} / 0.14)`;

    const initParticles = () => {
      const area = window.innerWidth * window.innerHeight;
      const maxCount = 60; // <= 80 per requirement, keep it lighter
      const baseCount = Math.max(24, Math.min(maxCount, Math.floor(area / 28000)));

      particlesRef.current = Array.from({ length: baseCount }, () => {
        const speed = 0.12 + Math.random() * 0.18; // very slow
        const dir = Math.random() * Math.PI * 2;
        const r = 0.8 + Math.random() * 2.2; // size in px
        const color = colors[Math.floor(Math.random() * colors.length)] || fallback;
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: Math.cos(dir) * speed,
          vy: Math.sin(dir) * speed,
          r,
          color,
        };
      });
    };

    initParticles();

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gentle composite for soft particles
      ctx.globalCompositeOperation = "lighter";

      for (const p of particlesRef.current) {
        // Update
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        // Draw
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!prefersReduced && rafRef.current == null) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    // Start animation unless reduced motion
    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // Draw a single static frame for fallback
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="respira-auth-bg" aria-hidden>
      {/* 1) Animated gradient layer */}
      <div className="layer-gradient" />

      {/* 2) Blurred drifting blobs */}
      <div className="layer-blobs">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
        <div className="blob blob--4" />
      </div>

      {/* 4) Particles (canvas) */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* 3) Grain overlay on top */}
      <div className="layer-grain" />
    </div>
  );
};

export default RelaxBackground;
