"use client";

import { useEffect, useRef } from "react";

type Circle = {
  x: number;
  y: number;
  r: number;
  baseR: number;
  vx: number;
  vy: number;
  phase: number;
  tone: "ember" | "bone";
};

const TONES: Record<Circle["tone"], string> = {
  ember: "200, 101, 27", // #c8651b
  bone: "232, 225, 212", // #e8e1d4
};

/**
 * Faint drifting rings that pulse and ease away from the cursor.
 * Decorative only: aria-hidden, pointer-events-none, reduced-motion safe,
 * and paused while off-screen. No dependency.
 */
export function CircleField({ count = 16 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasMaybe = canvasRef.current;
    if (!canvasMaybe) return;
    const canvas: HTMLCanvasElement = canvasMaybe;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return; // e.g. jsdom / unsupported — render nothing, no crash
    const c2d = ctx;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    const circles: Circle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      circles.length = 0;
      for (let i = 0; i < count; i++) {
        const baseR = 18 + Math.random() * 72;
        circles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: baseR,
          baseR,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          phase: Math.random() * Math.PI * 2,
          tone: Math.random() < 0.4 ? "ember" : "bone",
        });
      }
    }

    function draw(t: number) {
      c2d.clearRect(0, 0, width, height);
      for (const c of circles) {
        c.r = c.baseR + Math.sin(t * 0.0006 + c.phase) * c.baseR * 0.22;
        c.x += c.vx;
        c.y += c.vy;

        const margin = c.baseR;
        if (c.x < -margin) c.x = width + margin;
        if (c.x > width + margin) c.x = -margin;
        if (c.y < -margin) c.y = height + margin;
        if (c.y > height + margin) c.y = -margin;

        if (mouse.active) {
          const dx = c.x - mouse.x;
          const dy = c.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const reach = 170;
          if (dist < reach && dist > 0.01) {
            const push = (1 - dist / reach) * 0.9;
            c.x += (dx / dist) * push;
            c.y += (dy / dist) * push;
          }
        }

        c2d.beginPath();
        c2d.arc(c.x, c.y, Math.max(c.r, 1), 0, Math.PI * 2);
        c2d.strokeStyle = `rgba(${TONES[c.tone]}, ${c.tone === "ember" ? 0.1 : 0.07})`;
        c2d.lineWidth = 1.25;
        c2d.stroke();
      }
    }

    function loop(t: number) {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    }

    resize();
    seed();

    if (reduce) {
      draw(0); // static frame, no animation
    } else {
      raf = requestAnimationFrame(loop);
    }

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        resize();
        seed();
        if (reduce) draw(0);
      });
      ro.observe(canvas);
    }

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        threshold: 0,
      });
      io.observe(canvas);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    }
    if (!reduce) window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
