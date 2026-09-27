import React, { useState } from 'react';
import { SwapLoopLogo, TriangleLoopIcon } from './SwapLoopLogo';
import { SwapItem, Category, UserProfile } from '../types';
import { safeHandoverLocations } from '../mockData';
import {
  Search,
  Plus,
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  MapPin,
  Leaf,
  LogOut,
  Filter,
  Heart
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  items: SwapItem[];
  onOpenNewItem: () => void;
  onSelectSwap: (item: SwapItem) => void;
  onSignOut: () => void;
}

const ALL_CATEGORIES: Array<'All' | Category> = [
  'All',
  'Textbooks',
  'Electronics',
  'Dorm & Living',
  'Clothing',
  'Bikes & Transit',
  'Kitchen',
  'Games & Hobbies'
];

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  items,
  onOpenNewItem,
  onSelectSwap,
  onSignOut,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lookingFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campusDorm.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF3F8] text-[#1D1722] selection:bg-[#F2D7E7] selection:text-[#63183E] pb-24">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0E2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo with 3-arrow triangle symbol */}
          <div className="flex items-center gap-6">
            <SwapLoopLogo variant="badge" badgeSize="w-10 h-10" />
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3F8] border border-[#F0E4ED] text-xs font-medium text-[#6F6577]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{user.university}</span>
              <span className="text-[#DE5B9B]">•</span>
              <span className="text-[#DE5B9B] font-semibold">Campus Circular Active</span>
            </div>
          </div>

          {/* Search Input in Top Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A89CAE] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, mini-fridges, tech..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#F0E4ED] bg-[#FCF8FB] text-sm text-[#1D1722] placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10 transition-all"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewItem}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-medium text-sm shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#DE5B9B]/25"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Post Swap</span>
            </button>

            {/* User Profile Pill & Sign out */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#F0E4ED]">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#DE5B9B]/30"
              />
              <button
                onClick={onSignOut}
                title="Sign out & Return to Login Screen"
                className="p-2 rounded-full text-[#7F7488] hover:text-[#DE5B9B] hover:bg-[#FAF3F8] transition-colors"
                aria-label="Return to Login"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Hero Circular Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F7EDF5] via-[#FCF8FB] to-[#F5E6F1] border border-[#F0E0EC] p-6 sm:p-10 shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#F0DEEC] text-xs font-bold uppercase tracking-wider text-[#DE5B9B]">
              <TriangleLoopIcon size={14} color="#DE5B9B" />
              <span>Campus Circular Economy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1722]">
              Welcome back, {user.name}
            </h1>

            <p className="text-sm sm:text-base text-[#6F6577] leading-relaxed">
              Every trade keeps dorm essentials in circulation, cuts student debt, and saves carbon emissions. No money, just neighborly value exchange.
            </p>

            {/* Impact Metric Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EEDCE9] text-[#1D1722]">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>{user.carbonSavedKg} kg CO₂ Diverted</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EEDCE9] text-[#1D1722]">
                <ArrowRightLeft className="w-4 h-4 text-[#DE5B9B]" />
                <span>{user.totalSwaps} Successful Campus Loops</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EEDCE9] text-[#1D1722]">
                <ShieldCheck className="w-4 h-4 text-[#DE5B9B]" />
                <span>100% Cashless & Safe Handovers</span>
              </div>
            </div>
          </div>

          {/* Decorative triangular loop in background */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <TriangleLoopIcon size={260} color="#DE5B9B" />
          </div>
        </section>

        {/* Categories Bar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#DE5B9B]" />
              <h2 className="text-lg font-bold text-[#1D1722]">Browse Active Campus Listings</h2>
            </div>
            <span className="text-xs text-[#8A7E93]">
              Showing {filteredItems.length} available items
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  selectedCategory === cat
                    ? 'bg-[#DE5B9B] text-white shadow-sm shadow-[#DE5B9B]/20'
                    : 'bg-white hover:bg-[#FAF3F8] text-[#55495E] border border-[#F0E4ED]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Listings Grid */}
        <section>
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#F0E2EC] p-8 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF3F8] flex items-center justify-center text-[#DE5B9B]">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#1D1722]">No swap items found</h3>
              <p className="text-sm text-[#6F6577] max-w-sm mx-auto">
                No items match your search or category filter. Try clearing filters or list the first one!
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-5 py-2 rounded-full bg-[#FAF3F8] text-[#DE5B9B] text-xs font-semibold hover:bg-[#F2E2ED]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-3xl border border-[#F0E2EC] overflow-hidden shadow-sm hover:shadow-md hover:border-[#E2C7DA] transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Item Image & Badge */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF3F8]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                            isFav ? 'bg-[#DE5B9B] text-white' : 'bg-white/80 text-[#8C7E93] hover:text-[#DE5B9B]'
                          }`}
                          aria-label="Save item"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                        </button>

                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-semibold text-[#DE5B9B] shadow-sm">
                            {item.condition}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#1D1722]/85 backdrop-blur-sm text-[11px] font-medium text-white shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Item Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-[#8C8095]">
                          <MapPin className="w-3.5 h-3.5 text-[#DE5B9B]" />
                          <span>{item.campusDorm}</span>
                          <span>•</span>
                          <span>{item.postedTime}</span>
                        </div>

                        <h3 className="font-bold text-base text-[#1D1722] line-clamp-1 group-hover:text-[#DE5B9B] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#6F6577] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Looking for box */}
                        <div className="p-3 rounded-2xl bg-[#FAF3F8] border border-[#F2E4EF]">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#DE5B9B] flex items-center gap-1 mb-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Looking To Swap For</span>
                          </div>
                          <p className="text-xs font-medium text-[#2E2436] line-clamp-2">
                            {item.lookingFor}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Propose Swap Button */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => onSelectSwap(item)}
                        className="w-full h-11 rounded-full bg-[#FAF3F8] hover:bg-[#DE5B9B] text-[#DE5B9B] hover:text-white border border-[#F0DFEC] hover:border-transparent font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-150 group/btn"
                      >
                        <TriangleLoopIcon size={14} className="group-hover/btn:rotate-180 transition-transform duration-300" />
                        <span>Propose Swap</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Campus Safe Handover Zone Banner */}
        <section className="rounded-3xl bg-white border border-[#F0E0EC] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DE5B9B]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Campus Safe Handover Network</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1722]">
                Meet safely on campus, always in daylight
              </h3>
              <p className="text-xs sm:text-sm text-[#6F6577] leading-relaxed">
                All SwapLoop trades take place at designated public university hubs equipped with CCTV and student staff. No cash exchanges permitted.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              {safeHandoverLocations.map((loc) => (
                <div key={loc.name} className="p-3 rounded-2xl bg-[#FAF3F8] border border-[#F0E4ED] text-xs">
                  <div className="font-bold text-[#1D1722]">{loc.name}</div>
                  <div className="text-[11px] text-[#DE5B9B] font-semibold mt-0.5">{loc.badge}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
