import React, { useState } from 'react';
import { X, MapPin, Users, CheckCircle2, QrCode, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

interface SwapMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: any;
  currentUserId: string;
  onCheckinSuccess?: () => void;
}

export const SwapMeetModal: React.FC<SwapMeetModalProps> = ({
  isOpen,
  onClose,
  proposal,
  currentUserId,
  onCheckinSuccess
}) => {
  const [locationCode] = useState('CENTRAL_QUAD_2026');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !proposal) return null;

  const myMember = proposal.members.find((m: any) => m.studentId === currentUserId);
  const allCheckedIn = proposal.members.every((m: any) => m.checkedInMeet);

  const handleCheckin = async () => {
    setIsCheckingIn(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.meetCheckin(proposal.id, locationCode);
      setMessage(res.message);
      if (onCheckinSuccess) onCheckinSuccess();
    } catch (err: any) {
      setError(err.message || 'Check-in failed');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#fff7f9] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-pink-600 mb-2">
          <Users className="w-4 h-4" />
          <span>Peer-to-Peer Swap Meet (Section 17 & 29)</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
          Campus Quad Swap Meet
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          All swappers elected peer-to-peer handover at the designated Central Campus Quad zone.
        </p>

        {/* Location Spot Info */}
        <div className="p-4 rounded-2xl bg-[#fff7f9] border border-pink-200 mb-5 space-y-2 text-xs text-slate-700">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-pink-500" />
              Central Campus Quad • Gazebo Benches
            </span>
            <span className="text-[10px] text-pink-600 font-bold bg-pink-100 px-2 py-0.5 rounded-full">
              Daylight Zone
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Anti-Fake Geofence Rule: Handover codes remain locked until all students check in on-site.
          </p>
        </div>

        {/* Swappers Check-in Status */}
        <div className="space-y-2 mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Arrival Check-in Status ({proposal.members.filter((m: any) => m.checkedInMeet).length}/{proposal.members.length}):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {proposal.members.map((m: any) => (
              <div
                key={m.studentId}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  m.checkedInMeet
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="font-bold truncate">{m.name || m.codename}</span>
                {m.checkedInMeet ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <span className="text-[10px] text-slate-400">En route</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback message */}
        {message && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Handover Code Section (Only unlocks when everyone checked in!) */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              {allCheckedIn ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Handover Secret Unlocked!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Handover Secret: Locked</span>
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400">
              {allCheckedIn ? 'Exchange Ready' : 'Awaiting All Swappers'}
            </span>
          </div>

          {allCheckedIn ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">
                Your Handover Release Code
              </span>
              <span className="font-mono text-xl font-extrabold text-emerald-900 tracking-wider">
                {myMember?.pickupCode || 'SEC-7749'}
              </span>
              <p className="text-[10px] text-emerald-600 mt-1">
                Give this code to the sender only AFTER inspecting and receiving your item!
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
              Codes will unlock simultaneously on all participants' phones once all members check in.
            </div>
          )}
        </div>

        {/* Check-in Action */}
        {!myMember?.checkedInMeet && (
          <button
            onClick={handleCheckin}
            disabled={isCheckingIn}
            className="w-full h-11 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <QrCode className="w-4 h-4" />
            <span>{isCheckingIn ? 'Verifying Quad Location...' : 'Confirm Arrival at Campus Quad'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SwapMeetModal;
