import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { ItemCategory } from '../types/swaploop';
import { Search, Heart, Sparkles, Filter, Gift, Check, Shield, MailCheck, X } from 'lucide-react';
import { ItemIllustration } from './ItemIllustration';

const CATEGORIES: Array<'All' | ItemCategory> = [
  'All',
  'Books',
  'Electronics',
  'Lab Gear',
  'Furniture',
  'Clothing',
  'Stationery',
  'Hostel Gear'
];

export const BrowseItemsView: React.FC = () => {
  const {
    currentUser,
    items,
    allUsers,
    toggleWant,
    isItemInWants,
    toggleEmailVerified,
    impersonateUser
  } = useSwapLoop();

  const [selectedCategory, setSelectedCategory] = useState<'All' | ItemCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [justWantedId, setJustWantedId] = useState<string | null>(null);
  const [justRemovedId, setJustRemovedId] = useState<string | null>(null);

  if (!currentUser) return null;

  // Exclude logged-in student's own items (F3)
  const otherStudentsItems = items.filter(it => it.ownerId !== currentUser.id);

  const filteredItems = otherStudentsItems.filter(it => {
    const matchesCategory = selectedCategory === 'All' || it.category === selectedCategory;
    const matchesSearch =
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.valueBand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Strict Privacy: Always return anonymous identifier before completed swap (Section 6 & 8)
  const getAnonymousOwner = (ownerId: string, index: number) => {
    const owner = allUsers.find(u => u.id === ownerId);
    return {
      codename: `Swapper #${(index % 8) + 1}`,
      trustLevel: owner?.trustLevel || 'New'
    };
  };

  const handleToggleWant = (itemId: string) => {
    const wasInWants = isItemInWants(itemId);
    toggleWant(itemId);

    if (!wasInWants) {
      setJustWantedId(itemId);
      setJustRemovedId(null);
      setTimeout(() => setJustWantedId(null), 2400);
    } else {
      setJustRemovedId(itemId);
      setJustWantedId(null);
      setTimeout(() => setJustRemovedId(null), 2400);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. TOP CONTEXT BAR: Email Verified Banner & Demo Student Switcher (Matching Reference Screenshot) */}
      <div className="space-y-3">
        {/* Email verification bar */}
        <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200/90 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-950 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <MailCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Email verified</strong> — <span className="font-mono text-emerald-800">{currentUser.email}</span>
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-800 hover:text-emerald-950 select-none">
            <input
              type="checkbox"
              checked={currentUser.emailVerified}
              onChange={toggleEmailVerified}
              className="w-4 h-4 rounded text-pink-600 focus:ring-pink-400 border-emerald-300"
            />
            <span>Email verified</span>
          </label>
        </div>

        {/* Quick Demo Student Switcher Pills (from screenshot) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold text-[11px]">Demo as:</span>
          {allUsers.filter(u => u.role === 'Student').slice(0, 5).map((u) => {
            const isSelected = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => impersonateUser(u.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white shadow-sm shadow-pink-500/25 scale-105'
                    : 'bg-white hover:bg-pink-50 text-slate-600 border border-pink-100 hover:border-pink-200'
                }`}
              >
                {u.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ELEVATED HERO: BROWSE CAMPUS ITEMS */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-[#FFF7F9] to-[#FFF0F4] border border-pink-200/90 p-8 sm:p-12 shadow-sm">
        {/* Soft background ambient blurs */}
        <div className="absolute top-0 right-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-bold uppercase tracking-wider text-pink-700">
              <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
              <span>Campus Circular Discovery Feed</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              BROWSE CAMPUS ITEMS
            </h1>

            <p className="text-base sm:text-lg text-slate-700 font-semibold italic">
              "Maybe what you need is already sitting in another room."
            </p>

            <p className="text-sm text-slate-500 font-medium">
              Mark what you want with <span className="text-pink-600 font-bold">"♡ I Want This"</span>. The 5:00 PM Drop finds the hidden connection without money, bargaining, or public chat.
            </p>
          </div>

          {/* Right Visual: Subtle Animated SwapLoop Orbit with Floating Campus Objects */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-dashed border-pink-300 flex items-center justify-center p-3 animate-spin" style={{ animationDuration: '24s' }}>
              {/* Central Core Logo */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 -rotate-12 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              {/* Orbiting Satellite Node 1 (Bicycle) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-white border border-pink-200 shadow-md flex items-center justify-center p-1">
                <ItemIllustration title="Bicycle" size="sm" className="w-7 h-7" />
              </div>

              {/* Orbiting Satellite Node 2 (Headphones) */}
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-9 h-9 rounded-xl bg-white border border-pink-200 shadow-md flex items-center justify-center p-1">
                <ItemIllustration title="Headphones" size="sm" className="w-7 h-7" />
              </div>

              {/* Orbiting Satellite Node 3 (Mini Drafter) */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-white border border-pink-200 shadow-md flex items-center justify-center p-1">
                <ItemIllustration title="Mini drafter" size="sm" className="w-7 h-7" />
              </div>

              {/* Orbiting Satellite Node 4 (Extension Board) */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-9 h-9 rounded-xl bg-white border border-pink-200 shadow-md flex items-center justify-center p-1">
                <ItemIllustration title="Extension board" size="sm" className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY CONTROLS */}
      <div className="space-y-4">
        {/* Full-width Search Input */}
        <div className="relative w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by title, condition, category, or value band..."
            className="w-full pl-12 pr-10 py-3.5 rounded-full border border-pink-200/90 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills with Counters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
          {CATEGORIES.map((cat) => {
            const count = cat === 'All'
              ? otherStudentsItems.length
              : otherStudentsItems.filter(i => i.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white shadow-md shadow-pink-500/20 scale-102'
                    : 'bg-white hover:bg-pink-50 text-slate-700 border border-pink-100/90 shadow-sm'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Interaction Feedback Toast */}
      {justWantedId && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-bounce border border-pink-500/30">
          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
          <span>Added to My Wants! Will be matched in today's 5:00 PM Drop.</span>
        </div>
      )}

      {justRemovedId && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-full bg-slate-800 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-fadeIn border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Removed from My Wants.</span>
        </div>
      )}

      {/* 4. ULTRA-PREMIUM PRODUCT DISCOVERY GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-pink-100 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 flex items-center justify-center text-pink-400 border border-pink-100">
            <Search className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No campus items found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              No active listings match your criteria. Try adjusting your search query or switching categories.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-xs border border-pink-200 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => {
            const inWants = isItemInWants(item.id);
            const owner = getAnonymousOwner(item.ownerId, idx);
            const photoUrl = item.imageUrl || (
              item.category === 'Books' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' :
              item.category === 'Electronics' ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' :
              item.category === 'Hostel Gear' ? 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' :
              item.category === 'Furniture' ? 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' :
              'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'
            );

            return (
              <div
                key={item.id}
                className="group relative bg-white p-3.5 sm:p-4 rounded-3xl border border-pink-100/90 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1"
              >
                {/* Upper Half: Aesthetic Polaroid Photo Frame */}
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-pink-50/50 mb-3 border border-pink-50 shadow-inner">
                    <img
                      src={photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Clean Status Tags */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-800 font-extrabold text-[10px] shadow-sm border border-pink-100/60">
                        {item.condition}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1D1722]/85 backdrop-blur-sm text-white font-extrabold text-[10px] shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    {item.isFreeGift && (
                      <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md">
                        <Gift className="w-3 h-3 text-white" />
                        <span>Free Gift</span>
                      </div>
                    )}
                  </div>

                  {/* Polaroid Lower Content */}
                  <div className="px-1 space-y-2">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-pink-600 transition-colors tracking-tight line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          item.valueBand === 'Low' ? 'bg-emerald-500' : item.valueBand === 'Medium' ? 'bg-purple-500' : 'bg-amber-500'
                        }`} />
                        <span className="font-bold text-slate-700 text-xs">
                          {item.valueBand} Value
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold" title="Strictly anonymous before loop completion">
                        <Shield className="w-3 h-3 text-pink-400" />
                        <span>{owner.codename}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action: "I Want This" Toggle */}
                <div className="pt-3 px-1">
                  <button
                    onClick={() => handleToggleWant(item.id)}
                    className={`w-full py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center transition-all duration-200 transform active:scale-95 cursor-pointer ${
                      inWants
                        ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white shadow-md shadow-pink-500/25 ring-2 ring-pink-300'
                        : 'bg-[#FFF7FA] hover:bg-pink-100 text-[#DE5B9B] border border-pink-200/80 hover:border-pink-300'
                    }`}
                  >
                    <span className="tracking-wide uppercase text-[11px]">
                      {inWants ? 'In My Wants' : 'I Want This'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseItemsView;
