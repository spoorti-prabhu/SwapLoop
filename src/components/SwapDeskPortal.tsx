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
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ItemIllustration } from './ItemIllustration';

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

  // Filter proposals eligible for Swap Desk
  const deskProposals = proposals.filter(
    p => p.status === 'sealed' || p.status === 'completed' || p.status === 'failed'
  );

  const getItem = (itemId: string) => {
    return items.find(i => i.id === itemId);
  };

  const getStudent = (studentId: string) => {
    return allUsers.find(u => u.id === studentId);
  };

  const handleDropoffSubmit = async (proposalId: string, customCode?: string) => {
    const code = customCode || activeCodeInputs[proposalId]?.dropoff || '';
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

  const handlePickupSubmit = async (proposalId: string, customCode?: string) => {
    const code = customCode || activeCodeInputs[proposalId]?.pickup || '';
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
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. DESK OPERATOR HEADER */}
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-pink-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-pink-500" />
            <span>T2 & T3 • Physical Campus Escrow Station</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Swap Desk Escrow Station
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
            Campus physical custody checkpoint. Guarantees that no student gives up their item without guaranteed receipt of what they were promised.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Residence Hall Escrow Terminal #1</span>
        </div>
      </div>

      {/* 2. ESCROW CONVEYOR EXPLAINER */}
      <div className="p-6 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-pink-600 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Physical Escrow Pipeline Workflow</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
          <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-200 text-pink-800 font-bold">
            <div className="text-[10px] text-pink-400">STAGE 1</div>
            <div>EXPECTED</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-amber-800 font-bold">
            <div className="text-[10px] text-amber-400">STAGE 2</div>
            <div>DROPPED</div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-200 text-blue-800 font-bold">
            <div className="text-[10px] text-blue-400">STAGE 3</div>
            <div>VERIFIED</div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200 text-purple-800 font-bold">
            <div className="text-[10px] text-purple-400">STAGE 4</div>
            <div>SECURED (T2)</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-emerald-800 font-bold col-span-2 sm:col-span-1">
            <div className="text-[10px] text-emerald-500">STAGE 5</div>
            <div>PICKUP RELEASE</div>
          </div>
        </div>
      </div>

      {/* 3. PROPOSALS LIST */}
      {deskProposals.length === 0 ? (
        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 flex items-center justify-center text-pink-500 border border-pink-100">
            <Package className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No active proposals in desk escrow</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              When students accept their blind match in <strong>The Drop</strong> and choose Swap Desk, their item custody tracking appears here!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {deskProposals.map((proposal) => {
            const allItemsAtDesk = proposal.members.every(m => m.dropoffDone);
            const isCompleted = proposal.status === 'completed';
            const isFailed = proposal.status === 'failed';
            const depositedCount = proposal.members.filter(m => m.dropoffDone).length;
            const pickupCount = proposal.members.filter(m => m.pickupDone).length;
            const totalCount = proposal.members.length;
            const depositPercent = Math.round((depositedCount / totalCount) * 100);

            const currentInputs = activeCodeInputs[proposal.id] || { dropoff: '', pickup: '' };

            return (
              <div
                key={proposal.id}
                className={`bg-white rounded-[2.5rem] border p-6 sm:p-10 shadow-lg transition-all relative overflow-hidden ${
                  isCompleted
                    ? 'border-emerald-300 bg-gradient-to-b from-emerald-50/20 to-white ring-4 ring-emerald-50'
                    : isFailed
                    ? 'border-rose-300 bg-rose-50/20'
                    : allItemsAtDesk
                    ? 'border-emerald-300 ring-4 ring-emerald-50'
                    : 'border-pink-300 ring-4 ring-pink-50/50'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pink-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-slate-400">
                      ESCROW LOOP #{proposal.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isFailed
                          ? 'bg-rose-100 text-rose-800'
                          : allItemsAtDesk
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCompleted && '🎉 Completed Loop'}
                      {isFailed && '⚠️ Failed Loop (Deadline Expired)'}
                      {!isCompleted && !isFailed && allItemsAtDesk && '🔓 All items secured. Ready for pickup.'}
                      {!isCompleted && !isFailed && !allItemsAtDesk && '⏳ Awaiting Item Drop-offs'}
                    </span>
                  </div>

                  {/* Simulate Deadline Failure Button (T3) */}
                  {!isCompleted && !isFailed && (
                    <button
                      onClick={() => deskSimulateFailure(proposal.id)}
                      className="px-4 py-2 rounded-full border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-extrabold transition-colors flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>SIMULATE DEADLINE FAILURE (T3)</span>
                    </button>
                  )}
                </div>

                {/* Feedback Message */}
                {feedbackMessage && feedbackMessage.proposalId === proposal.id && (
                  <div
                    className={`mt-4 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
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

                {/* VISUAL LOCK / UNLOCK BANNER (T2) & CELEBRATION */}
                <div className="mt-6">
                  {isCompleted ? (
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-lg space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-8 h-8 text-amber-200 animate-spin" />
                          <div>
                            <div className="font-black text-lg uppercase tracking-wider">
                              ✨ SWAP COMPLETED — LOOP CLOSED ✨
                            </div>
                            <div className="text-xs text-emerald-100">
                              All items successfully deposited and collected by their new owners. Escrow custody successfully cleared!
                            </div>
                          </div>
                        </div>
                        <div className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-xs font-black uppercase tracking-widest border border-white/30">
                          Escrow Cleared
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/20 text-xs text-white/90 flex flex-wrap items-center gap-4">
                        <span>✓ Real student identities revealed</span>
                        <span>✓ Swap scores increased by +15</span>
                        <span>✓ Item transfers permanently recorded</span>
                      </div>
                    </div>
                  ) : !isFailed ? (
                    allItemsAtDesk ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
                        <Unlock className="w-6 h-6 text-emerald-600 flex-shrink-0 animate-bounce" />
                        <div>
                          <div className="font-black text-sm uppercase tracking-wide">
                            🔓 ALL ITEMS SECURED — READY FOR PICKUP
                          </div>
                          <div className="text-xs text-emerald-700 mt-0.5">
                            Every participant has deposited their item into campus escrow. Students may now present pickup codes to collect their new items!
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3">
                        <Lock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <div>
                          <div className="font-black text-sm uppercase tracking-wide">
                            🔒 PICKUP LOCKED (T2 ESCROW RULE)
                          </div>
                          <div className="text-xs text-amber-700 mt-0.5">
                            Everyone must drop their item before pickup codes unlock. Pickup codes are strictly disabled until all items arrive.
                          </div>
                        </div>
                      </div>
                    )
                  ) : null}
                </div>

                {/* ESCROW DEPOSIT PROGRESS TALLY */}
                {!isFailed && (
                  <div className="mt-5 p-4 rounded-2xl bg-[#FFF7FA] border border-pink-200/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#db2777]" />
                        <span>Escrow Custody Progress:</span>
                      </span>
                      <span className="font-mono text-[#be185d]">
                        {depositedCount} of {totalCount} Items Deposited ({depositPercent}%)
                        {allItemsAtDesk && (
                          <span className="ml-2 text-emerald-700 font-extrabold">• Handover Progress: {pickupCount}/{totalCount} Claimed</span>
                        )}
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-pink-100 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : allItemsAtDesk
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-[#db2777] to-amber-500'
                        }`}
                        style={{ width: `${isCompleted ? 100 : allItemsAtDesk ? Math.max(depositPercent, (pickupCount / totalCount) * 100) : depositPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* PHYSICAL ITEMS AT DESK CONVEYOR CARDS */}
                <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {proposal.members.map((member) => {
                    const student = getStudent(member.studentId);
                    const gives = getItem(member.givesItemId);

                    return (
                      <div
                        key={member.studentId}
                        className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                          member.pickupDone
                            ? 'bg-purple-50/50 border-purple-200'
                            : member.dropoffDone
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-white border-pink-200 shadow-sm'
                        }`}
                      >
                        <div>
                          {/* Student Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                            <div>
                              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                                {isCompleted ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{student?.name || member.name}</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{member.codename || 'Anonymous Swapper'}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {isCompleted ? (student?.contactNote || member.contactNote) : 'Identity protected'}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                member.pickupDone
                                  ? 'bg-purple-100 text-purple-700'
                                  : member.dropoffDone
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {member.pickupDone ? '✓ Handed Over' : member.dropoffDone ? '✓ Received' : '○ Waiting'}
                            </span>
                          </div>

                          {/* Object Illustration */}
                          <div className="my-4 flex justify-center">
                            <ItemIllustration
                              title={gives?.title || 'Item'}
                              category={gives?.category}
                              size="md"
                            />
                          </div>

                          <div className="text-center">
                            <div className="text-xs font-bold uppercase tracking-wider text-pink-600">
                              DEPOSITS PHYSICAL ITEM:
                            </div>
                            <div className="text-base font-extrabold text-slate-900 mt-0.5">
                              {gives?.title}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-pink-100/70 text-xs space-y-2">
                            <div className="flex justify-between items-center text-slate-700">
                              <span className="font-semibold text-[11px]">Drop-off Code (6-char):</span>
                              <div className="flex items-center gap-1.5">
                                <strong className="font-mono text-slate-900 text-xs tracking-wider bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-200">
                                  {member.dropoffCode}
                                </strong>
                                {!member.dropoffDone && !isCompleted && !isFailed && (
                                  <button
                                    onClick={() => handleDropoffSubmit(proposal.id, member.dropoffCode)}
                                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#db2777] to-[#be185d] hover:opacity-90 text-white text-[10px] font-bold shadow-xs cursor-pointer"
                                    title="Verify drop-off code and deposit item into escrow"
                                  >
                                    Verify & Deposit
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-slate-700">
                              <span className="font-semibold text-[11px]">Pickup Code (6-char):</span>
                              <div className="flex items-center gap-1.5">
                                {allItemsAtDesk ? (
                                  <>
                                    <strong className="font-mono text-emerald-800 text-xs tracking-wider bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                      {member.pickupCode}
                                    </strong>
                                    {!member.pickupDone && !isCompleted && !isFailed && (
                                      <button
                                        onClick={() => handlePickupSubmit(proposal.id, member.pickupCode)}
                                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-[10px] font-bold shadow-xs cursor-pointer"
                                        title="Verify pickup code and complete item handover"
                                      >
                                        Verify Handover
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                    <Lock className="w-3 h-3 text-amber-500" />
                                    <span>Locked until all arrive</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Return Code if failed (T3) */}
                            {member.returnCode && (
                              <div className="mt-3 p-3 rounded-2xl bg-rose-100 text-rose-800 text-xs">
                                <div className="font-bold flex items-center gap-1">
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Deposit Return Code Issued:</span>
                                </div>
                                <div className="font-mono font-black text-sm mt-1">{member.returnCode}</div>
                                <div className="text-[10px] text-rose-600 mt-0.5">Present to desk operator to reclaim deposited item.</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 4. OPERATOR INPUT FORM */}
                {!isCompleted && !isFailed && (
                  <div className="pt-6 border-t border-pink-100 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FFF7F9]/50 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 rounded-b-[2.5rem]">
                    {/* Receive Dropoff Input */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        1. Scan / Enter Drop-off Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentInputs.dropoff}
                          onChange={(e) =>
                            setActiveCodeInputs(prev => ({
                              ...prev,
                              [proposal.id]: { ...currentInputs, dropoff: e.target.value.toUpperCase() }
                            }))
                          }
                          placeholder="e.g. 6-CHAR DROPOFF CODE"
                          className="flex-1 px-4 py-2.5 rounded-2xl border border-pink-200 text-xs font-mono font-black text-slate-900 uppercase focus:outline-none focus:border-pink-400"
                        />
                        <button
                          onClick={() => handleDropoffSubmit(proposal.id)}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
                        >
                          Receive Item
                        </button>
                      </div>
                    </div>

                    {/* Authorize Pickup Input */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        2. Scan / Enter Pickup Code {allItemsAtDesk ? '(Unlocked)' : '(Locked - Awaiting Items)'}
                      </label>
                      <div className="flex gap-2">
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
                          placeholder={allItemsAtDesk ? "e.g. 6-CHAR PICKUP CODE" : "Locked: Awaiting all items (T2)"}
                          className="flex-1 px-4 py-2.5 rounded-2xl border border-pink-200 text-xs font-mono font-black text-slate-900 uppercase focus:outline-none focus:border-emerald-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                        <button
                          disabled={!allItemsAtDesk}
                          onClick={() => handlePickupSubmit(proposal.id)}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Authorize Pickup
                        </button>
                      </div>
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
