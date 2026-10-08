import React, { useEffect, useRef } from 'react';

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  growth: number;
  rotation: number;
  rotationSpeed: number;
  colorBase: string; // RGB string in orange/yellow spectrum
  isCore: boolean;
}

export const SmokeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: SmokeParticle[] = [];
    const MAX_PARTICLES = 260;

    let mouseX = width * 0.5;
    let mouseY = height * 0.4;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let isDragging = false;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // VIBRANT ORANGE & YELLOW PALETTE (Zero black, zero grey)
    const orangeYellowColors = [
      '234, 88, 12',   // Vivid Sunset Orange (Deep & striking)
      '249, 115, 22',  // Vibrant Tangerine Orange
      '251, 146, 60',  // Warm Peach Orange
      '217, 119, 6',   // Rich Golden Amber
      '245, 158, 11',  // Radiant Honey Marigold
      '234, 179, 8',   // Luminous Golden Yellow
      '250, 204, 21',  // Bright Sunlight Yellow
      '254, 240, 138', // Ethereal Lemon Yellow
    ];

    const spawnSmokePuff = (
      x: number,
      y: number,
      intensity = 1,
      velocityFactor = { x: 0, y: 0 }
    ) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = (0.45 + Math.random() * 1.3) * intensity;
      const maxLife = 50 + Math.random() * 50;

      // Rich noticeable opacity (between 0.45 and 0.85)
      const maxAlpha = Math.min(0.85, (0.42 + Math.random() * 0.38) * (intensity > 1 ? 1.15 : 1));

      // Pure mix of orange and yellow
      const colorBase = orangeYellowColors[Math.floor(Math.random() * orangeYellowColors.length)];

      const initialRadius = 18 + Math.random() * 22;
      const maxRadius = initialRadius + 48 + Math.random() * 48;

      particles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(angle) * speed + velocityFactor.x * 0.35,
        vy: Math.sin(angle) * speed - 0.45 + velocityFactor.y * 0.35, // Natural buoyant rise
        radius: initialRadius,
        maxRadius,
        alpha: 0.05,
        maxAlpha,
        life: 0,
        maxLife,
        growth: 0.8 + Math.random() * 0.7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.045,
        colorBase,
        isCore: intensity > 1.2,
      });
    };

    // Sensitive continuous path emitter (fills gaps between touch/drag events)
    const emitAlongPath = (currX: number, currY: number, dragging: boolean) => {
      const dx = currX - lastMouseX;
      const dy = currY - lastMouseY;
      const dist = Math.hypot(dx, dy);

      // Sensitive down to 4px movements
      const stepSize = dragging ? 5 : 8;
      const steps = Math.max(1, Math.min(20, Math.floor(dist / stepSize)));

      const vx = dx * 0.08;
      const vy = dy * 0.08;
      const intensity = dragging ? 1.5 : 1.0;

      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 1 : i / steps;
        const px = lastMouseX + dx * t;
        const py = lastMouseY + dy * t;
        spawnSmokePuff(px, py, intensity, { x: vx, y: vy });
      }

      lastMouseX = currX;
      lastMouseY = currY;
    };

    // Pointer & Mouse Events
    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      emitAlongPath(mouseX, mouseY, isDragging);
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastMouseX = mouseX = e.clientX;
      lastMouseY = mouseY = e.clientY;
      // Burst of orange and yellow puffs on touch/click
      for (let i = 0; i < 6; i++) {
        spawnSmokePuff(mouseX, mouseY, 1.6);
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Touch events for mobile precision
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        const t = e.touches[0];
        lastMouseX = mouseX = t.clientX;
        lastMouseY = mouseY = t.clientY;
        for (let i = 0; i < 5; i++) {
          spawnSmokePuff(mouseX, mouseY, 1.6);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouseX = t.clientX;
        mouseY = t.clientY;
        emitAlongPath(mouseX, mouseY, true);
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    // Ambient gentle drifting puffs of warm yellow and orange
    let idleTick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      idleTick++;
      if (idleTick % 22 === 0 && particles.length < MAX_PARTICLES) {
        const offsetX = (Math.random() - 0.5) * 80;
        const offsetY = (Math.random() - 0.5) * 80;
        spawnSmokePuff(mouseX + offsetX, mouseY + offsetY, 0.85);
      }

      // Render smoke particles with glowing multi-stop orange & yellow gradients
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Physics: expand radius, buoyant upward drift
        p.x += p.vx;
        p.y += p.vy;
        p.radius = Math.min(p.maxRadius, p.radius + p.growth);
        p.rotation += p.rotationSpeed;
        p.vx *= 0.985;
        p.vy = (p.vy - 0.014) * 0.985; // Buoyant upward acceleration

        // Eased fade curve: fast strike, long billowing linger, smooth dissipation
        const progress = p.life / p.maxLife;
        if (progress < 0.15) {
          p.alpha = (progress / 0.15) * p.maxAlpha;
        } else {
          p.alpha = (1 - (progress - 0.15) / 0.85) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || p.alpha <= 0.005) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft, volumetric organic smoke plume in orange & yellow
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const rad = p.radius;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);

        // Core orange/yellow density and soft dissipation
        gradient.addColorStop(0, `rgba(${p.colorBase}, ${p.alpha})`);
        gradient.addColorStop(0.35, `rgba(${p.colorBase}, ${p.alpha * 0.78})`);
        gradient.addColorStop(0.7, `rgba(${p.colorBase}, ${p.alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${p.colorBase}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, rad * 1.18, rad * 0.86, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 2D High-Sensitivity Orange & Yellow Dynamic Smoke Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Warm orange & yellow ambient atmospheric lighting glow */}
      <div
        className="absolute top-1/4 left-1/3 w-[650px] h-[650px] rounded-full opacity-40 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.28) 0%, rgba(250, 204, 21, 0.22) 40%, transparent 70%)',
          filter: 'blur(95px)',
          animationDuration: '8s',
        }}
      />
    </div>
  );
};
