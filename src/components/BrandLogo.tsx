import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  variant?: 'full' | 'icon' | 'badge';
  badgeSize?: string;
}

/**
 * Original SwapLoop Logo:
 * - Two elegant curved arrows forming a loop
 * - Subtle "S" shape incorporated into the loop
 * - Small spark element
 * - Circular movement, students, exchange
 */
export const SwapLoopMark: React.FC<{
  size?: number | string;
  className?: string;
  color?: string;
}> = ({ size = 28, className = '', color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SwapLoop S-Loop Icon"
    >
      <defs>
        <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
      </defs>

      {/* Primary S-Loop Arrow 1 (Flowing down and right) */}
      <path
        d="M 28 26 C 28 16, 44 14, 56 16 C 70 19, 78 30, 74 44 C 70 56, 52 58, 44 64 C 36 70, 34 80, 48 84 C 58 87, 72 82, 72 70"
        stroke={color === 'currentColor' ? 'url(#roseGradient)' : color}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Interlocking Arrow 2 (Flowing in reverse loop completing the cycle) */}
      <path
        d="M 72 74 C 72 84, 56 86, 44 84 C 30 81, 22 70, 26 56 C 30 44, 48 42, 56 36 C 64 30, 66 20, 52 16"
        stroke={color === 'currentColor' ? '#FB7185' : color}
        strokeWidth="6"
        strokeDasharray="2 12"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Elegant Arrowheads */}
      <polygon
        points="70,62 82,72 68,78"
        fill={color === 'currentColor' ? 'url(#roseGradient)' : color}
      />
      <polygon
        points="30,38 18,28 32,22"
        fill={color === 'currentColor' ? '#F472B6' : color}
      />

      {/* Spark element (representing discovery & energy) */}
      <g transform="translate(68, 22)">
        <path
          d="M 8 0 Q 8 8 16 8 Q 8 8 8 16 Q 8 8 0 8 Q 8 8 8 0 Z"
          fill="#FDE047"
          className="animate-pulse"
        />
        <circle cx="8" cy="8" r="2.5" fill="#F59E0B" />
      </g>
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 32,
  showText = true,
  textColor = 'text-[#1D1722]',
  variant = 'badge',
  badgeSize = 'w-10 h-10'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {variant === 'badge' ? (
        <div
          className={`${badgeSize} rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center justify-center p-2 text-pink-500 transition-all hover:scale-105 hover:shadow-md hover:border-pink-300`}
        >
          <SwapLoopMark size="100%" />
        </div>
      ) : (
        <SwapLoopMark size={size} />
      )}

      {showText && (
        <div className="flex items-center gap-1">
          <span className={`text-xl sm:text-[22px] font-extrabold tracking-tight ${textColor} font-sans`}>
            Swap<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F472B6] to-[#FB7185]">Loop</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mb-2"></span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
