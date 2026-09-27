import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  badgeSize?: string;
  variant?: 'badge' | 'icon-only';
}

/**
 * Three arrows in a loop, triangle shaped (The Campus Circular symbol)
 */
export const TriangleLoopIcon: React.FC<{
  size?: number | string;
  className?: string;
  color?: string;
}> = ({ size = 24, className = '', color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Three arrows in a loop, triangle shaped"
    >
      <g transform="translate(0, 3)">
        {/* Arrow 1: Top */}
        <path
          d="M 50 14 L 62 26 H 55 V 36 C 55 42 58 47 64 51 L 59 58 C 50 51 46 44 46 36 V 26 H 38 Z"
          fill={color}
        />
        {/* Arrow 2: Bottom-Right (rotated 120° around center 50, 50) */}
        <path
          d="M 50 14 L 62 26 H 55 V 36 C 55 42 58 47 64 51 L 59 58 C 50 51 46 44 46 36 V 26 H 38 Z"
          fill={color}
          transform="rotate(120 50 50)"
        />
        {/* Arrow 3: Bottom-Left (rotated 240° around center 50, 50) */}
        <path
          d="M 50 14 L 62 26 H 55 V 36 C 55 42 58 47 64 51 L 59 58 C 50 51 46 44 46 36 V 26 H 38 Z"
          fill={color}
          transform="rotate(240 50 50)"
        />
      </g>
    </svg>
  );
};

export const SwapLoopLogo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  showText = true,
  textColor = 'text-[#1D1722]',
  badgeSize = 'w-10 h-10',
  variant = 'badge'
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant === 'badge' ? (
        <div
          className={`${badgeSize} rounded-2xl bg-gradient-to-br from-[#DE5B9B] to-[#D1468B] shadow-sm shadow-blush-500/20 flex items-center justify-center p-2 text-white transition-transform hover:scale-105`}
        >
          {/* Three arrows in a loop, triangle shaped */}
          <TriangleLoopIcon size="100%" color="#FFFFFF" />
        </div>
      ) : (
        <TriangleLoopIcon size={size} color="#DE5B9B" />
      )}

      {showText && (
        <span className={`text-[23px] font-bold tracking-tight ${textColor}`}>
          SwapLoop
        </span>
      )}
    </div>
  );
};

export default SwapLoopLogo;
