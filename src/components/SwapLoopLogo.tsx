import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  variant?: 'badge' | 'icon-only' | 'horizontal';
  badgeSize?: string;
}

/**
 * Custom SVG Infinity Symbol (∞) whose outer closing loop ends
 * transition into directional arrows on both ends.
 * Rendered in vibrant dark pink / fuchsia tones (#db2777 to #be185d).
 */
export const InfinityDualArrowIcon: React.FC<{
  size?: number | string;
  className?: string;
  color?: string;
}> = ({ size = 32, className = '', color }) => {
  return (
    <svg
      width={size}
      height={typeof size === 'number' ? size * 0.6 : '60%'}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
      aria-label="SwapLoop Infinity Dual-Arrow Mark"
    >
      <defs>
        <linearGradient id="infinityDualArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <filter id="infinityGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#db2777" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Infinity Path: Continuous fluid lemniscate loop */}
      <path
        d="M 32 45 
           C 18 45, 11 38, 11 30 
           C 11 22, 18 15, 30 15 
           C 42 15, 58 45, 70 45 
           C 82 45, 89 38, 89 30 
           C 89 22, 82 15, 72 15"
        stroke={color || 'url(#infinityDualArrowGrad)'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#infinityGlow)"
      />

      {/* Return Crossover Path completing the infinite exchange cycle */}
      <path
        d="M 70 15 
           C 58 15, 42 45, 30 45"
        stroke={color || 'url(#infinityDualArrowGrad)'}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Directional Arrow Head 1 (Top-Right outer loop terminal, pointing inward/circulation) */}
      <path
        d="M 73 8 L 60 15 L 73 22 Z"
        fill={color || 'url(#infinityDualArrowGrad)'}
      />

      {/* Directional Arrow Head 2 (Bottom-Left outer loop terminal, pointing inward/circulation) */}
      <path
        d="M 27 52 L 40 45 L 27 38 Z"
        fill={color || 'url(#infinityDualArrowGrad)'}
      />

      {/* Tiny Sparkle in the crossover vortex */}
      <circle cx="50" cy="30" r="2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
};

export const TriangleLoopIcon = InfinityDualArrowIcon;

export const SwapLoopWordmark: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const capClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <span
      className={`font-cursive tracking-wide select-none inline-flex items-baseline font-bold ${sizeClasses[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      <span className={`${capClasses[size]} font-extrabold -mr-0.5 inline-block transform -rotate-1`}>
        S
      </span>
      <span>wap</span>
      <span className={`${capClasses[size]} font-extrabold ml-0.5 -mr-0.5 inline-block transform rotate-1`}>
        L
      </span>
      <span>oop</span>
    </span>
  );
};

export const SwapLoopLogo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  variant = 'badge',
  badgeSize = 'w-10 h-10'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {variant === 'badge' ? (
        <div
          className={`${badgeSize} rounded-2xl bg-gradient-to-br from-[#db2777] to-[#be185d] shadow-sm shadow-pink-500/30 flex items-center justify-center p-2 text-white transition-transform hover:scale-105`}
        >
          <InfinityDualArrowIcon size="100%" color="#FFFFFF" />
        </div>
      ) : (
        <InfinityDualArrowIcon size={size} />
      )}

      {showText && <SwapLoopWordmark size="md" />}
    </div>
  );
};

export default SwapLoopLogo;
