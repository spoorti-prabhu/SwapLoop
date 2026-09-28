import React, { useState, useRef } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { ItemCategory, ItemCondition, ValueBand } from '../types/swaploop';
import {
  X,
  Upload,
  Sparkles,
  Gift,
  Lock,
  AlertCircle,
  Camera,
  RefreshCw
} from 'lucide-react';

interface ListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ItemCategory[] = [
  'Books',
  'Electronics',
  'Lab Gear',
  'Furniture',
  'Clothing',
  'Stationery',
  'Hostel Gear'
];

const CONDITIONS: ItemCondition[] = ['Like New', 'Good', 'Fair'];
const VALUE_BANDS: ValueBand[] = ['Low', 'Medium', 'High'];

// Curated aesthetic campus item presets
const PRESET_PHOTOS: Record<ItemCategory, { title: string; url: string }> = {
  'Books': {
    title: 'Textbooks & Calculus Guide',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
  },
  'Electronics': {
    title: 'Noise Cancelling Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  },
  'Lab Gear': {
    title: 'Campus Lab Coat & Glassware',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
  },
  'Furniture': {
    title: 'Scandinavian Study Desk Lamp',
    url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
  },
  'Clothing': {
    title: 'Campus Winter Fleece Hoodie',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
  },
  'Stationery': {
    title: 'Engineering Mini Drafter & Pens',
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'
  },
  'Hostel Gear': {
    title: 'Campus Commuter Bicycle',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
  }
};

export const ListItemModal: React.FC<ListItemModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addItem } = useSwapLoop();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Books');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [valueBand, setValueBand] = useState<ValueBand>('Low');
  const [isFreeGift, setIsFreeGift] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  // Trust rule restriction (T4)
  const isValueBandLocked = (band: ValueBand): boolean => {
    if (currentUser.trustLevel === 'New') {
      return band === 'Medium' || band === 'High';
    }
    if (currentUser.trustLevel === 'Trusted') {
      return band === 'High';
    }
    return false; // Veteran permits all
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectPreset = (cat: ItemCategory) => {
    setCategory(cat);
    setImageUrl(PRESET_PHOTOS[cat].url);
    if (!title) {
      setTitle(PRESET_PHOTOS[cat].title);
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter an item title');
      return;
    }

    // MANDATORY IMAGE UPLOAD RULE
    if (!imageUrl.trim()) {
      setError('Item photography is required! Please upload a photo or pick a sample preset.');
      return;
    }

    if (isValueBandLocked(valueBand)) {
      setError(`Your trust tier (${currentUser.trustLevel}) cannot list ${valueBand} value items yet.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await addItem({
        title: title.trim(),
        category,
        condition,
        valueBand,
        imageUrl: imageUrl.trim(),
        isFreeGift
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to list item.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-pink-50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <div className="text-[#DE5B9B] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>List an Item to Swap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1D1722] tracking-tight">
            Add to the Campus Circular
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6577]">
            Items entered here are matched automatically during the daily 5:00 PM Drop.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN: Inputs */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Item Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Calculus Vol 2 Textbook"
                  className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-[#FFF7FA] text-sm text-[#1D1722] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10 transition-all font-medium"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as ItemCategory;
                    setCategory(newCat);
                    if (!imageUrl) {
                      setImageUrl(PRESET_PHOTOS[newCat].url);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-[#FFF7FA] text-sm text-[#1D1722] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10 transition-all font-medium cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Condition *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        condition === cond
                          ? 'bg-[#DE5B9B] text-white border-[#DE5B9B] shadow-sm'
                          : 'bg-[#FFF7FA] text-slate-700 border-pink-100 hover:border-pink-200'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Value Band */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Value Band (Trust Gated) *
                  </label>
                  <span className="text-[10px] text-pink-600 font-bold">
                    Tier: {currentUser.trustLevel}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {VALUE_BANDS.map((band) => {
                    const locked = isValueBandLocked(band);
                    const isSelected = valueBand === band;
                    return (
                      <button
                        key={band}
                        type="button"
                        disabled={locked}
                        onClick={() => setValueBand(band)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                          locked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-[#1D1722] text-white border-[#1D1722] shadow-sm'
                            : 'bg-[#FFF7FA] text-slate-700 border-pink-100 hover:border-pink-200'
                        }`}
                        title={
                          locked
                            ? `Locked: ${band} value requires ${band === 'Medium' ? 'Trusted (3+ swaps)' : 'Veteran (8+ swaps)'}`
                            : `${band} value tier`
                        }
                      >
                        {locked && <Lock className="w-3 h-3 text-slate-400" />}
                        <span>{band}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gift Toggle: "Give as Free Gift" */}
              <div className="pt-1">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFreeGift}
                    onChange={(e) => setIsFreeGift(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-400 border-emerald-300"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Give as Free Gift (Pay-it-forward Chain)</span>
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      Give without asking for an item back. Builds longest community gift chain!
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* RIGHT COLUMN: Aesthetic Image Uploader & Polaroid Preview */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Item Photography (Mandatory) *
              </label>

              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-3xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#DE5B9B] bg-pink-50'
                    : imageUrl
                    ? 'border-pink-200 bg-[#FFF7FA]'
                    : 'border-pink-200 hover:border-[#DE5B9B] bg-[#FFF7FA]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />

                {imageUrl ? (
                  /* Polaroid Frame Preview */
                  <div className="relative mx-auto max-w-[210px] bg-white p-2.5 pb-4 rounded-2xl shadow-md border border-pink-100">
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 mb-2">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-extrabold text-[#1D1722] truncate">
                        {title || 'Polaroid Preview'}
                      </div>
                      <div className="text-[10px] text-[#DE5B9B] font-bold mt-0.5">
                        {category} · {condition}
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                      <Camera className="w-3 h-3 text-[#DE5B9B]" />
                      <span>Click to replace photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-pink-100 text-[#DE5B9B] flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Drag & Drop photo here, or click to upload
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Supports JPG, PNG, WEBP (Instant Polaroid crop)
                    </div>
                  </div>
                )}
              </div>

              {/* 1-Click Curated Campus Presets */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Or Pick Fast Preset Photo:</span>
                  <Sparkles className="w-3 h-3 text-[#DE5B9B]" />
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSelectPreset(cat)}
                      className="px-2 py-1.5 rounded-xl border border-pink-100 bg-white hover:bg-pink-50 text-[10px] font-bold text-slate-700 truncate hover:text-[#DE5B9B] transition-all"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Listing Item...</span>
                </>
              ) : (
                <>
                  <span>List Item for Drop →</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListItemModal;
