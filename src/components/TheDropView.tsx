import React, { useState, useEffect } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  RotateCw,
  Clock,
  Zap,
  Eye,
  CheckCircle2,
  UserCheck,
  Building2,
  Users,
  Sparkles,
  AlertTriangle,
  Lock,
  Check
} from 'lucide-react';
import { SwapMeetModal } from './SwapMeetModal';
import { ReportModal } from './ReportModal';
import { ItemIllustration } from './ItemIllustration';

const MATCHING_STEPS = [
  '1/9 • Identifying eligible students across campus residence halls...',
  '2/9 • Loading active Have inventories (Drafter, Bicycle, Ext Board, Table Lamp)...',
  '3/9 • Connecting Want vectors into directed edge graph...',
  '4/9 • Discovering simple cycles of length 3 to 5...',
  '5/9 • Applying Trust T4 filters (Value bands vs completed swaps)...',
  '6/9 • Enforcing 3–5 member loop rule (disqualifying 2-person loops)...',
  '7/9 • Resolving conflicting resource edges across overlapping candidates...',
  '8/9 • Branch-and-bound optimization maximizing students satisfied...',
  '9/9 • Generating cryptographically sealed Blind Proposals!'
];

export const TheDropView: React.FC = () => {
  const {
    currentUser,
    proposals,
    dropCountdownSeconds,
    triggerDropNow,
    acceptProposal,
    declineProposal,
    expireProposal,
    items,
    allUsers,
    impersonateUser,
    setScenario
  } = useSwapLoop();

  const [lastMatchResult, setLastMatchResult] = useState<string | null>(null);
  const [timeRemainingMap, setTimeRemainingMap] = useState<Record<string, number>>({});
  const [selectedHandoverMap, setSelectedHandoverMap] = useState<Record<string, 'desk' | 'meet'>>({});

  // Matching Engine Animation State
  const [isMatchingAnimating, setIsMatchingAnimating] = useState(false);
  const [matchingStepIndex, setMatchingStepIndex] = useState(0);

  // Modals
  const [meetModalProposal, setMeetModalProposal] = useState<any | null>(null);
  const [reportData, setReportData] = useState<{ userId: string; userName: string; proposalId: string } | null>(null);

  if (!currentUser) return null;

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  };

  const countdown = formatCountdown(dropCountdownSeconds);

  // Timer loop for active proposal expiry countdowns (F9)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedMap: Record<string, number> = {};

      proposals.forEach(p => {
        if (p.status === 'proposed') {
          const remainingSec = Math.max(0, Math.floor((p.expiresAt - now) / 1000));
          updatedMap[p.id] = remainingSec;

          if (remainingSec === 0) {
            expireProposal(p.id);
          }
        }
      });

      setTimeRemainingMap(updatedMap);
    }, 1000);

    return () => clearInterval(interval);
  }, [proposals, currentUser.id, expireProposal]);

  const handleTriggerDrop = async () => {
    setIsMatchingAnimating(true);
    setMatchingStepIndex(0);

    // Step through the 9 visual matching engine stages
    for (let i = 0; i < MATCHING_STEPS.length; i++) {
      setMatchingStepIndex(i);
      await new Promise(r => setTimeout(r, 420));
    }

    const res = await triggerDropNow();
    setIsMatchingAnimating(false);
    if (res.scenarioNote) {
      setLastMatchResult(res.scenarioNote);
    }
  };

  const handleUpgradeToTrustedAndRerun = async () => {
    await setScenario('C_TRUSTED');
    await handleTriggerDrop();
  };

  const getItem = (itemId: string) => {
    return items.find(i => i.id === itemId);
  };

  const getStudent = (studentId: string) => {
    return allUsers.find(u => u.id === studentId);
  };

  const handleAccept = (proposalId: string) => {
    const choice = selectedHandoverMap[proposalId] || 'desk';
    acceptProposal(proposalId, currentUser.id, choice);
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-16">
      {/* 1. THE DROP COUNTDOWN HERO BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-white via-[#FFF7F9] to-[#FFF0F4] border border-pink-200/90 p-8 sm:p-12 shadow-sm">
        <div className="max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-bold uppercase tracking-wider text-pink-700">
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Campus Daily Drop • Scheduled Daily at 5:00 PM (17:00)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            The Daily Drop Engine
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-2xl">
            Every day at 5:00 PM, SwapLoop's directed-cycle matching engine analyzes active Have and Want lists across residence halls, enforcing Trust T4 rules to discover multi-student closed loops of 3 to 5 swappers.
          </p>

          {/* Countdown & Trigger Button */}
          <div className="pt-2 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-pink-200 shadow-sm">
              <Clock className="w-6 h-6 text-pink-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Next Drop: Today · 5:00 PM</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-wider flex items-center gap-1.5 mt-0.5">
                  <span>{countdown.hours}</span>
                  <span className="text-pink-400">:</span>
                  <span>{countdown.minutes}</span>
                  <span className="text-pink-400">:</span>
                  <span className="text-pink-600">{countdown.seconds}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTriggerDrop}
              disabled={isMatchingAnimating}
              className={`px-8 py-4 rounded-full font-black text-sm tracking-wide shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 ${
                isMatchingAnimating
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:from-[#ec4899] hover:to-[#f43f5e] text-white shadow-pink-500/25'
              }`}
            >
              <Zap className={`w-4 h-4 ${isMatchingAnimating ? 'animate-spin' : 'animate-bounce'}`} />
              <span>{isMatchingAnimating ? 'MATCHING ENGINE RUNNING...' : '⚡ TRIGGER DAILY DROP NOW'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MATCHING ENGINE SIMULATION OVERLAY */}
      {isMatchingAnimating && (
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-pink-500/30 space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
              <span className="text-lg font-black tracking-tight text-pink-300 uppercase">THE DROP IS HERE</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Directed Graph Cycle Detector v2.4</span>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-mono text-emerald-400 flex items-center gap-2">
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>{MATCHING_STEPS[matchingStepIndex]}</span>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((matchingStepIndex + 1) / MATCHING_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Mini Animated Campus Graph Nodes */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-pink-400 font-bold">Node A</div>
                <div className="text-[10px] text-slate-400">Arjun (Drafter)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-pink-400 font-bold">Node B</div>
                <div className="text-[10px] text-slate-400">Bhavya (Bicycle)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-pink-400 font-bold">Node C</div>
                <div className="text-[10px] text-slate-400">Chetan (Ext Board)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-slate-400 font-bold">Node D</div>
                <div className="text-[10px] text-slate-500">Divya (Headphones)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-slate-400 font-bold">Node E</div>
                <div className="text-[10px] text-slate-500">Esha (Table Lamp)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SCENARIO NOTE OR "NO VALID LOOP FOUND" ALERT */}
      {lastMatchResult && !isMatchingAnimating && (
        <div className={`p-6 rounded-3xl border transition-all ${
          lastMatchResult.includes('No valid loop found')
            ? 'bg-amber-50/90 border-amber-300 text-amber-900 shadow-md'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {lastMatchResult.includes('No valid loop found') ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-extrabold text-sm sm:text-base">
                  {lastMatchResult.includes('No valid loop found') ? 'NO VALID LOOP FOUND' : 'DROP MATCHING COMPLETE'}
                </div>
                <div className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                  {lastMatchResult}
                </div>
              </div>
            </div>

            {/* Quick-fix action if in Scenario C */}
            {lastMatchResult.includes('No valid loop found') && (
              <button
                onClick={handleUpgradeToTrustedAndRerun}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-md whitespace-nowrap transition-all"
              >
                Promote Arjun & Bhavya to Trusted & Re-run Drop
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. PROPOSALS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <span>Active Drop Proposals</span>
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black">
                {proposals.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Strict Blind Rule (F7): Real names, college emails, and private contact notes remain withheld from network payloads until 100% of participants accept.
            </p>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 flex items-center justify-center text-pink-400 border border-pink-100">
              <RotateCw className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No active Drop proposals</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Click <strong className="text-pink-600">"⚡ TRIGGER DAILY DROP NOW"</strong> above to run the matching engine across campus student inventories!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {proposals.map((proposal) => {
              const isSealed = proposal.status === 'sealed';
              const isProposed = proposal.status === 'proposed';
              const isDeclined = proposal.status === 'declined';
              const isExpired = proposal.status === 'expired';
              const isCompleted = proposal.status === 'completed';
              const isFailed = proposal.status === 'failed';

              const remainingSec = timeRemainingMap[proposal.id] ?? 300;
              const isUserMember = proposal.members.some(m => m.studentId === currentUser.id);
              const userMemberRecord = proposal.members.find(m => m.studentId === currentUser.id);
              const userChoice = selectedHandoverMap[proposal.id] || 'desk';

              const acceptedCount = proposal.members.filter(m => m.accepted).length;
              const totalCount = proposal.members.length;

              const myGiveItem = userMemberRecord ? getItem(userMemberRecord.givesItemId) : null;
              const myReceiveItem = userMemberRecord ? getItem(userMemberRecord.receivesItemId) : null;

              return (
                <div
                  key={proposal.id}
                  className={`bg-white rounded-[2.5rem] border p-6 sm:p-10 shadow-lg transition-all relative overflow-hidden ${
                    isCompleted
                      ? 'border-emerald-400 ring-4 ring-emerald-100 bg-gradient-to-b from-emerald-50/10 to-white'
                      : isSealed
                      ? 'border-emerald-300 ring-4 ring-emerald-50'
                      : isDeclined || isExpired || isFailed
                      ? 'border-slate-200 opacity-70 bg-slate-50'
                      : 'border-pink-300 ring-4 ring-pink-50/50'
                  }`}
                >
                  {/* Proposal Header: ✦ SWAP LOOP FOUND ✦ */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pink-100">
                    <div className="space-y-1">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest border ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-pink-700 border-pink-200'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                        <span>
                          {isCompleted
                            ? `✦ SWAP COMPLETED (${totalCount} STUDENTS) ✦`
                            : `✦ SWAP LOOP FOUND (${totalCount} STUDENTS) ✦`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {isCompleted
                          ? '✨ Swap complete! Physical exchange verified at Swap Desk. Real identities now revealed.'
                          : isSealed
                          ? 'All participants confirmed! Handover phase active. Identities remain private until desk completion.'
                          : 'Blind proposal active. Identities strictly withheld.'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Acceptance Count */}
                      <div className="px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-800 text-xs font-bold font-mono">
                        {acceptedCount} / {totalCount} ACCEPTED
                      </div>

                      {/* Expiry Countdown */}
                      {isProposed && (
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-black">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>{formatTime(remainingSec)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* HIGH-IMPACT VISUAL SWAP CARD: YOU GIVE vs YOU RECEIVE */}
                  {userMemberRecord && (
                    <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-pink-50">
                      {/* Left: YOU GIVE */}
                      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#FFF7F9] to-white border border-pink-200 text-center space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-pink-600 flex items-center justify-center gap-1.5">
                          <span>YOU GIVE</span>
                        </div>
                        <div className="flex justify-center py-2">
                          <ItemIllustration
                            title={myGiveItem?.title || 'Give Item'}
                            category={myGiveItem?.category}
                            size="lg"
                          />
                        </div>
                        <div className="text-lg font-black text-slate-900">
                          {myGiveItem?.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {myGiveItem?.category} • {myGiveItem?.condition} ({myGiveItem?.valueBand} Value)
                        </div>
                      </div>

                      {/* Right: YOU RECEIVE */}
                      <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-white border border-emerald-200 text-center space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center justify-center gap-1.5">
                          <span>YOU RECEIVE</span>
                        </div>
                        <div className="flex justify-center py-2">
                          <ItemIllustration
                            title={myReceiveItem?.title || 'Receive Item'}
                            category={myReceiveItem?.category}
                            size="lg"
                          />
                        </div>
                        <div className="text-lg font-black text-slate-900">
                          {myReceiveItem?.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {myReceiveItem?.category} • {myReceiveItem?.condition} ({myReceiveItem?.valueBand} Value)
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OTHER MEMBERS LIST */}
                  <div className="py-6 space-y-4">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                      PARTICIPATING SWAPPERS:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {proposal.members.map((member, idx) => {
                        const student = getStudent(member.studentId);
                        const gives = getItem(member.givesItemId);
                        const receives = getItem(member.receivesItemId);
                        const isSelf = member.studentId === currentUser.id;

                        return (
                          <div
                            key={member.studentId}
                            className={`p-4 rounded-2xl border transition-all ${
                              isSelf
                                ? 'bg-pink-50/60 border-pink-300 ring-2 ring-pink-100'
                                : 'bg-slate-50/60 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                                  {idx + 1}
                                </div>
                                <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                                  {isCompleted ? (
                                    <>
                                      <Eye className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-950 font-black">{student?.name || member.name}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3 h-3 text-slate-400" />
                                      <span>{member.codename || `Swapper ${idx + 1}`}</span>
                                    </>
                                  )}
                                  {isSelf && <span className="text-[10px] text-pink-600 font-black ml-1">(YOU)</span>}
                                </div>
                              </div>

                              <div>
                                {member.accepted ? (
                                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>Accepted</span>
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-amber-600">
                                    Awaiting...
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-[11px] text-slate-600 space-y-1 mt-2">
                              <div>Gives: <strong className="text-slate-900">{gives?.title}</strong></div>
                              <div>Receives: <strong className="text-slate-900">{receives?.title}</strong></div>
                            </div>

                            {/* Completed: Reveal Contact Info */}
                            {isCompleted && (
                              <div className="mt-3 pt-2 border-t border-emerald-200/80 text-[11px] space-y-1 text-emerald-900">
                                <div><strong>Contact:</strong> {student?.contactNote || member.contactNote || 'Verified Swap Desk Pickup'}</div>
                                <div className="flex items-center justify-between text-[10px] text-emerald-700 pt-1 font-bold">
                                  <span>✓ Loop Completed</span>
                                  <span>+15 Score</span>
                                </div>
                              </div>
                            )}

                            {/* Sealed: Show Dropoff/Pickup Codes for Self only */}
                            {isSealed && !isCompleted && (
                              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] space-y-1">
                                <div className="text-slate-500 text-[10px] flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                                  <span>Identity hidden until desk pickup</span>
                                </div>
                                {isSelf && (
                                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                                    <span>Dropoff: <strong className="font-mono text-slate-900 px-1 py-0.5 bg-slate-100 rounded">{member.dropoffCode}</strong></span>
                                    <span>Pickup: <strong className="font-mono text-emerald-700 px-1 py-0.5 bg-emerald-50 rounded">{member.pickupCode}</strong></span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Impersonate helper for test evaluation */}
                            {!isSelf && isProposed && !member.accepted && (
                              <button
                                onClick={() => impersonateUser(member.studentId)}
                                className="mt-3 w-full text-center text-[10px] text-pink-600 hover:text-pink-700 font-bold flex items-center justify-center gap-1 pt-1 border-t border-slate-200"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>Switch to {member.codename || `Swapper ${idx + 1}`} to Accept</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* USER DECISION BAR (ACCEPT / DECLINE) */}
                  {isProposed && isUserMember && (
                    <div className="pt-6 border-t border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Handover Choice Radio */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-slate-700">Handover Location:</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`handover-${proposal.id}`}
                            value="desk"
                            checked={userChoice === 'desk'}
                            onChange={() => setSelectedHandoverMap({ ...selectedHandoverMap, [proposal.id]: 'desk' })}
                            className="text-pink-600 focus:ring-pink-400"
                          />
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-pink-500" />
                            Swap Desk Escrow
                          </span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`handover-${proposal.id}`}
                            value="meet"
                            checked={userChoice === 'meet'}
                            onChange={() => setSelectedHandoverMap({ ...selectedHandoverMap, [proposal.id]: 'meet' })}
                            className="text-pink-600 focus:ring-pink-400"
                          />
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-purple-500" />
                            Campus Quad Meet
                          </span>
                        </label>
                      </div>

                      {/* Accept / Decline Action Buttons */}
                      {!userMemberRecord?.accepted ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => declineProposal(proposal.id, currentUser.id)}
                            className="px-5 py-2.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                          >
                            Decline Proposal
                          </button>
                          <button
                            onClick={() => handleAccept(proposal.id)}
                            className="px-7 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
                          >
                            ✓ ACCEPT PROPOSAL
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>You accepted this proposal. Waiting for other swappers...</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SEALED PROPOSAL FOOTER */}
                  {isSealed && !isCompleted && (
                    <div className="pt-6 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 bg-emerald-50/40 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 rounded-b-[2.5rem]">
                      <div>
                        🔒 <strong>All swappers accepted! Loop is Sealed.</strong> Identities remain anonymous for privacy. Deliver your item to <strong>Swap Desk Escrow Station #1</strong> using your secret dropoff code.
                      </div>

                      {proposal.handoverMethod === 'meet' && (
                        <button
                          onClick={() => setMeetModalProposal(proposal)}
                          className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Campus Quad Geofence Check-in</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* COMPLETED CELEBRATION FOOTER */}
                  {isCompleted && (
                    <div className="pt-6 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 rounded-b-[2.5rem]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                          <span>✨ SWAP COMPLETED — REAL IDENTITIES REVEALED ✨</span>
                        </div>
                        <p className="text-slate-600 text-xs">
                          All items have been verified and picked up at the Swap Desk. Loop closed successfully! Swap scores updated (+15 pts).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Verified Complete</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {meetModalProposal && (
        <SwapMeetModal
          isOpen={!!meetModalProposal}
          onClose={() => setMeetModalProposal(null)}
          proposal={meetModalProposal}
          currentUserId={currentUser.id}
        />
      )}

      {reportData && (
        <ReportModal
          isOpen={!!reportData}
          onClose={() => setReportData(null)}
          reportedUserId={reportData.userId}
          reportedUserName={reportData.userName}
          proposalId={reportData.proposalId}
        />
      )}
    </div>
  );
};

export default TheDropView;
