import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Item, ItemCategory, ItemCondition, ValueBand } from '../types/swaploop';
import { Plus, Trash2, Edit2, Gift, Tag, X, Lock, Sparkles, Heart } from 'lucide-react';
import { ItemIllustration } from './ItemIllustration';

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
    if (currentUser.trustLevel === 'New' && band === 'Medium') {
      return '🔒 Medium: Unlocks at Trusted tier (3 completed swaps)';
    }
    if (currentUser.trustLevel === 'New' && band === 'High') {
      return '🔒 High: Unlocks at Veteran tier (8 completed swaps)';
    }
    if (currentUser.trustLevel === 'Trusted' && band === 'High') {
      return '🔒 High: Unlocks at Veteran tier (8 completed swaps)';
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
        title: title.trim(),
        category,
        condition,
        valueBand,
        isFreeGift
      });
    } else {
      addItem({
        title: title.trim(),
        category,
        condition,
        valueBand,
        isFreeGift
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-pink-500" />
            <span>Student Inventory • What You Can Give (F2 & T4)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Items ({myItems.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Items you have made available for campus circular exchanges. The 5:00 PM Drop pairs these with items you want!
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Trust Level Context Box */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-50/60 via-white to-purple-50/40 border border-pink-200/80 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-black text-sm">
            {currentUser.trustLevel[0]}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Active Trust Tier: <span className="text-pink-600 font-extrabold">{currentUser.trustLevel}</span> ({currentUser.completedSwapsCount} completed swaps)
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {currentUser.trustLevel === 'New' && 'Eligible for: Low Value items (up to $15). Complete 3 swaps to unlock Medium tier!'}
              {currentUser.trustLevel === 'Trusted' && 'Eligible for: Low & Medium Value items (up to $50). Complete 8 swaps for Veteran!'}
              {currentUser.trustLevel === 'Veteran' && 'Full Access: Eligible for Low, Medium, and High tier exchanges.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-white border border-pink-100 font-bold text-slate-700">
            Swap Score: <span className="text-pink-600">{currentUser.swapScore}</span>
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {myItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 flex items-center justify-center text-pink-500 border border-pink-100">
            <Plus className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No items listed yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Add something you no longer need this semester — a drafter, lab coat, textbook, or desk lamp. SwapLoop will find someone who needs it!
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF7F9] text-pink-700 font-bold text-[11px] border border-pink-100">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {item.condition}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.valueBand === 'Low'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : item.valueBand === 'Medium'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.valueBand} Band
                    </span>
                  </div>
                </div>

                {/* Polaroid Photo */}
                <div className="my-2 relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-pink-50/50 border border-pink-50 shadow-inner">
                  <img
                    src={item.imageUrl || (
                      item.category === 'Books' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80' :
                      item.category === 'Electronics' ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' :
                      item.category === 'Hostel Gear' ? 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' :
                      item.category === 'Furniture' ? 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' :
                      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'
                    )}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Title */}
                <div className="flex items-center justify-between gap-2 mt-2">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.isFreeGift && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex-shrink-0">
                      <Gift className="w-3 h-3 text-emerald-600" />
                      Free Gift
                    </span>
                  )}
                </div>

                {/* Proposal lock status indicator */}
                <div className="mt-3">
                  {item.isLockedInProposal ? (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>Locked in Active Drop Proposal</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Available for Next 5:00 PM Drop</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-pink-50 flex items-center justify-end gap-2">
                <button
                  disabled={item.isLockedInProposal}
                  onClick={() => openEditModal(item)}
                  className={`p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all ${
                    item.isLockedInProposal ? 'opacity-30 cursor-not-allowed' : ''
                  }`}
                  title="Edit item details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  disabled={item.isLockedInProposal}
                  onClick={() => deleteItem(item.id)}
                  className={`p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all ${
                    item.isLockedInProposal ? 'opacity-30 cursor-not-allowed' : ''
                  }`}
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL WITH LIVE CARD PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-pink-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-1">
                {editingItemId ? 'Update Item' : 'New Listing'}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {editingItemId ? 'Edit Item Details' : 'Add Item to Have List'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Interactive preview on the right shows how campus students will see your item.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Fields */}
              <form onSubmit={handleSubmit} className="md:col-span-7 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Item Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Mini drafter, Bicycle, Study table, Headphones..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 bg-[#fff7f9]/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    required
                  />
                </div>

                {/* Category & Condition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ItemCategory)}
                      className="w-full px-3 py-2.5 rounded-2xl border border-pink-200 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as ItemCondition)}
                      className="w-full px-3 py-2.5 rounded-2xl border border-pink-200 bg-[#fff7f9]/50 text-sm text-slate-800 focus:outline-none focus:border-pink-400"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Value Band (Trust Rule T4)
                    </label>
                    <span className="text-[11px] text-pink-600 font-extrabold">
                      Tier: {currentUser.trustLevel}
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
                                : 'bg-white text-slate-700 border-pink-200 hover:bg-pink-50'
                            }`}
                          >
                            <span>{band}</span>
                            {locked ? (
                              <span className="text-[9px] uppercase tracking-tighter text-rose-500 font-bold flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Locked
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-400">
                                {band === 'Low' ? '≤ $15' : band === 'Medium' ? '≤ $50' : '≤ $150'}
                              </span>
                            )}
                          </button>

                          {/* Explanatory Tooltip for locked band */}
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
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF7F9] border border-pink-200 cursor-pointer hover:border-pink-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFreeGift}
                    onChange={(e) => setIsFreeGift(e.target.checked)}
                    className="mt-0.5 rounded text-pink-600 focus:ring-pink-400"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-pink-600" />
                      List as a Free Gift (F11)
                    </span>
                    <p className="text-slate-500 mt-0.5">
                      No return demanded. Seeds campus Free Gift Chains where the final receiver passes forward a new gift!
                    </p>
                  </div>
                </label>

                <button
                  type="submit"
                  className="w-full h-11 mt-2 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 transition-all"
                >
                  <span>{editingItemId ? 'Save Changes' : 'List Item into Pool'}</span>
                </button>
              </form>

              {/* Right Column: LIVE VISUAL PREVIEW CARD */}
              <div className="md:col-span-5 bg-gradient-to-b from-pink-50/50 to-white rounded-2xl border border-pink-200/90 p-5 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-pink-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Feed Preview</span>
                </div>

                <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF7F9] text-pink-700 font-bold text-[10px] border border-pink-100">
                      {category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold">
                      {condition} • {valueBand}
                    </span>
                  </div>

                  <div className="flex justify-center py-2">
                    <ItemIllustration
                      title={title || 'Item Preview'}
                      category={category}
                      size="md"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {title.trim() || 'Your Item Title'}
                    </h4>
                    {isFreeGift && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200 mt-1">
                        <Gift className="w-2.5 h-2.5 text-emerald-600" />
                        Free Community Gift
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                      <span>By {currentUser.name}</span>
                      <span className="text-pink-600 font-bold">• {currentUser.trustLevel}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-pink-50">
                    <div className="w-full py-1.5 rounded-full bg-[#FFF7F9] text-pink-600 font-bold text-[10px] text-center border border-pink-100 flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3 text-pink-500" />
                      <span>♡ I Want This (Student View)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyItemsView;
