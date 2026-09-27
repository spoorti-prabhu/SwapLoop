import React from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Heart, Trash2, ArrowRight, Sparkles } from 'lucide-react';

export const MyWantsView: React.FC = () => {
  const { currentUser, items, wants, toggleWant, allUsers, setActiveTab } = useSwapLoop();

  if (!currentUser) return null;

  // Filter items in user's wants list
  const userWantedItemIds = wants
    .filter(w => w.studentId === currentUser.id)
    .map(w => w.itemId);

  const wantedItems = items.filter(it => userWantedItemIds.includes(it.id));

  const getOwnerName = (ownerId: string): string => {
    const owner = allUsers.find(u => u.id === ownerId);
    return owner ? owner.name : 'Campus Student';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-400" />
            <span>Phase 2 • Desired Items</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Wants List
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            The Drop matching engine uses this list to connect you into circular trade loops across dorms.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('browse')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fff7f9] hover:bg-pink-100 text-pink-600 font-semibold text-xs border border-pink-200 transition-colors"
        >
          <span>Find More Items</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Wants Grid */}
      {wantedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#fff7f9] flex items-center justify-center text-pink-400">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Wants list is empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Browse items listed by other students and click "I Want This" to register your interest for the daily Drop!
          </p>
          <button
            onClick={() => setActiveTab('browse')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white font-semibold text-xs shadow-sm hover:opacity-95"
          >
            Browse Available Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wantedItems.map((item) => {
            const ownerName = getOwnerName(item.ownerId);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#fff7f9] text-pink-600 font-semibold text-[11px] border border-pink-100">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {item.condition} • {item.valueBand} Band
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>

                  <div className="text-xs text-slate-400 mt-2">
                    Owned by <span className="font-semibold text-slate-700">{ownerName}</span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-pink-50 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Eligible for Drop Matching
                  </span>

                  <button
                    onClick={() => toggleWant(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
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
