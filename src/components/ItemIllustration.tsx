import React from 'react';

export interface ItemIllustrationProps {
  title: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'card' | 'hero';
  className?: string;
}

export const ItemIllustration: React.FC<ItemIllustrationProps> = ({
  title,
  category = 'General',
  size = 'md',
  className = ''
}) => {
  const t = title.toLowerCase();

  // Size mappings
  const sizeClasses = {
    sm: 'w-12 h-12 p-1.5',
    md: 'w-24 h-24 p-3',
    lg: 'w-44 h-40 p-4',
    xl: 'w-56 h-48 p-5',
    card: 'w-full h-44 p-3',
    hero: 'w-64 h-56 p-6'
  }[size];

  // Detect specific item type
  const isDrafter = t.includes('drafter') || t.includes('draft');
  const isBicycle = t.includes('bicycle') || t.includes('bike') || t.includes('cycle');
  const isExtensionBoard = t.includes('extension') || t.includes('board') || t.includes('strip') || t.includes('socket');
  const isHeadphones = t.includes('headphone') || t.includes('audio') || t.includes('earphone');
  const isLamp = t.includes('lamp') || t.includes('light');
  const isStudyTable = t.includes('study table') || t.includes('table') || t.includes('desk');
  const isLabCoat = t.includes('lab') || t.includes('coat') || t.includes('apron');
  const isCalculator = t.includes('calc') || t.includes('scientific');
  const isBooks = t.includes('book') || t.includes('textbook') || t.includes('notes') || category === 'Books';
  const isBackpack = t.includes('bag') || t.includes('backpack');
  const isLaptop = t.includes('laptop') || t.includes('computer');

  // 1. MINI DRAFTER ILLUSTRATION
  if (isDrafter) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-white border border-rose-100/80 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Clamp Base (Attaches to drawing board) */}
          <rect x="25" y="115" width="30" height="26" rx="4" fill="#64748B" stroke="#334155" strokeWidth="2.5" />
          <circle cx="40" cy="128" r="6" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
          <path d="M 40 105 L 40 115" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <rect x="32" y="100" width="16" height="6" rx="2" fill="#F43F5E" />

          {/* Lower Arm (Parallel Rods) */}
          <line x1="40" y1="120" x2="90" y2="65" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
          <line x1="47" y1="126" x2="97" y2="71" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />

          {/* Central Pivot Joint */}
          <circle cx="95" cy="68" r="10" fill="#FFFFFF" stroke="#E11D48" strokeWidth="3" />
          <circle cx="95" cy="68" r="4" fill="#FB7185" />

          {/* Upper Arm (Parallel Rods) */}
          <line x1="95" y1="68" x2="145" y2="50" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
          <line x1="99" y1="75" x2="149" y2="57" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />

          {/* Protractor Head Plate */}
          <circle cx="147" cy="54" r="22" fill="#FFF1F2" stroke="#E11D48" strokeWidth="3" />
          {/* Degree Ticks */}
          <path d="M 132 54 A 15 15 0 0 1 162 54" stroke="#FB7185" strokeWidth="2" strokeDasharray="2 3" fill="none" />
          <circle cx="147" cy="54" r="5" fill="#BE123C" />
          <rect x="143" y="40" width="8" height="5" rx="1.5" fill="#E11D48" />

          {/* Horizontal Ruler Arm (transparent acrylic with tick marks) */}
          <rect x="147" y="52" width="48" height="12" rx="2" fill="#E0F2FE" fillOpacity="0.85" stroke="#0284C7" strokeWidth="2" />
          <line x1="155" y1="52" x2="155" y2="57" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="165" y1="52" x2="165" y2="58" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="175" y1="52" x2="175" y2="57" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="185" y1="52" x2="185" y2="59" stroke="#0369A1" strokeWidth="1.5" />

          {/* Vertical Ruler Arm */}
          <rect x="141" y="54" width="12" height="46" rx="2" fill="#E0F2FE" fillOpacity="0.85" stroke="#0284C7" strokeWidth="2" />
          <line x1="141" y1="65" x2="146" y2="65" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="141" y1="75" x2="147" y2="75" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="141" y1="85" x2="146" y2="85" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="141" y1="95" x2="148" y2="95" stroke="#0369A1" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // 2. BICYCLE ILLUSTRATION
  if (isBicycle) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50/80 via-emerald-50/40 to-white border border-teal-100 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Rear Wheel */}
          <circle cx="50" cy="105" r="30" stroke="#334155" strokeWidth="5" fill="#F8FAFC" />
          <circle cx="50" cy="105" r="26" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="105" r="5" fill="#0F766E" />
          {/* Spokes */}
          <line x1="50" y1="75" x2="50" y2="135" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="20" y1="105" x2="80" y2="105" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="29" y1="84" x2="71" y2="126" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="29" y1="126" x2="71" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Front Wheel */}
          <circle cx="150" cy="105" r="30" stroke="#334155" strokeWidth="5" fill="#F8FAFC" />
          <circle cx="150" cy="105" r="26" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="150" cy="105" r="5" fill="#0F766E" />
          {/* Spokes */}
          <line x1="150" y1="75" x2="150" y2="135" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="120" y1="105" x2="180" y2="105" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="129" y1="84" x2="171" y2="126" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="129" y1="126" x2="171" y2="84" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Bottom Bracket & Pedal */}
          <circle cx="95" cy="105" r="8" fill="#0D9488" stroke="#134E4A" strokeWidth="2" />
          <line x1="95" y1="105" x2="104" y2="116" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
          <rect x="99" y="113" width="10" height="4" rx="1.5" fill="#334155" />

          {/* Bike Frame (Diamond Geometry in vibrant Coral/Rose) */}
          <line x1="50" y1="105" x2="95" y2="105" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" /> {/* Chainstay */}
          <line x1="50" y1="105" x2="82" y2="68" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" /> {/* Seatstay */}
          <line x1="95" y1="105" x2="82" y2="68" stroke="#E11D48" strokeWidth="4.5" strokeLinecap="round" /> {/* Seat tube */}
          <line x1="95" y1="105" x2="132" y2="65" stroke="#FB7185" strokeWidth="4" strokeLinecap="round" /> {/* Down tube */}
          <line x1="82" y1="68" x2="130" y2="65" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" /> {/* Top tube */}

          {/* Front Fork & Headtube */}
          <line x1="150" y1="105" x2="136" y2="52" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />

          {/* Saddle */}
          <line x1="82" y1="68" x2="80" y2="56" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <path d="M 68 56 C 72 53, 94 53, 96 56 C 94 60, 84 60, 68 56 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

          {/* Handlebars */}
          <line x1="136" y1="52" x2="138" y2="42" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 126 42 Q 138 40 148 45" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="126" cy="42" r="3" fill="#FB7185" />
        </svg>
      </div>
    );
  }

  // 3. EXTENSION BOARD ILLUSTRATION
  if (isExtensionBoard) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/40 to-white border border-indigo-100 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Power Cord looping back */}
          <path d="M 25 130 C 20 110, 15 90, 30 70 C 42 55, 60 75, 75 75" stroke="#64748B" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Wall Plug */}
          <rect x="18" y="125" width="14" height="20" rx="3" fill="#1E293B" />
          <line x1="22" y1="145" x2="22" y2="152" stroke="#94A3B8" strokeWidth="2.5" />
          <line x1="28" y1="145" x2="28" y2="152" stroke="#94A3B8" strokeWidth="2.5" />

          {/* Main Extension Board Body */}
          <rect x="65" y="45" width="115" height="70" rx="10" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3" />
          {/* Red Master Switch with LED Glow */}
          <rect x="75" y="58" width="14" height="24" rx="3" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <circle cx="82" cy="65" r="2.5" fill="#FEF08A" />
          <line x1="82" y1="72" x2="82" y2="78" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

          {/* Socket 1 */}
          <rect x="98" y="55" width="22" height="30" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
          <circle cx="109" cy="63" r="2.5" fill="#4338CA" />
          <circle cx="104" cy="74" r="2" fill="#4338CA" />
          <circle cx="114" cy="74" r="2" fill="#4338CA" />
          <rect x="99" y="90" width="20" height="7" rx="1.5" fill="#E0E7FF" />
          <circle cx="109" cy="93.5" r="1.5" fill="#10B981" />

          {/* Socket 2 */}
          <rect x="127" y="55" width="22" height="30" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
          <circle cx="138" cy="63" r="2.5" fill="#4338CA" />
          <circle cx="133" cy="74" r="2" fill="#4338CA" />
          <circle cx="143" cy="74" r="2" fill="#4338CA" />
          <rect x="128" y="90" width="20" height="7" rx="1.5" fill="#E0E7FF" />
          <circle cx="138" cy="93.5" r="1.5" fill="#10B981" />

          {/* Socket 3 */}
          <rect x="154" y="55" width="18" height="30" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
          <circle cx="163" cy="63" r="2.5" fill="#4338CA" />
          <circle cx="159" cy="74" r="2" fill="#4338CA" />
          <circle cx="167" cy="74" r="2" fill="#4338CA" />
          <rect x="154" y="90" width="18" height="7" rx="1.5" fill="#E0E7FF" />
          <circle cx="163" cy="93.5" r="1.5" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // 4. HEADPHONES ILLUSTRATION
  if (isHeadphones) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50/80 via-purple-50/40 to-white border border-violet-100 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Headband Arc */}
          <path d="M 50 95 C 50 45, 150 45, 150 95" stroke="#4C1D95" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 65 65 C 80 50, 120 50, 135 65" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Left Cushion & Ear Cup */}
          <rect x="36" y="82" width="28" height="42" rx="14" fill="#6D28D9" stroke="#4C1D95" strokeWidth="2.5" />
          <rect x="42" y="88" width="12" height="30" rx="6" fill="#DDD6FE" />
          <circle cx="50" cy="103" r="3" fill="#4C1D95" />

          {/* Right Cushion & Ear Cup */}
          <rect x="136" y="82" width="28" height="42" rx="14" fill="#6D28D9" stroke="#4C1D95" strokeWidth="2.5" />
          <rect x="146" y="88" width="12" height="30" rx="6" fill="#DDD6FE" />
          <circle cx="150" cy="103" r="3" fill="#4C1D95" />

          {/* Sound Waves Accent */}
          <path d="M 22 93 C 18 100, 18 106, 22 113" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 178 93 C 182 100, 182 106, 178 113" stroke="#F472B6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 5. TABLE LAMP ILLUSTRATION
  if (isLamp) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50/90 via-yellow-50/40 to-white border border-amber-100 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Warm Light Glow Cone */}
          <polygon points="120,40 50,140 160,140" fill="#FEF08A" fillOpacity="0.4" />

          {/* Base */}
          <ellipse cx="65" cy="135" rx="25" ry="8" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <rect x="61" y="125" width="8" height="8" rx="2" fill="#64748B" />

          {/* Lower Arm */}
          <line x1="65" y1="128" x2="85" y2="78" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="71" y1="130" x2="91" y2="80" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />

          {/* Joint */}
          <circle cx="88" cy="79" r="6" fill="#D97706" stroke="#78350F" strokeWidth="2" />

          {/* Upper Arm */}
          <line x1="88" y1="79" x2="120" y2="45" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />

          {/* Lamp Shade Head */}
          <path d="M 112 36 L 140 52 L 115 62 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <ellipse cx="127.5" cy="57" rx="14" ry="7" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
          {/* Glowing Bulb */}
          <circle cx="127" cy="55" r="4.5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 6. STUDY TABLE ILLUSTRATION
  if (isStudyTable) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white border border-amber-200/80 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Bookshelf Riser on Desk */}
          <rect x="40" y="38" width="60" height="32" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          {/* Miniature Books on Desk Riser */}
          <rect x="46" y="44" width="8" height="22" rx="1" fill="#3B82F6" />
          <rect x="55" y="42" width="7" height="24" rx="1" fill="#EC4899" />
          <rect x="63" y="46" width="9" height="20" rx="1" fill="#10B981" />
          <rect x="73" y="44" width="8" height="22" rx="1" fill="#F59E0B" />

          {/* Table Top Surface */}
          <polygon points="30,70 170,70 160,82 20,82" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
          {/* Drawer Fascia */}
          <rect x="25" y="82" width="130" height="18" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <rect x="45" y="87" width="40" height="8" rx="2" fill="#FDE68A" />
          <circle cx="65" cy="91" r="2" fill="#78350F" />
          <rect x="95" y="87" width="40" height="8" rx="2" fill="#FDE68A" />
          <circle cx="115" cy="91" r="2" fill="#78350F" />

          {/* Left Table Legs */}
          <rect x="28" y="100" width="8" height="42" rx="2" fill="#92400E" />
          <rect x="44" y="100" width="6" height="38" rx="2" fill="#78350F" opacity="0.8" />

          {/* Right Table Legs */}
          <rect x="144" y="100" width="8" height="42" rx="2" fill="#92400E" />
          <rect x="132" y="100" width="6" height="38" rx="2" fill="#78350F" opacity="0.8" />
        </svg>
      </div>
    );
  }

  // 7. SCIENTIFIC CALCULATOR ILLUSTRATION
  if (isCalculator) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 via-sky-50 to-white border border-slate-200 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Body Case */}
          <rect x="58" y="24" width="84" height="116" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          {/* Solar Panel */}
          <rect x="68" y="32" width="64" height="8" rx="2" fill="#713F12" stroke="#A16207" strokeWidth="1" />
          <line x1="84" y1="32" x2="84" y2="40" stroke="#CA8A04" strokeWidth="1" />
          <line x1="100" y1="32" x2="100" y2="40" stroke="#CA8A04" strokeWidth="1" />
          <line x1="116" y1="32" x2="116" y2="40" stroke="#CA8A04" strokeWidth="1" />

          {/* LCD Screen */}
          <rect x="68" y="44" width="64" height="24" rx="3" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
          <text x="72" y="55" fontSize="8" fontFamily="monospace" fill="#047857" fontWeight="bold">sin(45°) + π</text>
          <text x="110" y="65" fontSize="9" fontFamily="monospace" fill="#065F46" fontWeight="bold">1.7071</text>

          {/* Scientific Function Keys */}
          <rect x="68" y="74" width="13" height="7" rx="2" fill="#334155" />
          <rect x="85" y="74" width="13" height="7" rx="2" fill="#334155" />
          <rect x="102" y="74" width="13" height="7" rx="2" fill="#334155" />
          <rect x="119" y="74" width="13" height="7" rx="2" fill="#F43F5E" />

          {/* Numeric Keys Matrix */}
          <rect x="68" y="85" width="13" height="10" rx="2" fill="#475569" />
          <rect x="85" y="85" width="13" height="10" rx="2" fill="#475569" />
          <rect x="102" y="85" width="13" height="10" rx="2" fill="#475569" />
          <rect x="119" y="85" width="13" height="10" rx="2" fill="#38BDF8" />

          <rect x="68" y="99" width="13" height="10" rx="2" fill="#475569" />
          <rect x="85" y="99" width="13" height="10" rx="2" fill="#475569" />
          <rect x="102" y="99" width="13" height="10" rx="2" fill="#475569" />
          <rect x="119" y="99" width="13" height="10" rx="2" fill="#38BDF8" />

          <rect x="68" y="113" width="13" height="10" rx="2" fill="#475569" />
          <rect x="85" y="113" width="13" height="10" rx="2" fill="#475569" />
          <rect x="102" y="113" width="13" height="10" rx="2" fill="#10B981" />
          <rect x="119" y="113" width="13" height="10" rx="2" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // 8. LAB COAT ILLUSTRATION
  if (isLabCoat) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50/90 via-sky-50/40 to-white border border-cyan-100 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Main Coat Silhouette */}
          <path d="M 65 35 L 85 45 L 115 45 L 135 35 L 150 75 L 132 80 L 130 140 L 70 140 L 68 80 L 50 75 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          {/* Collar Lapels */}
          <polygon points="85,45 100,75 88,72" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2" />
          <polygon points="115,45 100,75 112,72" fill="#F0F9FF" stroke="#0284C7" strokeWidth="2" />
          {/* Center Seam & Buttons */}
          <line x1="100" y1="75" x2="100" y2="140" stroke="#BAE6FD" strokeWidth="2" />
          <circle cx="100" cy="85" r="2.5" fill="#0284C7" />
          <circle cx="100" cy="100" r="2.5" fill="#0284C7" />
          <circle cx="100" cy="115" r="2.5" fill="#0284C7" />
          <circle cx="100" cy="130" r="2.5" fill="#0284C7" />

          {/* Left Chest Pocket with Pens */}
          <rect x="75" y="72" width="18" height="20" rx="2" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="79" y1="67" x2="79" y2="74" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          <line x1="84" y1="65" x2="84" y2="74" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          {/* Campus Cross / Science Badge */}
          <rect x="110" y="75" width="14" height="14" rx="2" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
          <path d="M 117 78 L 117 86 M 113 82 L 121 82" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 9. BOOKS / TEXTBOOKS ILLUSTRATION
  if (isBooks) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50/80 via-amber-50/40 to-white border border-rose-100 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Bottom Book (Calculus / Blue) */}
          <rect x="35" y="105" width="130" height="24" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
          <rect x="42" y="108" width="118" height="18" rx="2" fill="#EFF6FF" />
          <line x1="38" y1="117" x2="52" y2="117" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Middle Book (Data Structures / Coral Rose) */}
          <rect x="45" y="80" width="115" height="25" rx="4" fill="#FB7185" stroke="#E11D48" strokeWidth="2.5" />
          <rect x="52" y="83" width="103" height="19" rx="2" fill="#FFF1F2" />
          <line x1="48" y1="92" x2="62" y2="92" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Golden Ribbon Bookmark */}
          <path d="M 130 80 L 130 112 L 135 107 L 140 112 L 140 80" fill="#F59E0B" />

          {/* Top Book (Physics / Emerald) */}
          <rect x="55" y="55" width="100" height="25" rx="4" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
          <rect x="62" y="58" width="88" height="19" rx="2" fill="#ECFDF5" />
          <line x1="58" y1="67" x2="72" y2="67" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 10. BACKPACK ILLUSTRATION
  if (isBackpack) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/40 to-white border border-indigo-100 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Top Grab Handle */}
          <path d="M 85 45 C 85 30, 115 30, 115 45" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Main Bag Dome */}
          <path d="M 55 135 L 55 70 C 55 45, 145 45, 145 70 L 145 135 Z" fill="#6366F1" stroke="#4338CA" strokeWidth="3" />
          {/* Top Zipper Arc */}
          <path d="M 68 70 C 68 55, 132 55, 132 70" stroke="#EEF2FF" strokeWidth="2" strokeDasharray="3 2" fill="none" />

          {/* Front Utility Pocket */}
          <rect x="65" y="85" width="70" height="45" rx="6" fill="#4F46E5" stroke="#3730A3" strokeWidth="2" />
          <line x1="72" y1="95" x2="128" y2="95" stroke="#A5B4FC" strokeWidth="2" strokeDasharray="2 2" />
          <rect x="94" y="105" width="12" height="6" rx="1.5" fill="#FB7185" />

          {/* Side Water Bottle Mesh Pocket */}
          <rect x="142" y="88" width="14" height="34" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <ellipse cx="149" cy="85" rx="5" ry="8" fill="#38BDF8" />
        </svg>
      </div>
    );
  }

  // 11. LAPTOP ILLUSTRATION
  if (isLaptop) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 via-rose-50/40 to-white border border-slate-200 shadow-sm ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
          {/* Screen Bezel */}
          <rect x="45" y="32" width="110" height="74" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          {/* Screen Glass with Code Editor */}
          <rect x="52" y="38" width="96" height="60" rx="3" fill="#1E1B4B" />
          {/* Code Syntax Lines */}
          <rect x="58" y="44" width="22" height="4" rx="1" fill="#F472B6" />
          <rect x="84" y="44" width="30" height="4" rx="1" fill="#38BDF8" />
          <rect x="64" y="52" width="45" height="4" rx="1" fill="#34D399" />
          <rect x="64" y="60" width="55" height="4" rx="1" fill="#FBBF24" />
          <rect x="58" y="68" width="18" height="4" rx="1" fill="#F472B6" />
          {/* Webcam Dot */}
          <circle cx="100" cy="35" r="1.5" fill="#94A3B8" />

          {/* Keyboard Deck & Trackpad */}
          <polygon points="25,122 175,122 160,106 40,106" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          <rect x="85" y="112" width="30" height="7" rx="1.5" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // 12. STATIONERY GENERAL / DEFAULT
  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50/80 via-pink-50/30 to-white border border-rose-100 shadow-sm ${sizeClasses} ${className}`}>
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        {/* Set Square Triangle */}
        <polygon points="35,125 125,125 125,35" fill="#FBCFE8" fillOpacity="0.8" stroke="#DB2777" strokeWidth="2.5" />
        <polygon points="65,115 115,115 115,65" fill="#FFFFFF" stroke="#BE185D" strokeWidth="1.5" />

        {/* Precision Compass */}
        <line x1="140" y1="40" x2="120" y2="125" stroke="#4F46E5" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="140" y1="40" x2="160" y2="125" stroke="#4F46E5" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="140" cy="40" r="7" fill="#818CF8" stroke="#312E81" strokeWidth="2" />
        <circle cx="140" cy="40" r="3" fill="#FFFFFF" />

        {/* Eraser */}
        <rect x="135" y="105" width="36" height="18" rx="3" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" transform="rotate(-15 135 105)" />
        <rect x="135" y="105" width="18" height="18" rx="2" fill="#93C5FD" stroke="#2563EB" strokeWidth="2" transform="rotate(-15 135 105)" />
      </svg>
    </div>
  );
};

export default ItemIllustration;
