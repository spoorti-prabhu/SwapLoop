import React from 'react';

export const FloatingDoodles: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Sparkle Star 4-Point (Top-Left) */}
      <svg
        className="absolute top-12 left-10 w-8 h-8 text-pink-300/40 animate-pulse"
        style={{ animationDuration: '4s' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {/* 2. Triangular Loop Ring (Top-Right) */}
      <svg
        className="absolute top-16 right-16 w-12 h-12 text-pink-300/30 animate-spin"
        style={{ animationDuration: '28s' }}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <circle cx="50" cy="50" r="38" strokeDasharray="14 10" />
        <path d="M50 12L58 20L48 24" fill="currentColor" />
        <path d="M82 66L84 54L74 58" fill="currentColor" />
        <path d="M18 66L28 62L26 74" fill="currentColor" />
      </svg>

      {/* 3. Dorm Coffee Cup with Steam (Middle-Left) */}
      <svg
        className="absolute top-1/2 left-8 -translate-y-1/2 w-10 h-10 text-rose-300/35"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Cup body */}
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" className="animate-pulse" style={{ animationDuration: '2s' }} />
        <line x1="10" y1="2" x2="10" y2="4" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
        <line x1="14" y1="2" x2="14" y2="4" className="animate-pulse" style={{ animationDuration: '3s' }} />
      </svg>

      {/* 4. Playful Squiggle Line (Bottom-Left) */}
      <svg
        className="absolute bottom-20 left-20 w-16 h-8 text-pink-400/30"
        viewBox="0 0 80 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        <path d="M 5 15 Q 20 2, 35 15 T 65 15 T 75 15" />
      </svg>

      {/* 5. 8-Point Campus Sparkle Star (Middle-Right) */}
      <svg
        className="absolute top-1/3 right-12 w-9 h-9 text-rose-300/40 animate-pulse"
        style={{ animationDuration: '3.5s' }}
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path d="M16 0L18 12L30 14L20 20L22 32L14 24L4 28L10 18L0 16L12 12Z" />
      </svg>

      {/* 6. Mini Loop Ring Dots (Bottom-Right) */}
      <svg
        className="absolute bottom-14 right-24 w-11 h-11 text-pink-300/35"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="4 4"
      >
        <circle cx="20" cy="20" r="15" />
        <circle cx="20" cy="5" r="2.5" fill="currentColor" />
        <circle cx="35" cy="20" r="2.5" fill="currentColor" />
      </svg>

      {/* 7. Tiny Twinkle Sparkle (Center Subtle) */}
      <svg
        className="absolute top-1/4 left-1/3 w-5 h-5 text-pink-300/25 animate-ping"
        style={{ animationDuration: '5s' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" />
      </svg>
    </div>
  );
};

export default FloatingDoodles;
