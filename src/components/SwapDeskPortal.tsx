import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  Building2,
  KeyRound,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Package
} from 'lucide-react';

export const SwapDeskPortal: React.FC = () => {
  const {
    proposals,
    deskDropoffItem,
    deskPickupItem,
    deskSimulateFailure,
    items,
    allUsers
  } = useSwapLoop();

  const [activeCodeInputs, setActiveCodeInputs] = useState<Record<string, { dropoff: string; pickup: string }>>({});
  const [feedbackMessage, setFeedbackMessage] = useState<{ proposalId: string; text: string; isError: boolean } | null>(null);

  // Filter sealed proposals (or completed/failed)
  const deskProposals = proposals.filter(
    p => p.status === 'sealed' || p.status === 'completed' || p.status === 'failed'
  );

  const getItemTitle = (itemId: string): string => {
    const item = items.find(i => i.id === itemId);
    return item ? item.title : 'Item';
  };

  const getStudent = (studentId: string) => {
    return allUsers.find(u => u.id === studentId);
  };

  const handleDropoffSubmit = async (proposalId: string) => {
    const code = activeCodeInputs[proposalId]?.dropoff || '';
    if (!code.trim()) return;

    const res = await deskDropoffItem(proposalId, code);
    setFeedbackMessage({
      proposalId,
      text: res.message,
      isError: !res.success
    });

    if (res.success) {
      setActiveCodeInputs(prev => ({
        ...prev,
        [proposalId]: { ...prev[proposalId], dropoff: '' }
      }));
    }
  };

  const handlePickupSubmit = async (proposalId: string) => {
    const code = activeCodeInputs[proposalId]?.pickup || '';
    if (!code.trim()) return;

    const res = await deskPickupItem(proposalId, code);
    setFeedbackMessage({
      proposalId,
      text: res.message,
      isError: !res.success
    });

    if (res.success) {
      setActiveCodeInputs(prev => ({
        ...prev,
        [proposalId]: { ...prev[proposalId], pickup: '' }
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Desk Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>T2 & T3 • Physical Escrow Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Swap Desk Operator Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Hostel desk operator terminal for verifying drop-off codes, holding items in escrow, and releasing them via pickup codes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Hostel Escrow Station #1</span>
        </div>
      </div>

      {/* Escrow Rule Explainer (T2, T3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-start gap-3">
          <Lock className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block mb-0.5">Escrow Security Rule (T2):</span>
            Pickup codes remain strictly locked until <strong>100% of all items</strong> in the loop have been verified and deposited at the desk.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block mb-0.5">Deadline Failure Rule (T3):</span>
            If any student fails to bring their item by the deadline, operator triggers deadline failure. Automatic return codes are issued for items already at the desk.
          </div>
        </div>
      </div>

      {/* Proposals List */}
      {deskProposals.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#fff7f9] flex items-center justify-center text-pink-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No sealed proposals awaiting desk action</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Proposals appear here once all swappers accept their match in The Drop. Go to <strong className="text-pink-600">"The Drop"</strong> tab to trigger and accept proposals.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {deskProposals.map((proposal) => {
            const allItemsAtDesk = proposal.members.every(m => m.dropoffDone);
            const isCompleted = proposal.status === 'completed';
            const isFailed = proposal.status === 'failed';

            const currentInputs = activeCodeInputs[proposal.id] || { dropoff: '', pickup: '' };

            return (
              <div
                key={proposal.id}
                className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
                  isCompleted
                    ? 'border-purple-200 bg-purple-50/20'
                    : isFailed
                    ? 'border-rose-200 bg-rose-50/20'
                    : allItemsAtDesk
                    ? 'border-emerald-300 ring-2 ring-emerald-50'
                    : 'border-pink-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-pink-50">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      ID: {proposal.id.slice(-8)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isCompleted
                          ? 'bg-purple-100 text-purple-700'
                          : isFailed
                          ? 'bg-rose-100 text-rose-700'
                          : allItemsAtDesk
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCompleted && '🎉 Completed Loop'}
                      {isFailed && '⚠️ Failed Loop'}
                      {!isCompleted && !isFailed && allItemsAtDesk && '🔓 All items secured. Ready for pickup.'}
                      {!isCompleted && !isFailed && !allItemsAtDesk && '⏳ Awaiting Item Drop-offs'}
                    </span>
                  </div>

                  {/* Desk Failure Button (T3) */}
                  {!isCompleted && !isFailed && (
                    <button
                      onClick={() => deskSimulateFailure(proposal.id)}
                      className="px-3.5 py-1.5 rounded-full border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Desk Failure: Simulate Expiry (T3)</span>
                    </button>
                  )}
                </div>

                {/* Feedback Message */}
                {feedbackMessage && feedbackMessage.proposalId === proposal.id && (
                  <div
                    className={`mt-4 p-3 rounded-2xl text-xs flex items-center gap-2 ${
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

                {/* Members & Items Status Grid */}
                <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {proposal.members.map((member) => {
                    const student = getStudent(member.studentId);
                    const givesTitle = getItemTitle(member.givesItemId);
                    const receivesTitle = getItemTitle(member.receivesItemId);

                    return (
                      <div
                        key={member.studentId}
                        className="p-4 rounded-2xl border border-pink-100 bg-[#fff7f9]/60 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{student?.name}</span>
                          <span className="text-[10px] text-pink-600 font-semibold">{student?.contactNote}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-slate-600">
                            <span>Deposits:</span>
                            <strong className="text-slate-900">{givesTitle}</strong>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Collects:</span>
                            <strong className="text-slate-900">{receivesTitle}</strong>
                          </div>
                        </div>

                        {/* Dropoff Status */}
                        <div className="pt-2 border-t border-pink-100/60 flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-pink-500" />
                            <span>Drop Code:</span>
                            <strong className="font-mono text-slate-800">{member.dropoffCode}</strong>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              member.dropoffDone
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {member.dropoffDone ? '✓ In Escrow' : 'Missing'}
                          </span>
                        </div>

                        {/* Pickup Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1">
                            <QrCode className="w-3 h-3 text-emerald-600" />
                            <span>Pickup Code:</span>
                            <strong className="font-mono text-slate-800">
                              {allItemsAtDesk ? member.pickupCode : '🔒 Locked (T2)'}
                            </strong>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              member.pickupDone
                                ? 'bg-purple-100 text-purple-700'
                                : allItemsAtDesk
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {member.pickupDone ? '✓ Handed Over' : allItemsAtDesk ? 'Ready' : 'Locked'}
                          </span>
                        </div>

                        {/* Return Code if failed */}
                        {member.returnCode && (
                          <div className="p-2 rounded-xl bg-rose-100 text-rose-800 text-[11px] font-medium">
                            Return Code: <strong className="font-mono">{member.returnCode}</strong> (Item returned to student)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Operator Inputs Bar */}
                {!isCompleted && !isFailed && (
                  <div className="pt-4 border-t border-pink-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. Dropoff Input */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={currentInputs.dropoff}
                          onChange={(e) =>
                            setActiveCodeInputs(prev => ({
                              ...prev,
                              [proposal.id]: { ...currentInputs, dropoff: e.target.value.toUpperCase() }
                            }))
                          }
                          placeholder="Input 6-char Dropoff Code"
                          className="w-full pl-3 pr-3 py-2 rounded-xl border border-pink-200 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:border-pink-400"
                        />
                      </div>
                      <button
                        onClick={() => handleDropoffSubmit(proposal.id)}
                        className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs transition-colors"
                      >
                        Receive Item
                      </button>
                    </div>

                    {/* 2. Pickup Input (Enabled only when T2 is satisfied) */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          disabled={!allItemsAtDesk}
                          value={currentInputs.pickup}
                          onChange={(e) =>
                            setActiveCodeInputs(prev => ({
                              ...prev,
                              [proposal.id]: { ...currentInputs, pickup: e.target.value.toUpperCase() }
                            }))
                          }
                          placeholder={allItemsAtDesk ? "Input 6-char Pickup Code" : "Locked: Awaiting all items (T2)"}
                          className="w-full pl-3 pr-3 py-2 rounded-xl border border-pink-200 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:border-emerald-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <button
                        disabled={!allItemsAtDesk}
                        onClick={() => handlePickupSubmit(proposal.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Authorize Pickup
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SwapDeskPortal;
