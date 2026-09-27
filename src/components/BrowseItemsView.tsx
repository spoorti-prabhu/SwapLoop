import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { ItemCategory } from '../types/swaploop';
import { Search, Heart, Sparkles, Filter, Gift } from 'lucide-react';
import { CategoryVisual } from './CategoryVisual';

const CATEGORIES: Array<'All' | ItemCategory> = [
  'All',
  'Books',
  'Electronics',
  'Stationery',
  'Furniture',
  'Hostel Gear'
];

export const BrowseItemsView: React.FC = () => {
  const { currentUser, items, allUsers, toggleWant, isItemInWants } = useSwapLoop();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ItemCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  // Exclude logged-in student's own items (F3)
  const otherStudentsItems = items.filter(it => it.ownerId !== currentUser.id);

  const filteredItems = otherStudentsItems.filter(it => {
    const matchesCategory = selectedCategory === 'All' || it.category === selectedCategory;
    const matchesSearch =
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.condition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getOwnerName = (ownerId: string): string => {
    const owner = allUsers.find(u => u.id === ownerId);
    return owner ? owner.name : 'Campus Student';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search and Category Filter Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>F3 & F4 • Campus Circular Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Browse Campus Items
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Mark items you want with <span className="font-semibold text-pink-600">"I Want This"</span>. The Drop engine will automatically weave swap loops!
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drafter, bike, lamp..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-pink-50">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white shadow-sm shadow-pink-500/20'
                  : 'bg-[#fff7f9] hover:bg-pink-100 text-slate-600 border border-pink-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#fff7f9] flex items-center justify-center text-pink-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No items match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or category filter to discover items available across dorms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const inWants = isItemInWants(item.id);
            const ownerName = getOwnerName(item.ownerId);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Category Illustration & Badges */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <CategoryVisual category={item.category} className="w-12 h-12 flex-shrink-0" />
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#fff7f9] text-pink-600 font-semibold text-[11px] border border-pink-100">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {item.condition}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.valueBand === 'Low'
                              ? 'bg-blue-50 text-blue-700'
                              : item.valueBand === 'Medium'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {item.valueBand}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.isFreeGift && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <Gift className="w-3 h-3 text-emerald-600" />
                        Gift
                      </span>
                    )}
                  </h3>

                  <div className="text-xs text-slate-400 mt-2">
                    Listed by <span className="font-semibold text-slate-700">{ownerName}</span>
                  </div>
                </div>

                {/* Card Action: "I Want This" (F4) */}
                <div className="pt-5 mt-4 border-t border-pink-50">
                  <button
                    onClick={() => toggleWant(item.id)}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150 ${
                      inWants
                        ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white shadow-sm'
                        : 'bg-[#fff7f9] hover:bg-pink-100 text-pink-600 border border-pink-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWants ? 'fill-white text-white' : 'text-pink-500'}`} />
                    <span>{inWants ? 'In My Wants' : 'I Want This'}</span>
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
