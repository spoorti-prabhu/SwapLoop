import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  Package,
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
  Sparkles,
  Key
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DeskLedgerView: React.FC = () => {
  const {
    items,
    proposals,
    allUsers,
    deskDropoffItem,
    deskPickupItem,
    deskSimulateFailure,
    triggerDropNow,
    dropCountdownSeconds
  } = useSwapLoop();

  // Local state for interactive code inputs per proposal
  const [dropInputs, setDropInputs] = useState<Record<string, string>>({});
  const [pickupInputs, setPickupInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ id: string; message: string; isError: boolean } | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [matchResultNote, setMatchResultNote] = useState<string | null>(null);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getItem = (itemId: string) => items.find((i) => i.id === itemId);
  const getStudent = (studentId: string) => allUsers.find((u) => u.id === studentId);

  const activeProposals = proposals.filter(
    (p) => p.status === 'sealed' || p.status === 'proposed' || p.status === 'eligible' || p.status === 'completed' || p.status === 'failed'
  );

  const handleRunDropNow = async () => {
    setIsTriggering(true);
    setMatchResultNote(null);
    try {
      const res = await triggerDropNow();
      setIsTriggering(false);
      if (res.matchedCount > 0) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
        setMatchResultNote(`⚡ Drop Executed: Created ${res.matchedCount} closed circular loop(s)!`);
      } else {
        setMatchResultNote(res.scenarioNote || 'Drop executed. No new closed loops found.');
      }
    } catch (err: any) {
      setIsTriggering(false);
      setMatchResultNote(err.message || 'Error running Drop');
    }
  };

  const handleReceiveItem = async (proposalId: string) => {
    const code = (dropInputs[proposalId] || '').trim().replace(/\s+/g, '').toUpperCase();
    if (!code) {
      setFeedback({ id: proposalId, message: 'Please enter a 6-character drop-off code', isError: true });
      return;
    }
    const res = await deskDropoffItem(proposalId, code);
    setFeedback({ id: proposalId, message: res.message, isError: !res.success });
    if (res.success) {
      setDropInputs((prev) => ({ ...prev, [proposalId]: '' }));
    }
  };

  const handleAuthorizePickup = async (proposalId: string) => {
    const code = (pickupInputs[proposalId] || '').trim().replace(/\s+/g, '').toUpperCase();
    if (!code) {
      setFeedback({ id: proposalId, message: 'Please enter a 6-character pickup code', isError: true });
      return;
    }
    const res = await deskPickupItem(proposalId, code);
    setFeedback({ id: proposalId, message: res.message, isError: !res.success });
    if (res.success) {
      setPickupInputs((prev) => ({ ...prev, [proposalId]: '' }));
    }
  };

  const handleQuickFill = (proposalId: string, code: string, type: 'drop' | 'pickup') => {
    if (type === 'drop') {
      setDropInputs((prev) => ({ ...prev, [proposalId]: code }));
    } else {
      setPickupInputs((prev) => ({ ...prev, [proposalId]: code }));
    }
    setFeedback(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. TOP SIMULATOR & TEST DROP CONSOLE */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-[#FFF7F9] to-[#FFF0F4] border border-pink-200/90 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#db2777]/10 border border-[#db2777]/20 text-xs font-black text-[#db2777] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-[#db2777]" />
                <span>Desk Operator · Drop Simulator & Escrow Ledger</span>
              </span>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-pink-200 text-xs font-bold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-pink-500" />
                <span>Next Scheduled Drop: {formatCountdown(dropCountdownSeconds)}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Desk Ledger & Verification Console
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
              Real-time audit log of all swappers, deposit statuses, contact records, and single-use verification tokens. Operators can simulate the swap or trigger the drop time immediately below.
            </p>
          </div>

          {/* RUN DROP NOW BUTTON (Exclusively for Desk Operator on-demand execution) */}
          <div className="flex flex-col items-start lg:items-end gap-2 flex-shrink-0">
            <button
              onClick={handleRunDropNow}
              disabled={isTriggering}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#db2777] hover:bg-[#be185d] text-white font-extrabold text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Processing Engine...' : '⚡ Run Drop Now (Instant Simulator)'}</span>
            </button>
            <span className="text-[11px] text-slate-500 font-medium">
              Simulates 5:00 PM drop matching cycle on-demand
            </span>
          </div>
        </div>

        {matchResultNote && (
          <div className="mt-4 p-3.5 rounded-2xl bg-white border border-pink-200 text-slate-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
            <Sparkles className="w-4 h-4 text-[#db2777] flex-shrink-0" />
            <span>{matchResultNote}</span>
          </div>
        )}
      </div>

      {/* 2. DEDICATED PROPOSAL CARDS & LEDGER TABLE — EXACT MATCH TO USER IMAGE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-[#db2777]">
            ESCROW VERIFICATION LEDGER
          </div>
          <span className="text-xs font-bold text-slate-500">
            {activeProposals.length} active loop(s) logged
          </span>
        </div>

        {activeProposals.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-pink-100 p-10 text-center space-y-3">
            <p className="text-sm font-bold text-slate-700">No proposals in ledger.</p>
            <p className="text-xs text-slate-400">Click "Run Drop Now" above to generate matching loops.</p>
          </div>
        ) : (
          activeProposals.map((proposal) => {
            const allDropped = proposal.members.every((m) => m.dropoffDone);
            const allPickedUp = proposal.members.every((m) => m.pickupDone);
            const isCompleted = proposal.status === 'completed' || allPickedUp;
            const isFailed = proposal.status === 'failed';

            const proposalFeedback = feedback?.id === proposal.id ? feedback : null;

            return (
              <div
                key={proposal.id}
                className="bg-white rounded-[2rem] border border-pink-100 p-6 sm:p-7 shadow-xs space-y-6 transition-all"
              >
                {/* PROPOSAL HEADER ROW (ID, Status Pill, Expiry Simulation) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-slate-900">
                      ID: {proposal.id}
                    </span>

                    {/* Live Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isCompleted
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : isFailed
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : allDropped
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100/90 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>🎉 Completed Loop</span>
                        </>
                      ) : isFailed ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Failed (Returned to Owners)</span>
                        </>
                      ) : allDropped ? (
                        <>
                          <Package className="w-3.5 h-3.5 text-emerald-600" />
                          <span>📦 All Items in Escrow · Ready for Pickup</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>⏳ Awaiting Item Drop-offs</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Simulate Expiry Button (T3) */}
                  {!isCompleted && !isFailed && (
                    <button
                      onClick={() => deskSimulateFailure(proposal.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                      title="Simulate 24-hour deadline failure and generate return codes"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Desk Failure: Simulate Expiry (T3)</span>
                    </button>
                  )}
                </div>

                {/* FEEDBACK BANNER */}
                {proposalFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      proposalFeedback.isError
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {proposalFeedback.isError ? (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{proposalFeedback.message}</span>
                  </div>
                )}

                {/* STUDENT CARDS GRID — MATCHING media_1790614438104.png */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proposal.members.map((member, idx) => {
                    const student = getStudent(member.studentId);
                    const gives = getItem(member.givesItemId);
                    const receives = getItem(member.receivesItemId);

                    return (
                      <div
                        key={member.studentId || idx}
                        className="bg-[#FFF7FA]/50 border border-pink-100 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs hover:border-pink-200 transition-colors"
                      >
                        {/* 1. Header: Student Name on left, Hostel/Phone on same line to right */}
                        <div className="flex items-center justify-between gap-2 border-b border-pink-100/70 pb-2">
                          <span className="font-extrabold text-sm text-slate-900 truncate">
                            {student?.name || member.name || member.codename}
                          </span>
                          <span className="text-[11px] font-bold text-[#db2777] truncate text-right">
                            {student?.contactNote || member.contactNote || 'Hostel Room · Phone'}
                          </span>
                        </div>

                        {/* 2. Item Deposit and Collect Rows */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Deposits:</span>
                            <span className="font-extrabold text-slate-900 truncate max-w-[170px]">
                              {gives?.title || 'Mini drafter'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Collects:</span>
                            <span className="font-extrabold text-slate-900 truncate max-w-[170px]">
                              {receives?.title || 'Headphones'}
                            </span>
                          </div>
                        </div>

                        {/* 3. Drop Code & Live Status Pill */}
                        <div className="pt-2 border-t border-pink-100/70 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-mono text-slate-700">
                            <Key className="w-3.5 h-3.5 text-[#db2777]" />
                            <span className="text-slate-500 font-sans font-medium">Drop Code:</span>
                            <span className="font-black text-slate-900 tracking-wider">
                              {member.dropoffCode}
                            </span>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              member.dropoffDone
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {member.dropoffDone ? '✅ Dropped' : '⏳ Awaiting drop-off'}
                          </span>
                        </div>

                        {/* 4. Pickup Code & Live Status Pill */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-mono text-slate-700">
                            <Package className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-slate-500 font-sans font-medium">Pickup Code:</span>
                            {allDropped ? (
                              <span className="font-black text-purple-700 tracking-wider">
                                {member.pickupCode}
                              </span>
                            ) : (
                              <span className="font-bold text-slate-400">🔒 Locked (T2)</span>
                            )}
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              member.pickupDone
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : allDropped
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {member.pickupDone
                              ? '🎉 Completed'
                              : allDropped
                              ? '📦 Ready for pickup'
                              : 'Locked'}
                          </span>
                        </div>

                        {/* Quick-test helper button */}
                        <div className="pt-2 flex items-center justify-end gap-1.5">
                          {!member.dropoffDone ? (
                            <button
                              type="button"
                              onClick={() => handleQuickFill(proposal.id, member.dropoffCode, 'drop')}
                              className="text-[10px] font-bold text-[#db2777] hover:underline cursor-pointer"
                            >
                              Fill Drop Code ➔
                            </button>
                          ) : !member.pickupDone && allDropped ? (
                            <button
                              type="button"
                              onClick={() => handleQuickFill(proposal.id, member.pickupCode, 'pickup')}
                              className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                            >
                              Fill Pickup Code ➔
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM ACTION BAR — EXACT MATCH TO media_1790614438104.png */}
                <div className="pt-2 border-t border-pink-100 flex flex-col lg:flex-row items-center justify-between gap-4">
                  {/* Left: Dropoff Code Input + Receive Item Button */}
                  <div className="w-full lg:w-1/2 flex items-center gap-2">
                    <input
                      type="text"
                      value={dropInputs[proposal.id] || ''}
                      onChange={(e) =>
                        setDropInputs((prev) => ({ ...prev, [proposal.id]: e.target.value.toUpperCase() }))
                      }
                      placeholder="INPUT 6-CHAR DROPOFF CODE"
                      maxLength={8}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 bg-[#FFF7FA] text-slate-900 font-mono text-xs font-black tracking-widest placeholder:text-slate-400 placeholder:tracking-normal outline-none focus:border-[#db2777] focus:ring-1 focus:ring-[#db2777]"
                    />
                    <button
                      type="button"
                      onClick={() => handleReceiveItem(proposal.id)}
                      className="px-5 py-2.5 rounded-xl bg-[#db2777] hover:bg-[#be185d] text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      Receive Item
                    </button>
                  </div>

                  {/* Right: Pickup Code Input + Authorize Pickup Button */}
                  <div className="w-full lg:w-1/2 flex items-center gap-2">
                    <input
                      type="text"
                      disabled={!allDropped}
                      value={pickupInputs[proposal.id] || ''}
                      onChange={(e) =>
                        setPickupInputs((prev) => ({ ...prev, [proposal.id]: e.target.value.toUpperCase() }))
                      }
                      placeholder={allDropped ? 'INPUT 6-CHAR PICKUP CODE' : 'LOCKED: AWAITING ALL ITEMS (T2)'}
                      maxLength={8}
                      className={`flex-1 px-4 py-2.5 rounded-xl border font-mono text-xs font-black tracking-widest outline-none transition-all ${
                        allDropped
                          ? 'border-emerald-200 bg-emerald-50/50 text-slate-900 placeholder:text-emerald-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                          : 'border-slate-200 bg-slate-100 text-slate-400 placeholder:text-slate-400 cursor-not-allowed'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={!allDropped}
                      onClick={() => handleAuthorizePickup(proposal.id)}
                      className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-all whitespace-nowrap ${
                        allDropped
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Authorize Pickup
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DeskLedgerView;
