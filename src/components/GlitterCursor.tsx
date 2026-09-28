import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  initialSize: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'star' | 'circle' | 'diamond';
}

export const GlitterCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = false;
    const particles: Particle[] = [];

    // Aesthetic Blush Mist palette
    const glitterColors = [
      '#F472B6', // Blush pink
      '#DB2777', // Vivid rose
      '#F43F5E', // Coral pink
      '#FDE047', // Soft golden shimmer
      '#FFFFFF', // Pure sparkle white
      '#E879F9', // Orchid violet
      '#FCE7F3'  // Pale blush mist
    ];

    // Resize canvas to match window
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Helper: Draw 4-pointed sparkle star (✦)
    const drawSparkleStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    };

    // Draw diamond sparkle
    const drawDiamond = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number
    ) => {
      context.beginPath();
      context.moveTo(cx, cy - size);
      context.lineTo(cx + size * 0.6, cy);
      context.lineTo(cx, cy + size);
      context.lineTo(cx - size * 0.6, cy);
      context.closePath();
      context.fill();
    };

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;
        p.size = p.initialSize * (p.alpha > 0 ? p.alpha : 0);

        // Remove dead particles
        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;

        if (p.shape === 'star') {
          drawSparkleStar(ctx, 0, 0, 4, p.size * 1.6, p.size * 0.4);
        } else if (p.shape === 'diamond') {
          drawDiamond(ctx, 0, 0, p.size * 1.2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // If particles remain, keep loop running. If empty, pause to preserve 0% idle CPU
      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Track mouse position and spawn mild glitter
    let lastX = 0;
    let lastY = 0;
    let lastSpawnTime = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

      const now = performance.now();
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const distance = Math.hypot(dx, dy);

      // Only spawn if cursor moved at least 5px and throttled to smooth frequency
      if (distance > 5 && now - lastSpawnTime > 16) {
        lastX = clientX;
        lastY = clientY;
        lastSpawnTime = now;

        // Mild glitter: spawn 1-2 subtle particles per movement
        const count = Math.random() > 0.4 ? 2 : 1;

        for (let i = 0; i < count; i++) {
          if (particles.length >= 40) break; // Keep cap low for mild aesthetic

          const shapes: ('star' | 'circle' | 'diamond')[] = ['star', 'circle', 'diamond'];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          const color = glitterColors[Math.floor(Math.random() * glitterColors.length)];

          particles.push({
            x: clientX + (Math.random() - 0.5) * 8,
            y: clientY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.9,
            vy: Math.random() * 0.6 + 0.2, // Subtle gentle downward drift
            size: Math.random() * 2.5 + 1.5, // Mild tiny size (1.5px to 4px)
            initialSize: Math.random() * 2.5 + 1.5,
            color,
            alpha: Math.random() * 0.4 + 0.55, // Soft translucent opacity (0.55 - 0.95)
            decay: Math.random() * 0.02 + 0.025, // Fades smoothly in ~0.5 - 0.7s
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
            shape
          });
        }

        startAnimation();
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] select-none"
      aria-hidden="true"
    />
  );
};

export default GlitterCursor;
