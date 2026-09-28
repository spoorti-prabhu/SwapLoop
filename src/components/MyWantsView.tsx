import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Heart, Trash2, ArrowRight, Sparkles, Search } from 'lucide-react';

export const MyWantsView: React.FC = () => {
  const { currentUser, items, wants, toggleWant, allUsers, setActiveTab } = useSwapLoop();
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  // Filter items in user's wants list
  const userWantedItemIds = wants
    .filter(w => w.studentId === currentUser.id)
    .map(w => w.itemId);

  const wantedItems = items.filter(it => userWantedItemIds.includes(it.id));

  const filteredWants = wantedItems.filter(it =>
    it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    it.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOwner = (ownerId: string) => {
    const owner = allUsers.find(u => u.id === ownerId);
    return owner || { name: 'Campus Student', trustLevel: 'New' };
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>Target Desires • Used in Daily 5:00 PM Drop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Desired Wants ({wantedItems.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Items you want. SwapLoop's engine will connect you with students who want your items in return!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter wants..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-pink-100 bg-[#fff7f9]/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-pink-400"
            />
          </div>

          <button
            onClick={() => setActiveTab('browse')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>Explore More Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Wants Grid */}
      {filteredWants.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
            <Heart className="w-10 h-10 fill-rose-200 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No wants match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Find something you actually want on campus. Browse student listings and tap "♡ I Want This" to enter the next 5:00 PM Drop!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            Browse Available Campus Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWants.map((item) => {
            const owner = getOwner(item.ownerId);
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
                className="bg-white rounded-3xl border border-pink-100 p-4 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Polaroid Photo */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-pink-50/50 mb-3 border border-pink-50 shadow-inner">
                    <img
                      src={photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-800 font-extrabold text-[10px] shadow-sm">
                        {item.condition}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1D1722]/85 backdrop-blur-sm text-white font-extrabold text-[10px] shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                      {item.valueBand} Value
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Offered by {owner.trustLevel} Swapper
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-pink-50 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Drop Eligible
                  </span>

                  <button
                    onClick={() => toggleWant(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Remove from wants"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default MyWantsView;
