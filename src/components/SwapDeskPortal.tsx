import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Package,
  Sparkles,
  Camera,
  ArrowRight
} from 'lucide-react';

interface SwapDeskPortalProps {
  selectedCampus?: string;
}

export const SwapDeskPortal: React.FC<SwapDeskPortalProps> = ({ selectedCampus = 'North Campus' }) => {
  const {
    proposals,
    deskDropoffItem,
    deskPickupItem,
    deskSimulateFailure,
    items,
    allUsers
  } = useSwapLoop();

  // Filter proposals eligible for Swap Desk
  const deskProposals = proposals.filter(
    p => p.status === 'sealed' || p.status === 'completed' || p.status === 'failed' || p.status === 'proposed' || p.status === 'eligible'
  );

  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    deskProposals[0]?.id || '0482'
  );
  const [activeTab, setActiveTab] = useState<'dropoff' | 'pickup'>('dropoff');
  const [codeInput, setCodeInput] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const activeProposal = deskProposals.find(p => p.id === selectedProposalId) || deskProposals[0];

  const getItem = (itemId: string) => {
    return items.find(i => i.id === itemId);
  };

  const getStudent = (studentId: string) => {
    return allUsers.find(u => u.id === studentId);
  };

  const handleVerifySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = codeInput.trim().replace(/\s+/g, '').toUpperCase();
    if (!cleanCode) return;

    if (!activeProposal) return;

    if (activeTab === 'dropoff') {
      const res = await deskDropoffItem(activeProposal.id, cleanCode);
      setFeedbackMessage({
        text: res.message,
        isError: !res.success
      });
      if (res.success) {
        setCodeInput('');
      }
    } else {
      const res = await deskPickupItem(activeProposal.id, cleanCode);
      setFeedbackMessage({
        text: res.message,
        isError: !res.success
      });
      if (res.success) {
        setCodeInput('');
      }
    }
  };

  const handleQuickFill = (code: string, mode: 'dropoff' | 'pickup') => {
    setActiveTab(mode);
    setCodeInput(code);
    setFeedbackMessage(null);
  };

  const isCompleted = activeProposal?.status === 'completed';
  const isFailed = activeProposal?.status === 'failed';
  const depositedCount = activeProposal?.members.filter(m => m.dropoffDone).length || 0;
  const totalCount = activeProposal?.members.length || 3;
  const allItemsAtDesk = totalCount > 0 && depositedCount === totalCount;
  const pickupCount = activeProposal?.members.filter(m => m.pickupDone).length || 0;

  // Format avatar initials or index
  const getAvatarInitials = (index: number) => `S${index + 1}`;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. TOP HEADER - EXACT MATCH TO media_1790611766142.png */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-[#db2777]">
            SWAP DESK · OPERATOR VIEW
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome to the desk.
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Verify handovers and keep every loop moving safely.
          </p>

          {/* ESCROW TERMINAL LOCATION BANNER (Requirement B.2) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs mt-3">
            <Building2 className="w-3.5 h-3.5 text-pink-400" />
            <span>RESIDENCE HALL of {selectedCampus} terminal#1</span>
          </div>
        </div>

        {/* Desk Open Indicator */}
        <div className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Desk open until 8:00 PM</span>
        </div>
      </div>

      {/* Multiple proposals selector if more than 1 */}
      {deskProposals.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Proposals:</span>
          {deskProposals.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProposalId(p.id);
                setFeedbackMessage(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProposalId === p.id
                  ? 'bg-[#db2777] text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
              }`}
            >
              #{p.id.slice(-4).toUpperCase()} ({p.members.filter(m => m.dropoffDone).length}/{p.members.length} Dropped)
            </button>
          ))}
        </div>
      )}

      {/* 2. TWO-COLUMN SPLIT LAYOUT - EXACT MATCH TO media_1790611766142.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE PROPOSAL CARD */}
        <div className="bg-white rounded-[2rem] border border-pink-100 p-6 sm:p-7 shadow-xs space-y-6">
          {/* Proposal Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#db2777]">
                ACTIVE PROPOSAL
              </div>
              <div className="text-xs font-bold text-[#db2777] mt-0.5 font-mono">
                #{activeProposal ? activeProposal.id.slice(-4).toUpperCase() : '0482'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })} evening loop
              </h2>
            </div>

            {/* Status Pill */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : isFailed
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : depositedCount === 0
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-pink-100 text-[#be185d] border border-pink-200/60'
              }`}
            >
              {isCompleted
                ? 'Completed'
                : isFailed
                ? 'Failed'
                : depositedCount === 0
                ? 'Yet to start'
                : 'In progress'}
            </span>
          </div>

          {/* Items Dropped Off Box */}
          <div className="bg-[#FFF7FA] border border-pink-100 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Package className="w-5 h-5 text-slate-700" />
                <span>Items dropped off</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {depositedCount} <span className="text-slate-400 font-medium text-sm">/ {totalCount}</span>
              </div>
            </div>

            {/* Pink Progress Bar */}
            <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : allItemsAtDesk
                    ? 'bg-gradient-to-r from-[#db2777] to-emerald-500'
                    : 'bg-[#db2777]'
                }`}
                style={{ width: `${Math.max(6, (depositedCount / totalCount) * 100)}%` }}
              />
            </div>

            {/* Status Message below progress bar */}
            <div className="text-xs text-slate-500 font-medium">
              {isCompleted ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All items dropped off and handed over to their new owners.
                </span>
              ) : allItemsAtDesk ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" /> All items secured in escrow! Handover: {pickupCount}/{totalCount} claimed.
                </span>
              ) : totalCount - depositedCount === 1 ? (
                'One more item to unlock pickup codes.'
              ) : depositedCount === 0 ? (
                'Awaiting item drop-offs from students.'
              ) : (
                `${totalCount - depositedCount} more items to unlock pickup codes.`
              )}
            </div>
          </div>

          {/* Swappers List */}
          <div className="space-y-3">
            {activeProposal?.members.map((member, idx) => {
              const gives = getItem(member.givesItemId);
              const student = getStudent(member.studentId);
              const avatarColors = [
                'bg-pink-500 text-white',
                'bg-emerald-500 text-white',
                'bg-pink-400 text-white',
                'bg-purple-500 text-white',
                'bg-amber-500 text-white'
              ];
              const avatarClass = avatarColors[idx % avatarColors.length];

              return (
                <div
                  key={member.studentId || idx}
                  className="bg-[#FFF7FA]/50 border border-pink-100 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-pink-200 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle Avatar: S1, S2, S3 */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 ${avatarClass}`}
                    >
                      {getAvatarInitials(idx)}
                    </div>

                    {/* Member Details - Unmasked for Operator */}
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-900 truncate flex items-center gap-1.5">
                        <span>{student?.name || member.name || member.codename}</span>
                        <span className="text-[10px] font-bold text-[#db2777] bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">
                          {member.codename}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        <span className="text-slate-600 font-medium">
                          {student?.contactNote || member.contactNote}
                        </span>
                        <span className="mx-1 text-slate-300">·</span>
                        {member.dropoffDone ? (
                          <span className="text-emerald-700 font-semibold">
                            Deposited: {gives?.title}
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Awaiting: {gives?.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {member.pickupDone ? (
                      <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                        ✓ Handed Over
                      </span>
                    ) : member.dropoffDone ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        ○ Waiting
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulate Deadline Failure (T3 feature) */}
          {!isCompleted && !isFailed && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => deskSimulateFailure(activeProposal.id)}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="Simulate 24-hour deadline expiration for testing return codes"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulate Deadline Failure (T3 Return Codes)</span>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: VERIFY A DROP-OFF / PICK-UP CARD */}
        <div className="bg-white rounded-[2rem] border border-pink-100 p-6 sm:p-7 shadow-xs space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-[#FFF7FA] border border-pink-100 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('dropoff');
                setFeedbackMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center ${
                activeTab === 'dropoff'
                  ? 'bg-white text-[#db2777] shadow-2xs font-extrabold border border-pink-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Verify Drop-off
            </button>
            <button
              onClick={() => {
                setActiveTab('pickup');
                setFeedbackMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                activeTab === 'pickup'
                  ? 'bg-white text-[#db2777] shadow-2xs font-extrabold border border-pink-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {!allItemsAtDesk && <Lock className="w-3 h-3 text-amber-500 inline" />}
              <span>Verify Pick-up</span>
            </button>
          </div>

          {/* Header */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#db2777]">
              {activeTab === 'dropoff' ? 'VERIFY A DROP-OFF' : 'VERIFY A PICK-UP'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {activeTab === 'dropoff' ? 'Enter the giver’s code.' : 'Enter the receiver’s code.'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {activeTab === 'dropoff'
                ? 'Ask the student for their single-use 6-digit code.'
                : 'Ask the student for their 6-digit pickup code to release their item.'}
            </p>
          </div>

          {/* Feedback Toast */}
          {feedbackMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
                feedbackMessage.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}
            >
              {feedbackMessage.isError ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Big Input Box - Match to media_1790611766142.png */}
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="bg-[#FFF7FA] border border-pink-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 focus-within:border-[#db2777] focus-within:ring-2 focus-within:ring-pink-100 transition-all shadow-inner">
              <Camera className="w-5 h-5 text-slate-400 flex-shrink-0 ml-1.5" />
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="000 000"
                maxLength={8}
                className="font-mono text-xl sm:text-2xl font-black tracking-[0.25em] text-slate-900 placeholder:text-slate-300 placeholder:tracking-[0.25em] bg-transparent outline-none flex-1 uppercase"
              />
              <button
                type="submit"
                className="w-12 h-12 rounded-xl bg-pink-200 hover:bg-[#db2777] text-pink-700 hover:text-white flex items-center justify-center font-bold transition-all shadow-xs cursor-pointer flex-shrink-0"
                title={activeTab === 'dropoff' ? 'Verify Drop-off' : 'Verify Pickup'}
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Reassurance text */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Codes are single-use and never visible to other students.</span>
            </div>
          </form>

          {/* Quick Test Helper for verification */}
          <div className="pt-4 border-t border-pink-100/80 space-y-3">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Click to test single-use codes:</span>
            </div>

            {activeTab === 'dropoff' ? (
              <div className="space-y-2">
                {activeProposal?.members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-pink-50/50 border border-pink-100"
                  >
                    <div className="font-semibold text-slate-700">
                      {m.codename || `Swapper ${idx + 1}`}:{' '}
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-pink-200">
                        {m.dropoffCode}
                      </span>
                    </div>
                    {m.dropoffDone ? (
                      <span className="text-[11px] text-emerald-600 font-bold">✓ Already Dropped</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleQuickFill(m.dropoffCode, 'dropoff')}
                        className="px-2.5 py-1 rounded-lg bg-[#db2777] text-white font-bold text-[10px] hover:opacity-90 cursor-pointer shadow-2xs"
                      >
                        Fill Code & Test
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {!allItemsAtDesk ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Pickup codes unlock once all students have completed their drop-off.</span>
                  </div>
                ) : (
                  activeProposal?.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-50/50 border border-emerald-100"
                    >
                      <div className="font-semibold text-slate-700">
                        {m.codename || `Swapper ${idx + 1}`}:{' '}
                        <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          {m.pickupCode}
                        </span>
                      </div>
                      {m.pickupDone ? (
                        <span className="text-[11px] text-purple-600 font-bold">✓ Picked Up</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickFill(m.pickupCode, 'pickup')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:opacity-90 cursor-pointer shadow-2xs"
                        >
                          Fill Code & Handover
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapDeskPortal;
