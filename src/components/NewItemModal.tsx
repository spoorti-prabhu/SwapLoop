import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { Category, Condition, SwapItem } from '../types';
import { TriangleLoopIcon } from './SwapLoopLogo';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (newItem: Omit<SwapItem, 'id' | 'postedTime' | 'swapCount'>) => void;
}

const CATEGORIES: Category[] = [
  'Textbooks',
  'Electronics',
  'Dorm & Living',
  'Clothing',
  'Bikes & Transit',
  'Kitchen',
  'Games & Hobbies'
];

const CONDITIONS: Condition[] = ['Like New', 'Gently Used', 'Good', 'Fair'];

const PRESET_SAMPLE_IMAGES: Record<Category, string> = {
  'Textbooks': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
  'Electronics': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80',
  'Dorm & Living': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=80',
  'Clothing': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
  'Bikes & Transit': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=700&q=80',
  'Kitchen': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
  'Games & Hobbies': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=700&q=80'
};

export const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Textbooks');
  const [condition, setCondition] = useState<Condition>('Like New');
  const [description, setDescription] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [campusDorm, setCampusDorm] = useState('West Quad Hall');
  const [customImageUrl, setCustomImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !lookingFor.trim()) return;

    const image = customImageUrl.trim() || PRESET_SAMPLE_IMAGES[category];

    onAddItem({
      title,
      category,
      condition,
      description,
      lookingFor,
      image,
      ownerName: 'Maya Lin',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      campusDorm,
      featured: false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F2E4EF] my-8 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-[#8A7E93] hover:text-[#1D1722] hover:bg-[#FAF3F8] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#DE5B9B] mb-2">
          <TriangleLoopIcon size={16} color="#DE5B9B" />
          <span>Add to the Campus Loop</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1722] tracking-tight mb-4">
          List an Item for Swap
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Title */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
              Item Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry Molecular Model Kit"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
              required
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* What are you looking for */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
              What would you like to swap this for?
            </label>
            <input
              type="text"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              placeholder="e.g. Desk lamp, TI-84 calculator, or plant cuttings"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
              Description & Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mention semester used, wear, accessories included, etc."
              className="w-full px-4 py-2 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10 resize-none"
              required
            />
          </div>

          {/* Dorm / Quad Location */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
              Your Dorm / Quad Area
            </label>
            <input
              type="text"
              value={campusDorm}
              onChange={(e) => setCampusDorm(e.target.value)}
              placeholder="e.g. West Quad Hall 304"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm focus:outline-none focus:border-[#DE5B9B]"
            />
          </div>

          {/* Image URL (Optional) */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577] flex items-center justify-between">
              <span>Photo URL (Optional)</span>
              <span className="text-[11px] text-[#A89CAE] flex items-center gap-1">
                <Upload className="w-3 h-3" /> Auto-assigned if empty
              </span>
            </label>
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="https://... (or leave blank for high-res photo)"
              className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4ED] bg-white text-[#1D1722] text-xs placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[48px] mt-4 rounded-full bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#DE5B9B]/25"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publish to Campus Loop</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewItemModal;
