import React from 'react';
import { InfinityDualArrowIcon, SwapLoopWordmark } from './SwapLoopLogo';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  variant?: 'full' | 'icon' | 'badge';
  badgeSize?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 32,
  showText = true,
  variant = 'badge',
  badgeSize = 'w-10 h-10'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {variant === 'badge' ? (
        <div
          className={`${badgeSize} rounded-2xl bg-gradient-to-br from-[#db2777] to-[#be185d] shadow-sm shadow-pink-500/25 flex items-center justify-center p-2 text-white transition-all hover:scale-105 hover:shadow-md`}
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

export default BrandLogo;
