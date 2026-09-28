import React, { useEffect, useRef } from 'react';

interface GlitterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  type: 'star' | 'diamond' | 'spark';
}

export const GlitterCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: GlitterParticle[] = [];

    // Aesthetic Blush Mist & Golden Shimmer palette
    const colors = [
      '#F472B6', // Blush pink
      '#DB2777', // Fuchsia rose
      '#FB7185', // Rose glow
      '#FDE047', // Radiant gold shimmer
      '#FBBF24', // Warm amber gold
      '#FFFFFF', // Diamond white
      '#E879F9', // Orchid violet
      '#FDA4AF'  // Soft pink
    ];

    // Resize canvas
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Helper: Draw 4-point sparkle star (✦)
    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / 4;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < 4; i++) {
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

    // Helper: Draw diamond sparkle (❖)
    const drawDiamond = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      w: number,
      h: number
    ) => {
      context.beginPath();
      context.moveTo(cx, cy - h);
      context.lineTo(cx + w, cy);
      context.lineTo(cx, cy + h);
      context.lineTo(cx - w, cy);
      context.closePath();
      context.fill();
    };

    // Spawn sparkles
    const spawnSparkles = (x: number, y: number, count: number, speedMultiplier = 1) => {
      for (let i = 0; i < count; i++) {
        if (particles.length > 70) break; // Gentle cap

        const types: ('star' | 'diamond' | 'spark')[] = ['star', 'diamond', 'spark', 'star'];
        const type = types[Math.floor(Math.random() * types.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 5 + 4; // 4px to 9px (clearly visible!)

        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 1.5 + 0.5) * speedMultiplier;

        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.3, // Gentle downward drift
          size,
          maxSize: size,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.025 + 0.02, // Fades gracefully in ~0.6 - 0.8s
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
          type
        });
      }
    };

    // Mouse movement listener
    let lastTime = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle slightly to ~40fps spawn rate so glitter is gentle and not crowded
      if (now - lastTime > 22) {
        lastTime = now;
        spawnSparkles(e.clientX, e.clientY, Math.random() > 0.35 ? 2 : 1);
      }
    };

    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        spawnSparkles(touch.clientX, touch.clientY, 2);
      }
    };

    // Click burst
    const onClick = (e: MouseEvent) => {
      spawnSparkles(e.clientX, e.clientY, 8, 1.8);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    // Animation Loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;
        p.size = p.maxSize * Math.max(0, p.alpha);

        if (p.alpha <= 0 || p.size <= 0.3) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Mild glowing halo
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.type === 'star') {
          drawStar(ctx, 0, 0, p.size, p.size * 0.3);
        } else if (p.type === 'diamond') {
          drawDiamond(ctx, 0, 0, p.size * 0.6, p.size);
        } else {
          // Circular glowing spark
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999
      }}
      aria-hidden="true"
    />
  );
};

export default GlitterCursor;
