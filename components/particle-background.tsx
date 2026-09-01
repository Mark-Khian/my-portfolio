"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { useCoarsePointer } from "@/lib/use-media-query";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const PARTICLE_COUNT_DESKTOP = 80;
const PARTICLE_COUNT_MOBILE = 18;
const CONNECTION_DISTANCE_DESKTOP = 140;
const CONNECTION_DISTANCE_MOBILE = 90;
const CURSOR_ATTRACT_RADIUS = 160;
const CURSOR_ATTRACT_STRENGTH = 0.012;
const SPEED = 0.3;
const MOBILE_FRAME_INTERVAL_MS = 1000 / 30;
const SCROLL_IDLE_MS = 120;

export function ParticleBackground() {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const pausedRef = useRef(false);
  const scrollPausedRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const scrollIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = () => isCoarsePointer;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      if (!canvas) return;
      const count = isMobile()
        ? PARTICLE_COUNT_MOBILE
        : PARTICLE_COUNT_DESKTOP;
      const width = window.innerWidth;
      const height = window.innerHeight;
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    }

    function paintFrame() {
      if (!canvas || !ctx) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mobile = isMobile();
      const connectionDist = mobile
        ? CONNECTION_DISTANCE_MOBILE
        : CONNECTION_DISTANCE_DESKTOP;
      const drawConnections = !mobile;

      const isDark = document.documentElement.classList.contains("dark");
      const particleRgb = isDark ? "147,210,255" : "100,116,139";
      const attractionRgb = isDark ? "96,165,250" : "37,99,235";
      const spotlightColor = isDark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.03)";

      if (!mobile && mx > 0) {
        const spotlight = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        spotlight.addColorStop(0, spotlightColor);
        spotlight.addColorStop(1, "transparent");
        ctx.fillStyle = spotlight;
        ctx.fillRect(0, 0, width, height);
      }

      const particles = particlesRef.current;

      for (const p of particles) {
        if (!mobile) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_ATTRACT_RADIUS && dist > 0) {
            p.vx += (dx / dist) * CURSOR_ATTRACT_STRENGTH;
            p.vy += (dy / dist) * CURSOR_ATTRACT_STRENGTH;
          }

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > SPEED * 2.5) {
            p.vx = (p.vx / speed) * SPEED * 2.5;
            p.vy = (p.vy / speed) * SPEED * 2.5;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleRgb},${p.opacity})`;
        ctx.fill();
      }

      if (drawConnections) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;
            const maxDistSq = connectionDist * connectionDist;

            if (distSq < maxDistSq) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / connectionDist) * 0.18;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(${particleRgb},${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }

          const p = particles[i];
          const cdx = p.x - mx;
          const cdy = p.y - my;
          const cdistSq = cdx * cdx + cdy * cdy;
          const attractSq = CURSOR_ATTRACT_RADIUS * CURSOR_ATTRACT_RADIUS;
          if (cdistSq < attractSq) {
            const cdist = Math.sqrt(cdistSq);
            const alpha = (1 - cdist / CURSOR_ATTRACT_RADIUS) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(${attractionRgb},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function shouldAnimate() {
      return !prefersReducedMotion && !pausedRef.current;
    }

    function frame(time: number) {
      rafRef.current = 0;

      if (!shouldAnimate()) {
        return;
      }

      if (scrollPausedRef.current) {
        return;
      }

      if (
        isMobile() &&
        time - lastFrameTimeRef.current < MOBILE_FRAME_INTERVAL_MS
      ) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      lastFrameTimeRef.current = time;
      paintFrame();
      rafRef.current = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (rafRef.current || !shouldAnimate()) return;
      rafRef.current = requestAnimationFrame(frame);
    }

    function stopLoop() {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    }

    resize();
    initParticles();
    paintFrame();

    if (shouldAnimate()) {
      startLoop();
    }

    const handleResize = () => {
      resize();
      initParticles();
      paintFrame();
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const handleVisibility = () => {
      pausedRef.current = document.hidden;
      if (document.hidden) {
        stopLoop();
      } else {
        paintFrame();
        startLoop();
      }
    };

    const handleScroll = () => {
      if (!isMobile()) return;
      scrollPausedRef.current = true;
      stopLoop();
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }
      scrollIdleTimerRef.current = setTimeout(() => {
        scrollPausedRef.current = false;
        scrollIdleTimerRef.current = null;
        startLoop();
      }, SCROLL_IDLE_MS);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    if (!prefersReducedMotion && !isMobile()) {
      window.addEventListener("mousemove", handleMouse, { passive: true });
      window.addEventListener("mouseleave", handleLeave);
    }

    return () => {
      stopLoop();
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [prefersReducedMotion, isCoarsePointer]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
