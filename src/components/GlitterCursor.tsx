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
  twinkleSpeed: number;
  twinklePhase: number;
  type: 'star4' | 'star8' | 'diamond' | 'sparkle';
}

export const GlitterCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: GlitterParticle[] = [];

    // Aesthetic SwapLoop Glitter Palette (Rose, Magenta, Golden Champagne, Diamond White)
    const colors = [
      '#FFD700', // Bright Gold
      '#FFF3B0', // Pale Champagne
      '#FF69B4', // Hot Pink
      '#DB2777', // Vivid Fuchsia
      '#F472B6', // Blush Rose
      '#FFFFFF', // Diamond White
      '#E879F9', // Orchid Purple
      '#38BDF8', // Starlight Cyan Spark
      '#FFAAA6'  // Soft Peach Pink
    ];

    // Resize canvas to full viewport
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Draw 4-point star (✦)
    const drawStar4 = (context: CanvasRenderingContext2D, size: number) => {
      context.beginPath();
      context.moveTo(0, -size);
      context.quadraticCurveTo(0, 0, size, 0);
      context.quadraticCurveTo(0, 0, 0, size);
      context.quadraticCurveTo(0, 0, -size, 0);
      context.quadraticCurveTo(0, 0, 0, -size);
      context.closePath();
      context.fill();
    };

    // Draw 8-point sparkle star (✶)
    const drawStar8 = (context: CanvasRenderingContext2D, size: number) => {
      drawStar4(context, size);
      context.save();
      context.rotate(Math.PI / 4);
      drawStar4(context, size * 0.6);
      context.restore();
    };

    // Draw diamond (❖)
    const drawDiamond = (context: CanvasRenderingContext2D, size: number) => {
      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(size * 0.6, 0);
      context.lineTo(0, size);
      context.lineTo(-size * 0.6, 0);
      context.closePath();
      context.fill();
    };

    // Spawn single glitter particle
    const createParticle = (x: number, y: number, isBurst = false): GlitterParticle => {
      const types: ('star4' | 'star8' | 'diamond' | 'sparkle')[] = ['star4', 'star8', 'diamond', 'sparkle'];
      const type = types[Math.floor(Math.random() * types.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst
        ? Math.random() * 3.5 + 1.2
        : Math.random() * 1.6 + 0.3;

      const size = isBurst
        ? Math.random() * 8 + 5
        : Math.random() * 6 + 3.5; // 3.5px to 9.5px

      return {
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.35, // Soft gravity drift
        size,
        maxSize: size,
        color,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.018, // Lasts ~0.8 to 1.2 seconds
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        twinkleSpeed: Math.random() * 0.2 + 0.1,
        twinklePhase: Math.random() * Math.PI * 2,
        type
      };
    };

    // Continuous track interpolation for unbroken glitter fairy dust trail
    let lastX: number | null = null;
    let lastY: number | null = null;

    const spawnTrail = (currentX: number, currentY: number) => {
      if (lastX === null || lastY === null) {
        lastX = currentX;
        lastY = currentY;
      }

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const dist = Math.hypot(dx, dy);

      // Interpolate along the path so fast cursor movements don't leave gaps!
      const steps = Math.min(Math.max(Math.floor(dist / 8), 1), 8);

      for (let i = 0; i <= steps; i++) {
        if (particles.length >= 120) break;
        const progress = i / steps;
        const posX = lastX + dx * progress;
        const posY = lastY + dy * progress;

        // Spawn 1-2 particles at each interpolation point
        particles.push(createParticle(posX, posY, false));
        if (Math.random() > 0.5) {
          particles.push(createParticle(posX, posY, false));
        }
      }

      lastX = currentX;
      lastY = currentY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      spawnTrail(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        spawnTrail(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Sparkling burst on click
      for (let i = 0; i < 20; i++) {
        if (particles.length >= 150) break;
        particles.push(createParticle(e.clientX, e.clientY, true));
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;
        p.twinklePhase += p.twinkleSpeed;

        // Twinkle factor between 0.7 and 1.3
        const twinkle = 1 + 0.3 * Math.sin(p.twinklePhase);
        p.size = p.maxSize * Math.max(0, p.alpha) * twinkle;

        // Remove dead particles
        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(Math.max(p.alpha, 0), 1);
        ctx.fillStyle = p.color;

        // Glowing outer shimmer
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.type === 'star8') {
          drawStar8(ctx, p.size);
        } else if (p.type === 'star4') {
          drawStar4(ctx, p.size);
        } else if (p.type === 'diamond') {
          drawDiamond(ctx, p.size);
        } else {
          // Circular bright spark
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
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
        zIndex: 9999999,
        willChange: 'transform'
      }}
      aria-hidden="true"
    />
  );
};

export default GlitterCursor;
