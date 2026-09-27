import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Item, ItemCategory, ItemCondition, ValueBand } from '../types/swaploop';
import { Plus, Trash2, Edit2, ShieldAlert, Gift, Tag, X } from 'lucide-react';
import { CategoryVisual } from './CategoryVisual';

const CATEGORIES: ItemCategory[] = ['Books', 'Electronics', 'Stationery', 'Furniture', 'Hostel Gear'];
const CONDITIONS: ItemCondition[] = ['Like New', 'Good', 'Fair'];
const VALUE_BANDS: ValueBand[] = ['Low', 'Medium', 'High'];

export const MyItemsView: React.FC = () => {
  const { currentUser, items, addItem, editItem, deleteItem } = useSwapLoop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Stationery');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [valueBand, setValueBand] = useState<ValueBand>('Low');
  const [isFreeGift, setIsFreeGift] = useState(false);

  if (!currentUser) return null;

  const myItems = items.filter(it => it.ownerId === currentUser.id);

  // Trust rule check (T4)
  const isValueBandLocked = (band: ValueBand): boolean => {
    if (currentUser.trustLevel === 'New') {
      return band === 'Medium' || band === 'High';
    }
    if (currentUser.trustLevel === 'Trusted') {
      return band === 'High';
    }
    return false; // Veteran unlocks all
  };

  const getLockReason = (band: ValueBand): string => {
    if (currentUser.trustLevel === 'New' && (band === 'Medium' || band === 'High')) {
      return 'Unlocks at Trusted level (3+ completed swaps)';
    }
    if (currentUser.trustLevel === 'Trusted' && band === 'High') {
      return 'Unlocks at Veteran level (8+ completed swaps)';
    }
    return '';
  };

  const openAddModal = () => {
    setEditingItemId(null);
    setTitle('');
    setCategory('Stationery');
    setCondition('Like New');
    setValueBand('Low');
    setIsFreeGift(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setCondition(item.condition);
    setValueBand(item.valueBand);
    setIsFreeGift(item.isFreeGift);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItemId) {
      editItem(editingItemId, {
        title,
        category,
        condition,
        valueBand,
        isFreeGift
      });
    } else {
      addItem({
        title,
        category,
        condition,
        valueBand,
        isFreeGift
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>F2 & T4 • Student Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Items (Have)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Items you have placed into the campus pool. The matching engine will propose trades for things in your Wants list.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Trust Rule Banner */}
      <div className="bg-[#fff7f9] p-4 rounded-2xl border border-pink-200 flex items-start gap-3 text-xs text-slate-700">
        <ShieldAlert className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Trust Rule (T4): </span>
          You are currently at <span className="font-semibold text-pink-600 font-mono">[{currentUser.trustLevel}]</span> tier ({currentUser.completedSwapsCount} swaps completed).{' '}
          {currentUser.trustLevel === 'New' && (
            <span>You can list and receive <strong>Low</strong> value-band items. Medium and High unlock after 3 completed swaps.</span>
          )}
          {currentUser.trustLevel === 'Trusted' && (
            <span>You can list and receive <strong>Low</strong> and <strong>Medium</strong> items. High unlocks after 8 swaps.</span>
          )}
          {currentUser.trustLevel === 'Veteran' && (
            <span>You have full unrestricted access to all value bands (Low, Medium, High).</span>
          )}
        </div>
      </div>

      {/* Items Grid */}
      {myItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#fff7f9] flex items-center justify-center text-pink-400">
            <Tag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No items in your Have list</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't listed anything yet. Add your extra textbooks, drafters, or hostel gear to start swapping!
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold text-xs transition-colors"
          >
            Add My First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                item.isLockedInProposal ? 'border-amber-300 ring-2 ring-amber-100' : 'border-pink-100'
              }`}
            >
              <div>
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
                        {item.valueBand} Band
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.isFreeGift && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <Gift className="w-3 h-3 text-emerald-600" />
                      Free Gift
                    </span>
                  )}
                </h3>

                {item.isLockedInProposal && (
                  <div className="mt-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Currently locked in an active Drop proposal!</span>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-pink-50 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Owner: <strong className="text-slate-700">{currentUser.name}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    disabled={item.isLockedInProposal}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={item.isLockedInProposal}
                    className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#fff7f9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-1">
              {editingItemId ? 'Update Item' : 'New Listing (F2)'}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {editingItemId ? 'Edit Item Details' : 'Add Item to Have List'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Mini drafter, Lab coat, Wireless mouse"
                  className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                  required
                />
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-pink-100 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Value Band with T4 Trust Enforcement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Value Band (T4 Trust Rule)
                  </label>
                  <span className="text-[11px] text-pink-600 font-semibold">
                    Current Tier: {currentUser.trustLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {VALUE_BANDS.map((band) => {
                    const locked = isValueBandLocked(band);
                    const isSelected = valueBand === band;
                    const reason = getLockReason(band);

                    return (
                      <div key={band} className="relative group">
                        <button
                          type="button"
                          disabled={locked}
                          onClick={() => setValueBand(band)}
                          className={`w-full py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white border-transparent shadow-sm'
                              : locked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : 'bg-white text-slate-700 border-pink-100 hover:bg-[#fff7f9]'
                          }`}
                        >
                          <span>{band}</span>
                          {locked && <span className="text-[9px] uppercase tracking-tighter">🔒 Locked</span>}
                        </button>

                        {/* Tooltip on hover for locked bands (T4) */}
                        {locked && (
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-lg z-20 pointer-events-none text-center">
                            {reason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Free Gift Checkbox (F11) */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#fff7f9] border border-pink-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFreeGift}
                  onChange={(e) => setIsFreeGift(e.target.checked)}
                  className="mt-0.5 rounded text-pink-500 focus:ring-pink-400"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-pink-500" />
                    List as a Free Gift (F11)
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    Item is given with no return demanded. The Drop matching engine will build gift chains to rehome it across students.
                  </p>
                </div>
              </label>

              <button
                type="submit"
                className="w-full h-11 mt-2 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>{editingItemId ? 'Save Changes' : 'List Item into Pool'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyItemsView;
