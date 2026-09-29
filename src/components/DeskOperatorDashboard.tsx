import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  Building2,
  Package,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Clock,
  Sparkles,
  FileText,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DeskOperatorDashboard: React.FC = () => {
  const {
    items,
    proposals,
    allUsers,
    triggerDropNow,
    setActiveTab,
    dropCountdownSeconds
  } = useSwapLoop();

  const [isTriggering, setIsTriggering] = useState(false);
  const [matchResultNote, setMatchResultNote] = useState<string | null>(null);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeProposals = proposals.filter(
    (p) => p.status === 'sealed' || p.status === 'proposed' || p.status === 'eligible' || p.status === 'completed'
  );

  const totalDepositsToday = activeProposals.reduce(
    (acc, p) => acc + p.members.filter((m) => m.dropoffDone).length,
    0
  );

  const totalPickupsToday = activeProposals.reduce(
    (acc, p) => acc + p.members.filter((m) => m.pickupDone).length,
    0
  );

  const totalSwappersInLoops = activeProposals.reduce(
    (acc, p) => acc + p.members.length,
    0
  );

  const getItem = (itemId: string) => items.find((i) => i.id === itemId);
  const getStudent = (studentId: string) => allUsers.find((u) => u.id === studentId);

  const handleRunDropNow = async () => {
    setIsTriggering(true);
    setMatchResultNote(null);
    try {
      const res = await triggerDropNow();
      setIsTriggering(false);
      if (res.matchedCount > 0) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#DB2777', '#F472B6', '#10B981', '#6366F1']
        });
        setMatchResultNote(`⚡ Drop Executed! Created ${res.matchedCount} matching closed loop(s).`);
      } else {
        setMatchResultNote(res.scenarioNote || 'Drop executed. No new closed cycles detected for current wants.');
      }
    } catch (err: any) {
      setIsTriggering(false);
      setMatchResultNote(err.message || 'Error running Drop');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. TOP HEADER & OPERATOR IDENTITY */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-[#FFF7F9] to-[#FFF0F4] border border-pink-200/90 p-6 sm:p-10 shadow-xs">
        <div className="absolute top-0 right-10 w-64 h-64 bg-pink-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-rose-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#db2777]/10 border border-[#db2777]/20 text-xs font-black text-[#db2777] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Desk Operator Dashboard · Active Shift</span>
              </span>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Station Open Until 8:00 PM</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Residence Hall Escrow Operations
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
              Real-time monitoring console for campus circular swaps. As Desk Operator, you have full unmasked oversight of all student cycles, physical custody verifications, and handover releases.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                <span>Operator: Desk Operator 01 · Staff Role</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-pink-200 text-xs font-bold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-pink-500" />
                <span>Scheduled Drop Countdown: {formatCountdown(dropCountdownSeconds)}</span>
              </div>
            </div>
          </div>

          {/* RUN DROP NOW BUTTON (Exclusively for Desk Operator on-demand execution) */}
          <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
            <button
              onClick={handleRunDropNow}
              disabled={isTriggering}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#db2777] via-[#e11d48] to-[#be185d] hover:opacity-95 text-white font-black text-sm shadow-lg shadow-pink-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <Zap className={`w-5 h-5 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Executing Matching Engine...' : '⚡ Run Drop Now'}</span>
            </button>
            <span className="text-[11px] text-slate-500 font-medium text-center lg:text-right">
              Bypasses 5:00 PM countdown for instant testing & evaluation
            </span>
          </div>
        </div>

        {matchResultNote && (
          <div className="mt-4 p-3.5 rounded-2xl bg-white/90 border border-pink-200 text-slate-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
            <Sparkles className="w-4 h-4 text-[#db2777] flex-shrink-0" />
            <span>{matchResultNote}</span>
          </div>
        )}
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 text-[#db2777] flex items-center justify-center font-bold">
            <RotateCw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeProposals.length}</div>
            <div className="text-xs text-slate-500 font-medium">Active Loops in Escrow</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalDepositsToday}</div>
            <div className="text-xs text-slate-500 font-medium">Items Deposited Today</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalPickupsToday}</div>
            <div className="text-xs text-slate-500 font-medium">Handovers Completed</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalSwappersInLoops}</div>
            <div className="text-xs text-slate-500 font-medium">Participating Students</div>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE LOOPS UNMASKED SUMMARY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#db2777]">
              LIVE ESCROW PIPELINE
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Unmasked Circular Loops ({activeProposals.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('desk_ledger')}
              className="px-4 py-2 rounded-xl bg-white border border-pink-200 hover:bg-pink-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#db2777]" />
              <span>Open Desk Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab('desk')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Swap Desk Console →</span>
            </button>
          </div>
        </div>

        {activeProposals.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-pink-100 p-10 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 text-[#db2777] mx-auto flex items-center justify-center">
              <RotateCw className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Active Loops in Escrow</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Run the Drop engine using the button above to match student wants and generate verification codes.
            </p>
            <button
              onClick={handleRunDropNow}
              className="px-5 py-2.5 rounded-xl bg-[#db2777] text-white font-bold text-xs cursor-pointer hover:opacity-90"
            >
              ⚡ Run Drop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {activeProposals.map((proposal) => {
              const droppedCount = proposal.members.filter((m) => m.dropoffDone).length;
              const totalCount = proposal.members.length;
              const allDropped = droppedCount === totalCount;
              const isCompleted = proposal.status === 'completed';

              const dynamicDayTitle = `${new Date().toLocaleDateString('en-US', {
                weekday: 'long'
              })} evening loop`;

              return (
                <div
                  key={proposal.id}
                  className="bg-white rounded-[2rem] border border-pink-100 p-6 sm:p-7 shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-50 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-[#db2777] bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-200">
                        #{proposal.id.slice(-4).toUpperCase()}
                      </span>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{dynamicDayTitle}</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {proposal.members.length}-Way Closed Cycle · Desk Escrow Routing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : allDropped
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isCompleted
                          ? '🎉 Completed'
                          : allDropped
                          ? '📦 All Deposited (Ready for Pickup)'
                          : `⏳ ${droppedCount}/${totalCount} Deposited`}
                      </span>
                    </div>
                  </div>

                  {/* Unmasked Swappers Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {proposal.members.map((member, idx) => {
                      const student = getStudent(member.studentId);
                      const gives = getItem(member.givesItemId);
                      const receives = getItem(member.receivesItemId);

                      return (
                        <div
                          key={member.studentId || idx}
                          className="bg-[#FFF7FA]/60 border border-pink-100 rounded-2xl p-4 space-y-3"
                        >
                          {/* Student Header Unmasked */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-wider text-[#db2777]">
                                {member.codename}
                              </div>
                              <div className="font-extrabold text-sm text-slate-900">
                                {student?.name || member.name || 'Student'}
                              </div>
                              <div className="text-[11px] text-pink-700 font-medium mt-0.5">
                                {student?.contactNote || member.contactNote || 'Campus Dorm'}
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                member.dropoffDone
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {member.dropoffDone ? '✓ Dropped' : 'Pending Drop'}
                            </span>
                          </div>

                          {/* Item Routing Details */}
                          <div className="text-xs space-y-1.5 pt-2 border-t border-pink-100/70">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-slate-400">Deposits:</span>
                              <strong className="text-slate-900 truncate max-w-[150px]">
                                {gives?.title || 'Item'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-slate-400">Collects:</span>
                              <strong className="text-emerald-700 truncate max-w-[150px]">
                                {receives?.title || 'Item'}
                              </strong>
                            </div>
                          </div>

                          {/* Drop & Pickup Codes */}
                          <div className="pt-2 border-t border-pink-100/70 space-y-1 font-mono text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-sans">Drop Code:</span>
                              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-pink-200">
                                {member.dropoffCode}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-sans">Pickup Code:</span>
                              <span
                                className={`font-bold px-2 py-0.5 rounded border ${
                                  allDropped
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                    : 'bg-slate-50 text-slate-400 border-slate-200'
                                }`}
                              >
                                {allDropped ? member.pickupCode : '🔒 Locked (T2)'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions for this proposal */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500 font-medium">
                      Physical custody managed at Station #1 Escrow Locker
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('desk_ledger')}
                        className="px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#db2777] font-bold transition-colors cursor-pointer"
                      >
                        View in Ledger
                      </button>
                      <button
                        onClick={() => setActiveTab('desk')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Verify at Desk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeskOperatorDashboard;
