import React from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  X,
  Lock,
  ShieldCheck,
  EyeOff,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface BlindSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProposal?: () => void;
}

export const BlindSecurityModal: React.FC<BlindSecurityModalProps> = ({
  isOpen,
  onClose,
  onGoToProposal
}) => {
  const { proposals, currentUser, setActiveTab } = useSwapLoop();

  if (!isOpen) return null;

  // Find active proposal for the student if any
  const activeProposal = proposals.find(
    p =>
      (p.status === 'proposed' || p.status === 'sealed' || p.status === 'completed') &&
      p.members.some(m => m.studentId === currentUser?.id)
  ) || proposals[0];

  const handleNavigateToDashboard = () => {
    onClose();
    if (onGoToProposal) {
      onGoToProposal();
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] border border-pink-200/90 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-pink-100 pb-5">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus Privacy Protection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              The Strict Blind Rule
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Why student identities, photos, and dorm room details remain locked until a circular loop is 100% confirmed.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars of Blind Security */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Zero-Knowledge Codenames</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When the 5:00 PM drop forms a 3-way or 5-way loop, members are represented only as <em>Swapper 1</em>, <em>Swapper 2</em>, etc. Real names and room numbers are hidden from the frontend.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#db2777] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Unbiased Fairness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Decisions are based purely on item quality, condition, and value bands. Eliminates peer pressure, gender or popularity bias, and lowball haggling.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">5-Minute Expiry Window</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Loops operate on a synchronized 5-minute countdown clock. If anyone declines or ignores the offer, the loop dissolves with zero leakage of personal data.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Desk Escrow Unlocks Names</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Only when 100% of participants accept and deposit their items at the campus Swap Desk are real names and verified hostel contact notes unlocked.
            </p>
          </div>
        </div>

        {/* Live Proposal Context Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-pink-50 border border-pink-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#db2777]" />
              <span>Live Proposal Status:</span>
            </span>
            {activeProposal ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                {activeProposal.status === 'completed'
                  ? 'Completed (Identities Revealed)'
                  : activeProposal.status === 'sealed'
                  ? 'Sealed (At Swap Desk)'
                  : 'Active Blind Proposal'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                No Loop Queued
              </span>
            )}
          </div>
          <p className="text-slate-600 leading-relaxed">
            {activeProposal
              ? `You currently have proposal #${activeProposal.id.slice(-6).toUpperCase()} with ${activeProposal.members.length} members. You can review your Given vs. Received items on the Dashboard.`
              : 'Queue your items and wants to be matched during today\'s scheduled drop at 5:00 PM.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-pink-500" />
            <span>Encrypted under campus cryptographic verification standards.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleNavigateToDashboard}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#db2777] to-[#be185d] hover:from-[#be185d] hover:to-[#9d174d] text-white font-bold text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlindSecurityModal;
