import React from 'react';
import { ItemCategory } from '../types/swaploop';

interface CategoryVisualProps {
  category: ItemCategory;
  className?: string;
}

export const CategoryVisual: React.FC<CategoryVisualProps> = ({ category, className = 'w-12 h-12' }) => {
  switch (category) {
    case 'Books':
      return (
        <div className={`${className} rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center p-2.5 text-amber-600 transition-transform group-hover:scale-110 duration-200`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="28" width="30" height="8" rx="2" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
            <rect x="10" y="19" width="30" height="8" rx="2" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
            <rect x="12" y="10" width="28" height="8" rx="2" fill="#BFDBFE" stroke="#2563EB" strokeWidth="2" />
            <line x1="16" y1="14" x2="28" y2="14" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="23" x2="26" y2="23" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="32" x2="24" y2="32" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'Electronics':
      return (
        <div className={`${className} rounded-2xl bg-indigo-50/80 border border-indigo-200/60 flex items-center justify-center p-2.5 text-indigo-600 transition-transform group-hover:scale-110 duration-200`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Headphones & Gadgets */}
            <path d="M 12 28 C 12 16, 36 16, 36 28" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" fill="none" />
            <rect x="8" y="26" width="7" height="12" rx="3.5" fill="#C7D2FE" stroke="#4338CA" strokeWidth="2" />
            <rect x="33" y="26" width="7" height="12" rx="3.5" fill="#C7D2FE" stroke="#4338CA" strokeWidth="2" />
            <circle cx="24" cy="38" r="3" fill="#818CF8" />
            <path d="M 24 35 L 24 30" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'Stationery':
      return (
        <div className={`${className} rounded-2xl bg-rose-50/80 border border-rose-200/60 flex items-center justify-center p-2.5 text-rose-600 transition-transform group-hover:scale-110 duration-200`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Mini Drafter & Ruler */}
            <path d="M 10 38 L 38 10" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
            <polygon points="34,8 40,6 38,12" fill="#E11D48" />
            <path d="M 16 16 L 32 32" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="24" cy="24" r="5" fill="#FFE4E6" stroke="#E11D48" strokeWidth="2" />
            <rect x="6" y="34" width="8" height="8" rx="2" fill="#FECDD3" stroke="#BE123C" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'Furniture':
      return (
        <div className={`${className} rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center p-2.5 text-amber-700 transition-transform group-hover:scale-110 duration-200`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Study Table & Lamp */}
            <rect x="8" y="24" width="32" height="4" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
            <line x1="12" y1="28" x2="12" y2="40" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="36" y1="28" x2="36" y2="40" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 28 24 L 28 14 L 24 10" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            <polygon points="20,12 28,8 24,14" fill="#FBBF24" />
          </svg>
        </div>
      );

    case 'Hostel Gear':
    default:
      return (
        <div className={`${className} rounded-2xl bg-teal-50/80 border border-teal-200/60 flex items-center justify-center p-2.5 text-teal-600 transition-transform group-hover:scale-110 duration-200`}>
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Bicycle & Backpack */}
            <circle cx="15" cy="30" r="7" stroke="#0D9488" strokeWidth="2.5" />
            <circle cx="33" cy="30" r="7" stroke="#0D9488" strokeWidth="2.5" />
            <path d="M 15 30 L 22 18 L 29 30 L 15 30 Z" stroke="#0F766E" strokeWidth="2" fill="none" />
            <path d="M 22 18 L 28 18" stroke="#115E59" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="29" y1="30" x2="33" y2="30" stroke="#0D9488" strokeWidth="2" />
          </svg>
        </div>
      );
  }
};

export default CategoryVisual;
