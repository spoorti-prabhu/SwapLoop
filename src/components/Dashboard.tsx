import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { ListItemModal } from './ListItemModal';
import {
  Shield,
  Award,
  Clock,
  Sparkles,
  Plus,
  ArrowRight,
  RotateCw,
  CheckCircle2,
  Lock,
  Building2,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    currentRole,
    items,
    proposals,
    dropCountdownSeconds,
    triggerDropNow,
    acceptProposal,
    declineProposal,
    allUsers,
    setActiveTab,
    toggleWant,
    isItemInWants
  } = useSwapLoop();

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedHandover, setSelectedHandover] = useState<'desk' | 'meet'>('desk');
  const [isTriggering, setIsTriggering] = useState(false);
  const [matchResultNote, setMatchResultNote] = useState<string | null>(null);
  const [hasConfirmedParticipation, setHasConfirmedParticipation] = useState(false);

  // Check 5:00 PM - 5:30 PM (17:00 - 17:30) Drop window
  const checkDropWindow = () => {
    const d = new Date();
    const hour = d.getHours();
    const min = d.getMinutes();
    return hour === 17 && min <= 30;
  };
  const isDropWindowActive = checkDropWindow();

  if (!currentUser) return null;

  // Format seconds to HH:MM:SS
  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find active proposal for the logged in user
  const activeProposal = proposals.find(p =>
    (p.status === 'proposed' || p.status === 'sealed' || p.status === 'eligible' || p.status === 'completed') &&
    p.members.some(m => m.studentId === currentUser.id)
  ) || proposals[0];

  const userMemberRecord = activeProposal?.members.find(m => m.studentId === currentUser.id);

  const getItem = (itemId: string) => {
    return items.find(i => i.id === itemId);
  };

  const getStudent = (studentId: string) => {
    return allUsers.find(u => u.id === studentId);
  };

  const givenItem = userMemberRecord ? getItem(userMemberRecord.givesItemId) : null;
  const receivedItem = userMemberRecord ? getItem(userMemberRecord.receivesItemId) : null;

  // Calculate remaining proposal countdown
  const now = Date.now();
  const proposalRemainingSec = activeProposal?.status === 'proposed'
    ? Math.max(0, Math.floor((activeProposal.expiresAt - now) / 1000))
    : 300;

  const handleTriggerDrop = async () => {
    setIsTriggering(true);
    setMatchResultNote(null);
    try {
      const res = await triggerDropNow();
      setIsTriggering(false);
      if (res.matchedCount > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#DB2777', '#FCE7F3', '#10B981']
        });
      }
      setMatchResultNote(res.scenarioNote || `Drop ran: ${res.matchedCount} loops created.`);
    } catch (err: any) {
      setIsTriggering(false);
      setMatchResultNote(err.message || 'Error running Drop');
    }
  };

  const handleAccept = async () => {
    if (!activeProposal || !userMemberRecord) return;
    await acceptProposal(activeProposal.id, currentUser.id, selectedHandover);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#DE5B9B', '#F472B6', '#10B981']
    });
  };

  const handleDecline = async () => {
    if (!activeProposal) return;
    await declineProposal(activeProposal.id, currentUser.id);
  };

  // Recent other items for quick discovery feed
  const recentCampusItems = items.filter(it => it.ownerId !== currentUser.id).slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. STUDENT WELCOME & LIVE DROP COUNTDOWN BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-[#FFF7F9] to-[#FFF0F4] border border-pink-200/90 p-6 sm:p-10 shadow-sm">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-rose-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/90 border border-pink-200 text-xs font-bold text-pink-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#DE5B9B]" />
                <span>Interactive Student Dashboard</span>
              </span>

              {/* Live Countdown Clock Pill Banner with Pulsing Pink Beacon */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-pink-200 text-xs font-bold text-pink-700 shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                </span>
                <span className="font-mono tracking-tight">Next Drop in: {formatCountdown(dropCountdownSeconds)}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Welcome back, {currentUser.name.split(' ')[0]}!
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
              Every day at 5:00 PM, SwapLoop's circular engine matches wants across students. Cashless, private, and 100% campus verified.
            </p>

            {/* Profile Badges: Trust Tier & Swap Score */}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-bold">
              {/* Trust Tier Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-xs ${
                  currentUser.trustLevel === 'New'
                    ? 'bg-pink-50 border-pink-200 text-pink-700'
                    : currentUser.trustLevel === 'Trusted'
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Trust Tier: {currentUser.trustLevel}</span>
                <span className="text-[10px] font-normal opacity-80">
                  ({currentUser.trustLevel === 'New' ? 'Low Value Items' : currentUser.trustLevel === 'Trusted' ? 'Up to Medium' : 'High Value Permitted'})
                </span>
              </div>

              {/* Numeric Swap Score */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Swap Score: {currentUser.swapScore} pts</span>
              </div>

              {/* Items in Have List */}
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-pink-100 text-slate-700">
                <span>📦 {items.filter(i => i.ownerId === currentUser.id).length} Items Listed</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setIsListModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>List an Item to Swap</span>
            </button>

            {currentRole === 'Student' ? (
              isDropWindowActive ? (
                <button
                  onClick={() => {
                    setHasConfirmedParticipation(true);
                    confetti({
                      particleCount: 60,
                      spread: 70,
                      origin: { y: 0.6 }
                    });
                  }}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                    hasConfirmedParticipation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {hasConfirmedParticipation
                      ? '✓ Confirmed in 5:00 PM Drop'
                      : '✓ Confirm Participation in 5:00 PM Drop'}
                  </span>
                </button>
              ) : (
                <div className="px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs select-none">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>🔒 Drop Window Locked • Next Drop opens at 5:00 PM (17:00–17:30)</span>
                </div>
              )
            ) : (
              <button
                onClick={handleTriggerDrop}
                disabled={isTriggering}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-pink-50 text-slate-800 border border-pink-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <RotateCw className={`w-4 h-4 text-[#DE5B9B] ${isTriggering ? 'animate-spin' : ''}`} />
                <span>{isTriggering ? 'Matching...' : '⚡ Trigger The Drop'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Match Result Note */}
        {matchResultNote && (
          <div className="mt-5 p-4 rounded-2xl bg-white border border-pink-200 text-xs font-semibold text-slate-800 flex items-start gap-2 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#DE5B9B] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#DE5B9B]">Algorithm Execution Result:</div>
              <div className="text-slate-600 mt-0.5">{matchResultNote}</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. THE ACTIVE LOOP / PROPOSAL WIDGET (CENTERPIECE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#DE5B9B] flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Active Loop / Proposal Widget</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Campus Circular Proposal
            </h2>
          </div>

          {activeProposal && (
            <span className="px-3.5 py-1 rounded-full bg-pink-100 text-[#DE5B9B] text-xs font-extrabold uppercase tracking-wider border border-pink-200">
              {activeProposal.members.length}-Person Cycle
            </span>
          )}
        </div>

        {activeProposal ? (
          <div className={`bg-white rounded-[2.5rem] border p-6 sm:p-8 shadow-md transition-all relative overflow-hidden ${
            activeProposal.status === 'completed'
              ? 'border-emerald-300 ring-4 ring-emerald-50'
              : activeProposal.status === 'sealed'
              ? 'border-blue-300 ring-4 ring-blue-50'
              : 'border-pink-200 ring-4 ring-pink-50/50'
          }`}>
            {/* STRICT BLIND RULE BANNER */}
            <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-xs ${
              activeProposal.status === 'completed'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-[#FFF7FA] border border-pink-200 text-[#DE5B9B]'
            }`}>
              {activeProposal.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Lock className="w-5 h-5 text-[#DE5B9B] flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-extrabold">
                  {activeProposal.status === 'completed'
                    ? '🎉 100% ACCEPTED & CLOSED — REAL IDENTITIES UNLOCKED!'
                    : '🔒 STRICT BLIND RULE ACTIVE (Campus Privacy Protection)'}
                </div>
                <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                  {activeProposal.status === 'completed'
                    ? 'All members have agreed and completed escrow exchange! Real student names, avatars, and hostel contact notes are now revealed below.'
                    : 'Participant real names, photos, and contact details remain strictly withheld from all parties until 100% of participants accept and the loop completes! Only anonymous tags are displayed.'}
                </div>
              </div>
            </div>

            {/* CORE LOOP VISUALIZER: Your Given Item ➔ Received Item */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8">
              {/* Left Polaroid: What You Give */}
              <div className="md:col-span-5 bg-[#FAF3F8] p-4 rounded-3xl border border-pink-100 flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-pink-200 shadow-sm flex-shrink-0">
                  <img
                    src={givenItem?.imageUrl || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'}
                    alt={givenItem?.title || 'Given item'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-pink-600">
                    YOU GIVE
                  </div>
                  <div className="font-black text-slate-900 text-base truncate">
                    {givenItem?.title || 'Your Listed Item'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{givenItem?.category}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">{givenItem?.valueBand} Value</span>
                  </div>
                </div>
              </div>

              {/* Center Flow Arrow & Loop Badge */}
              <div className="md:col-span-1 flex flex-col items-center justify-center py-2 md:py-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DE5B9B] to-[#F472B6] text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-pink-600 mt-1 uppercase">
                  {activeProposal.members.length}-Way
                </span>
              </div>

              {/* Right Polaroid: What You Receive */}
              <div className="md:col-span-5 bg-[#F0FDF4] p-4 rounded-3xl border border-emerald-100 flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-emerald-200 shadow-sm flex-shrink-0">
                  <img
                    src={receivedItem?.imageUrl || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'}
                    alt={receivedItem?.title || 'Received item'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    YOU RECEIVE
                  </div>
                  <div className="font-black text-slate-900 text-base truncate">
                    {receivedItem?.title || 'Target Item'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{receivedItem?.category}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-700">{receivedItem?.valueBand} Value</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PARTICIPANTS CYCLE LIST (STRICT BLIND RULE TEST) */}
            <div className="mb-6 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>Cycle Participants ({activeProposal.members.length} Students):</span>
                <span className="text-[11px] text-[#DE5B9B] font-semibold">
                  {activeProposal.status === 'completed' ? 'Identities Revealed' : 'Protected Blind State'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeProposal.members.map((m) => {
                  const isSelf = m.studentId === currentUser.id;
                  const realUser = getStudent(m.studentId);
                  const isCompleted = activeProposal.status === 'completed';

                  // STRICT BLIND LOGIC: Only display real name if loop completed OR if it's the user themself!
                  const displayName = isCompleted
                    ? (m.name || realUser?.name || m.codename)
                    : isSelf
                    ? `${realUser?.name} (You)`
                    : m.codename;

                  const contactInfo = isCompleted
                    ? (m.contactNote || realUser?.contactNote || 'Available upon pickup')
                    : isSelf
                    ? realUser?.contactNote
                    : 'Hidden until loop completion';

                  const avatarLetter = displayName[0] || 'S';

                  return (
                    <div
                      key={m.studentId}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        isSelf
                          ? 'bg-[#FFF7FA] border-pink-200 text-[#DE5B9B]'
                          : isCompleted
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white ${
                            isCompleted ? 'bg-emerald-600' : isSelf ? 'bg-[#DE5B9B]' : 'bg-slate-400'
                          }`}>
                            {avatarLetter}
                          </div>
                          <span className="font-extrabold">{displayName}</span>
                        </div>

                        {m.accepted ? (
                          <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Accepted
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold text-[10px] flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-500 truncate">
                        Gives: <strong>{getItem(m.givesItemId)?.title || 'Item'}</strong>
                      </div>

                      <div className="text-[10px] text-slate-400 truncate italic">
                        {isCompleted || isSelf ? contactInfo : '🔒 Contact encrypted'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PROPOSAL CONTROLS & ESCROW CODES */}
            <div className="pt-4 border-t border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Handover Mode & Timer */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {activeProposal.status === 'proposed' && (
                  <>
                    <div className="flex items-center gap-1.5 bg-pink-50 p-1 rounded-xl border border-pink-200">
                      <button
                        type="button"
                        onClick={() => setSelectedHandover('desk')}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                          selectedHandover === 'desk'
                            ? 'bg-[#DE5B9B] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Swap Desk Escrow
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedHandover('meet')}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                          selectedHandover === 'meet'
                            ? 'bg-[#DE5B9B] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Verified Meet
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-pink-600 font-mono font-bold">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Expires in {proposalRemainingSec}s</span>
                    </div>
                  </>
                )}

                {/* Sealed or Eligible State: Show Drop-off & Pickup Codes */}
                {(activeProposal.status === 'sealed' || activeProposal.status === 'eligible') && userMemberRecord && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold flex items-center gap-2">
                      <span className="text-pink-400">Your Drop-off Code:</span>
                      <span className="tracking-widest text-emerald-400">{userMemberRecord.dropoffCode}</span>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-mono text-xs font-bold">
                      <span>Pickup Code: </span>
                      <span className="tracking-widest font-black">
                        {activeProposal.members.every(m => m.dropoffDone) ? userMemberRecord.pickupCode : '🔒 Escrow Locked'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Accept / Decline */}
              {activeProposal.status === 'proposed' && userMemberRecord && !userMemberRecord.accepted && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecline}
                    className="px-5 py-2.5 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>

                  <button
                    onClick={handleAccept}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#DE5B9B] to-[#F472B6] hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Accept Swap Proposal</span>
                  </button>
                </div>
              )}

              {activeProposal.status === 'proposed' && userMemberRecord && userMemberRecord.accepted && (
                <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You accepted! Waiting for remaining swappers...</span>
                </div>
              )}

              {activeProposal.status === 'sealed' && (
                <button
                  onClick={() => setActiveTab('desk')}
                  className="px-5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Open Swap Desk Verification →</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Standby Card when no loop is active yet */
          <div className="bg-white rounded-[2.5rem] border border-pink-100 p-8 sm:p-12 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-[#DE5B9B]">
              <RotateCw className="w-8 h-8 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                Ready for Today's 5:00 PM Drop
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Your items and wants are queued in the campus matching engine. You can wait for the scheduled drop or click below for instant matching.
              </p>
            </div>
            <button
              onClick={handleTriggerDrop}
              className="px-6 py-3 rounded-2xl bg-[#DE5B9B] hover:bg-[#CF4A89] text-white font-bold text-xs shadow-md shadow-pink-500/25 transition-all cursor-pointer"
            >
              ⚡ Run Instant Drop Matching Now
            </button>
          </div>
        )}
      </div>

      {/* 3. FRESH CAMPUS DISCOVERIES (BROWSE HIGHLIGHTS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Fresh Campus Feed
            </h2>
            <p className="text-xs text-slate-500">
              Items other students are putting into today's circular loop.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold text-[#DE5B9B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentCampusItems.map((item) => {
            const inWants = isItemInWants(item.id);
            const photoUrl = item.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item.id}
                className="group relative bg-white p-3.5 rounded-3xl border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1"
              >
                <div>
                  {/* Polaroid Frame */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-pink-50/50 mb-3 border border-pink-50 shadow-inner">
                    <img
                      src={photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-800 font-extrabold text-[10px] shadow-sm">
                        {item.condition}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1D1722]/85 backdrop-blur-sm text-white font-extrabold text-[10px] shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    {item.valueBand} Value Band
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => toggleWant(item.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      inWants
                        ? 'bg-gradient-to-r from-[#f472b6] to-[#fb7185] text-white shadow-sm'
                        : 'bg-[#FFF7FA] hover:bg-pink-100 text-[#DE5B9B] border border-pink-200/80'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider">
                      {inWants ? 'In My Wants' : 'I Want This'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* List an Item Modal */}
      <ListItemModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
