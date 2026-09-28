import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SwapItem } from '../types';
import { safeHandoverLocations } from '../mockData';
import { TriangleLoopIcon } from './SwapLoopLogo';

interface SwapModalProps {
  item: SwapItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOffer: (item: SwapItem, offerDescription: string, location: string) => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmOffer,
}) => {
  const [offerText, setOfferText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(safeHandoverLocations[0].name);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerText.trim()) return;
    setIsSuccess(true);
    setTimeout(() => {
      onConfirmOffer(item, offerText, selectedLocation);
      setIsSuccess(false);
      setOfferText('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F2E4EF]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-[#8A7E93] hover:text-[#1D1722] hover:bg-[#FAF3F8] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3F8] text-[#DE5B9B] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-[#1D1722]">
              Swap Offer Sent!
            </h3>
            <p className="text-sm text-[#6F6577] max-w-sm mx-auto">
              We notified <span className="font-semibold text-[#1D1722]">the owner (identity protected)</span>. Once accepted, you'll finalize your exchange at <span className="font-semibold text-[#DE5B9B]">{selectedLocation}</span>.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#DE5B9B] mb-2">
              <TriangleLoopIcon size={16} color="#DE5B9B" />
              <span>Propose A Circular Trade</span>
            </div>

            <h3 className="text-2xl font-bold text-[#1D1722] tracking-tight mb-4">
              Swap for {item.title}
            </h3>

            {/* Item Mini Card */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF3F8] border border-[#F0E2EC] mb-5">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-xl border border-white"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#DE5B9B] uppercase tracking-wider">
                  {item.category} • {item.condition}
                </div>
                <div className="font-bold text-[#1D1722] truncate text-sm">
                  {item.title}
                </div>
                <div className="text-xs text-[#6F6577] truncate mt-0.5">
                  Looking for: <span className="text-[#302438] font-medium">{item.lookingFor}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* What are you offering */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577]">
                  What are you offering to swap?
                </label>
                <textarea
                  rows={3}
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  placeholder="Describe the item you'd like to trade (e.g. My Sony Bluetooth speaker or Organic Chem flashcard deck)..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm placeholder:text-[#ACA3B3] focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10 resize-none"
                  required
                />
              </div>

              {/* Safe Campus Handover Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6577] flex items-center justify-between">
                  <span>Designated Safe Handover Spot</span>
                  <span className="text-[11px] text-[#DE5B9B] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Campus Zone
                  </span>
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#F0E4ED] bg-white text-[#1D1722] text-sm focus:outline-none focus:border-[#DE5B9B] focus:ring-4 focus:ring-[#DE5B9B]/10"
                >
                  {safeHandoverLocations.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name} ({loc.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-[48px] rounded-full bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#DE5B9B]/25"
                >
                  <span>Dispatch Swap Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SwapModal;
