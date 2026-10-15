import React, { useRef, useEffect, useCallback } from 'react';

interface CardParticleCanvasProps {
  isHovered: boolean;
  mousePos: { x: number; y: number } | null;
  accentColor: string; // Hex color code (e.g., '#D97706')
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  z: number; // 3D depth multiplier
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
}

// Convert Hex to RGB tuple
function hexToRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export const CardParticleCanvas: React.FC<CardParticleCanvasProps> = ({
  isHovered,
  mousePos,
  accentColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const rgbRef = useRef<[number, number, number]>([217, 119, 6]);

  useEffect(() => {
    rgbRef.current = hexToRgb(accentColor);
  }, [accentColor]);

  // Spawn a batch of particles (e.g., on hover start or cursor motion)
  const spawnParticles = useCallback(
    (count: number, originX?: number, originY?: number, spreadSpeed = 1.2) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const [r, g, b] = rgbRef.current;

      for (let i = 0; i < count; i++) {
        // If origin is provided, spawn near it; otherwise spawn along the edges or surface
        let px = originX !== undefined ? originX + (Math.random() - 0.5) * 24 : Math.random() * w;
        let py = originY !== undefined ? originY + (Math.random() - 0.5) * 24 : Math.random() * h;

        const angle = Math.random() * Math.PI * 2;
        const speed = (0.3 + Math.random() * 0.9) * spreadSpeed;
        const z = 0.6 + Math.random() * 0.8; // 3D depth simulation

        particlesRef.current.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed * z,
          vy: (Math.sin(angle) * speed - 0.3) * z, // slight upward float
          size: (1.2 + Math.random() * 2.0) * z,
          z,
          alpha: 0.7 + Math.random() * 0.3,
          maxLife: 35 + Math.floor(Math.random() * 30),
          life: 0,
          color: `${r}, ${g}, ${b}`,
        });
      }
    },
    []
  );

  // Trigger burst when user first hovers over card
  useEffect(() => {
    if (isHovered) {
      const canvas = canvasRef.current;
      if (canvas) {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        // Spawn perimeter ambient particles
        spawnParticles(10, mousePos?.x ?? w / 2, mousePos?.y ?? h / 2, 1.4);
      }
    }
  }, [isHovered, mousePos, spawnParticles]);

  // Continuous loop only when active
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Ensure canvas resolution matches DPR
      if (
        canvas.width !== Math.floor(rect.width * dpr) ||
        canvas.height !== Math.floor(rect.height * dpr)
      ) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // If hovered and cursor is moving, spawn gentle trail
      if (isHovered && mousePos && Math.random() < 0.45 && particlesRef.current.length < 35) {
        spawnParticles(1, mousePos.x, mousePos.y, 0.7);
      }

      // Update & Draw particles
      const activeParticles: Particle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97; // friction
        p.vy *= 0.97;

        const progress = p.life / p.maxLife;
        const currentAlpha = Math.max(0, p.alpha * (1 - progress));

        if (progress < 1 && currentAlpha > 0.01) {
          activeParticles.push(p);

          // Draw subtle 3D luminous particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${currentAlpha.toFixed(3)})`;
          ctx.shadowColor = `rgba(${p.color}, ${(currentAlpha * 0.75).toFixed(3)})`;
          ctx.shadowBlur = 6 * p.z;
          ctx.fill();
        }
      }

      particlesRef.current = activeParticles;
      ctx.restore();

      // Continue animation loop if still hovered OR particles are actively fading out
      if (isHovered || particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        // Stop RAF to maintain 0% CPU consumption when idle
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    if (isHovered || particlesRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(render);
    }

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isHovered, mousePos, spawnParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none rounded-[32px] z-20 overflow-visible"
      style={{
        willChange: isHovered ? 'transform, opacity' : 'auto',
      }}
    />
  );
};
