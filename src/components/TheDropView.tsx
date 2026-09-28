import React, { useState, useEffect } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  RotateCw,
  Clock,
  Zap,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  QrCode,
  Building2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

interface SimStudentCard {
  studentName: string;
  contact: string;
  deposits: string;
  collects: string;
  dropCode: string;
  dropDone: boolean;
  pickupCode: string;
  pickupDone: boolean;
  returnCode?: string;
}

export const TheDropView: React.FC = () => {
  const {
    currentUser,
    proposals,
    dropCountdownSeconds,
    triggerDropNow,
    expireProposal,
    items,
    allUsers
  } = useSwapLoop();

  // Local simulated countdown for the "Drop Time Simulator"
  const [simulatedSeconds, setSimulatedSeconds] = useState<number | null>(null);

  // Simulated Escrow Loop State (Exact match to media_1790614438104.png)
  const [simLoopId] = useState('1-pmvcxp');
  const [simStudents, setSimStudents] = useState<SimStudentCard[]>([
    {
      studentName: 'Arjun Sharma',
      contact: 'Hostel 3, Room 204 | Ph: +91 98765 43210',
      deposits: 'Mini drafter',
      collects: 'Headphones',
      dropCode: 'K3SC6X',
      dropDone: false,
      pickupCode: '912048',
      pickupDone: false
    },
    {
      studentName: 'Divya Nair',
      contact: 'Hostel 1, Room 108 | Ph: +91 98765 43213',
      deposits: 'Headphones',
      collects: 'Mini drafter',
      dropCode: '56FN94',
      dropDone: false,
      pickupCode: '741295',
      pickupDone: false
    }
  ]);
  const [simIsFailed, setSimIsFailed] = useState(false);
  const [simDropInput, setSimDropInput] = useState('');
  const [simPickupInput, setSimPickupInput] = useState('');
  const [simFeedback, setSimFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const [lastMatchResult, setLastMatchResult] = useState<string | null>(null);
  const [timeRemainingMap, setTimeRemainingMap] = useState<Record<string, number>>({});

  // Matching Engine Animation State
  const [isMatchingAnimating, setIsMatchingAnimating] = useState(false);
  const [matchingStepIndex, setMatchingStepIndex] = useState(0);

  if (!currentUser) return null;

  // Countdown timer calculation
  const effectiveCountdownSec = simulatedSeconds !== null ? simulatedSeconds : dropCountdownSeconds;

  // Countdown simulator effect
  useEffect(() => {
    if (simulatedSeconds === null) return;
    if (simulatedSeconds <= 0) {
      handleTriggerDrop();
      setSimulatedSeconds(null);
      return;
    }
    const timer = setInterval(() => {
      setSimulatedSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [simulatedSeconds]);

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

  const countdown = formatCountdown(effectiveCountdownSec);

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
      await new Promise(r => setTimeout(r, 380));
    }

    const res = await triggerDropNow();
    setIsMatchingAnimating(false);
    if (res.scenarioNote) {
      setLastMatchResult(res.scenarioNote);
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getItem = (itemId: string) => {
    return items.find(i => i.id === itemId);
  };

  const getStudent = (studentId: string) => {
    return allUsers.find(u => u.id === studentId);
  };

  // Simulated Escrow handlers
  const simAllDropped = simStudents.every(s => s.dropDone);
  const simAllPickedUp = simStudents.every(s => s.pickupDone);

  const handleSimDropSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = simDropInput.trim().toUpperCase();
    if (!cleanCode) return;

    const targetStudent = simStudents.find(s => s.dropCode.toUpperCase() === cleanCode);
    if (targetStudent) {
      if (targetStudent.dropDone) {
        setSimFeedback({ text: `${targetStudent.studentName}'s item is already in escrow.`, isError: false });
        return;
      }
      setSimStudents(prev =>
        prev.map(s => (s.dropCode.toUpperCase() === cleanCode ? { ...s, dropDone: true } : s))
      );
      setSimFeedback({
        text: `✓ Drop-off code ${cleanCode} verified! ${targetStudent.studentName}'s ${targetStudent.deposits} placed into escrow.`,
        isError: false
      });
      setSimDropInput('');
    } else {
      setSimFeedback({
        text: `Invalid drop-off code "${cleanCode}". Use K3SC6X or 56FN94 to test.`,
        isError: true
      });
    }
  };

  const handleSimPickupSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!simAllDropped) {
      setSimFeedback({ text: 'Pickup is locked until all ring members drop their items (T2).', isError: true });
      return;
    }
    const cleanCode = simPickupInput.trim().toUpperCase();
    if (!cleanCode) return;

    const targetStudent = simStudents.find(s => s.pickupCode.toUpperCase() === cleanCode);
    if (targetStudent) {
      if (targetStudent.pickupDone) {
        setSimFeedback({ text: `${targetStudent.studentName} has already collected their item.`, isError: false });
        return;
      }
      const updated = simStudents.map(s =>
        s.pickupCode.toUpperCase() === cleanCode ? { ...s, pickupDone: true } : s
      );
      setSimStudents(updated);
      setSimFeedback({
        text: `✓ Pickup code verified! ${targetStudent.studentName} received ${targetStudent.collects}. Handover complete!`,
        isError: false
      });
      setSimPickupInput('');

      if (updated.every(s => s.pickupDone)) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    } else {
      setSimFeedback({
        text: `Invalid pickup code "${cleanCode}". Use unlocked code ${simStudents[0].pickupCode} or ${simStudents[1].pickupCode}.`,
        isError: true
      });
    }
  };

  const handleSimulateExpiry = () => {
    setSimIsFailed(true);
    setSimStudents(prev =>
      prev.map((s) => ({
        ...s,
        returnCode: `RET-${s.studentName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
      }))
    );
    setSimFeedback({
      text: '⚠️ 24-hour deadline expired! Physical Escrow rule T3 triggered: deposit return codes issued to restore items safely.',
      isError: true
    });
  };

  const handleResetSim = () => {
    setSimIsFailed(false);
    setSimFeedback(null);
    setSimDropInput('');
    setSimPickupInput('');
    setSimStudents([
      {
        studentName: 'Arjun Sharma',
        contact: 'Hostel 3, Room 204 | Ph: +91 98765 43210',
        deposits: 'Mini drafter',
        collects: 'Headphones',
        dropCode: 'K3SC6X',
        dropDone: false,
        pickupCode: '912048',
        pickupDone: false
      },
      {
        studentName: 'Divya Nair',
        contact: 'Hostel 1, Room 108 | Ph: +91 98765 43213',
        deposits: 'Headphones',
        collects: 'Mini drafter',
        dropCode: '56FN94',
        dropDone: false,
        pickupCode: '741295',
        pickupDone: false
      }
    ]);
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-16">
      {/* 1. TOP SIMULATOR HERO: DROP TIME & SWAP SIMULATOR */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-white via-[#FFF7F9] to-[#FFF0F4] border border-pink-200/90 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-bold uppercase tracking-wider text-pink-700">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Desk Operator • Test & Drop Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Campus Drop & Swap Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Simulate the daily 5:00 PM drop matching cycle, fast-forward drop countdowns, and execute algorithm matches across campus inventories.
            </p>
          </div>

          {/* Time Simulator Clock Widget */}
          <div className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-white border border-pink-200 shadow-xs">
            <Clock className="w-5 h-5 text-pink-500 flex-shrink-0 animate-pulse" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {simulatedSeconds !== null ? 'Simulated Countdown' : 'Next Scheduled Drop: Today · 5:00 PM'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-wider flex items-center gap-1 mt-0.5">
                <span>{countdown.hours}</span>
                <span className="text-pink-400">:</span>
                <span>{countdown.minutes}</span>
                <span className="text-pink-400">:</span>
                <span className="text-pink-600">{countdown.seconds}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drop Simulation Action Controls */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleTriggerDrop}
            disabled={isMatchingAnimating}
            className={`px-6 py-3 rounded-full font-black text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isMatchingAnimating
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-[#db2777] to-[#f43f5e] hover:opacity-95 text-white shadow-pink-500/20'
            }`}
          >
            <Zap className={`w-4 h-4 ${isMatchingAnimating ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isMatchingAnimating ? 'MATCHING ENGINE RUNNING...' : '⚡ TRIGGER 5:00 PM DROP NOW'}</span>
          </button>

          <button
            onClick={() => setSimulatedSeconds(10)}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 text-xs font-bold border border-pink-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Fast forward clock to 10 seconds to watch the automated trigger"
          >
            <Clock className="w-3.5 h-3.5 text-pink-500" />
            <span>⏱️ Fast-Forward to 10s</span>
          </button>

          <button
            onClick={() => setSimulatedSeconds(null)}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 text-xs font-bold border border-pink-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset countdown back to standard 5:00 PM daily schedule"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Clock</span>
          </button>

          <button
            onClick={handleResetSim}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-slate-700 text-xs font-bold border border-pink-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset the simulated escrow cards below"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Escrow Demo Loop</span>
          </button>
        </div>

        {lastMatchResult && !isMatchingAnimating && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{lastMatchResult}</span>
          </div>
        )}
      </div>

      {/* 2. MATCHING ENGINE ANIMATION OVERLAY */}
      {isMatchingAnimating && (
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-pink-500/30 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
              <span className="text-sm font-black tracking-tight text-pink-300 uppercase">
                THE DROP SIMULATOR IS ACTIVE
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">Directed Graph Cycle Detector v2.4</span>
          </div>

          <div className="space-y-3">
            <div className="text-xs sm:text-sm font-mono text-emerald-400 flex items-center gap-2">
              <RotateCw className="w-4 h-4 animate-spin flex-shrink-0" />
              <span>{MATCHING_STEPS[matchingStepIndex]}</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((matchingStepIndex + 1) / MATCHING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. SIMULATED ESCROW DESK CARD - EXACT MATCH TO media_1790614438104.png */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-[#db2777] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Interactive Escrow Simulator (Live Desk Test)</span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Simulate ring drop-offs, escrow locking (T2), and deadline expiry (T3)
          </span>
        </div>

        <div className="rounded-[2rem] border border-pink-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header Row: ID, Status pill, and Expiry button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-black text-slate-700">
                ID: {simLoopId}
              </span>
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                  simIsFailed
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : simAllPickedUp
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : simAllDropped
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]'
                }`}
              >
                {simIsFailed ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>⚠️ Loop Expired • Return Codes Active</span>
                  </>
                ) : simAllPickedUp ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>🎉 Loop Closed & Fully Handed Over</span>
                  </>
                ) : simAllDropped ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>🔓 All Items in Escrow • Pickup Codes Unlocked</span>
                  </>
                ) : (
                  <>
                    <span>⏳ Awaiting Item Drop-offs</span>
                  </>
                )}
              </span>
            </div>

            {/* Simulate Expiry Button (T3) */}
            {!simIsFailed && !simAllPickedUp && (
              <button
                onClick={handleSimulateExpiry}
                className="px-4 py-1.5 rounded-full border border-[#FDA4AF] bg-white hover:bg-rose-50 text-[#E11D48] text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
                title="Simulate 24-hour deadline expiration for testing return codes"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Desk Failure: Simulate Expiry (T3)</span>
              </button>
            )}
          </div>

          {/* Feedback banner */}
          {simFeedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
                simFeedback.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}
            >
              {simFeedback.isError ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{simFeedback.text}</span>
            </div>
          )}

          {/* 2 Horizontal Participant Cards - Exact layout of media_1790614438104.png */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {simStudents.map((student, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  student.pickupDone
                    ? 'bg-purple-50/50 border-purple-200'
                    : student.dropDone
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-[#FFF7FA]/50 border-pink-100 hover:border-pink-200'
                }`}
              >
                {/* Row 1: Student Name and Contact */}
                <div className="flex items-center justify-between gap-2 border-b border-pink-100/60 pb-2.5">
                  <span className="font-extrabold text-sm text-slate-900 truncate">
                    {student.studentName}
                  </span>
                  <span className="text-[11px] font-semibold text-[#DB2777] truncate">
                    {student.contact}
                  </span>
                </div>

                {/* Row 2 & 3: Deposits & Collects */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-500 font-medium">Deposits:</span>
                    <strong className="text-slate-900 font-bold">{student.deposits}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="text-slate-500 font-medium">Collects:</span>
                    <strong className="text-slate-900 font-bold">{student.collects}</strong>
                  </div>
                </div>

                {/* Row 4: Drop Code */}
                <div className="pt-2 border-t border-pink-100/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#DB2777]" />
                    <span>Drop Code:</span>
                    <strong className="font-mono text-slate-900 font-bold tracking-wider">
                      {student.dropCode}
                    </strong>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      student.dropDone
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    }`}
                  >
                    {student.dropDone ? '✓ In Escrow' : 'Missing'}
                  </span>
                </div>

                {/* Row 5: Pickup Code */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pickup Code:</span>
                    <strong className="font-mono text-slate-900 font-bold tracking-wider">
                      {simAllDropped ? (
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {student.pickupCode}
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500 inline" /> Locked (T2)
                        </span>
                      )}
                    </strong>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      student.pickupDone
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : simAllDropped
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {student.pickupDone ? '✓ Handed Over' : simAllDropped ? 'Ready' : 'Locked'}
                  </span>
                </div>

                {/* Return code if failed (T3) */}
                {student.returnCode && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                    <span>Return Code: </span>
                    <span className="font-mono text-xs">{student.returnCode}</span>
                    <div className="text-[10px] text-rose-600 font-medium mt-0.5">
                      Student reclaims deposited item at desk.
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Verification Action Bar - Exact match to media_1790614438104.png */}
          {!simIsFailed && (
            <div className="pt-4 border-t border-pink-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Receive Dropoff Code */}
              <form onSubmit={handleSimDropSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={simDropInput}
                  onChange={(e) => setSimDropInput(e.target.value.toUpperCase())}
                  placeholder="INPUT 6-CHAR DROPOFF CODE"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-mono font-bold text-slate-800 uppercase placeholder:text-slate-400 placeholder:font-mono focus:outline-none focus:border-pink-400 bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Receive Item
                </button>
              </form>

              {/* 2. Authorize Pickup Code */}
              <form onSubmit={handleSimPickupSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={!simAllDropped}
                  value={simPickupInput}
                  onChange={(e) => setSimPickupInput(e.target.value.toUpperCase())}
                  placeholder={
                    simAllDropped
                      ? 'INPUT 6-CHAR PICKUP CODE'
                      : 'LOCKED: AWAITING ALL ITEMS (T2)'
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-mono font-bold text-slate-800 uppercase placeholder:text-slate-400 placeholder:font-mono focus:outline-none focus:border-emerald-400 disabled:bg-[#F8FAFC] disabled:text-slate-400 disabled:cursor-not-allowed bg-white"
                />
                <button
                  type="submit"
                  disabled={!simAllDropped}
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Authorize Pickup
                </button>
              </form>
            </div>
          )}

          {/* Quick-Click Testing Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Test Quick-Fill:</span>
            {!simStudents[0].dropDone && (
              <button
                type="button"
                onClick={() => setSimDropInput('K3SC6X')}
                className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold font-mono border border-pink-200 cursor-pointer"
              >
                Drop: K3SC6X (Arjun)
              </button>
            )}
            {!simStudents[1].dropDone && (
              <button
                type="button"
                onClick={() => setSimDropInput('56FN94')}
                className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold font-mono border border-pink-200 cursor-pointer"
              >
                Drop: 56FN94 (Divya)
              </button>
            )}
            {simAllDropped && !simStudents[0].pickupDone && (
              <button
                type="button"
                onClick={() => setSimPickupInput(simStudents[0].pickupCode)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold font-mono border border-emerald-200 cursor-pointer"
              >
                Pickup: {simStudents[0].pickupCode} (Arjun)
              </button>
            )}
            {simAllDropped && !simStudents[1].pickupDone && (
              <button
                type="button"
                onClick={() => setSimPickupInput(simStudents[1].pickupCode)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold font-mono border border-emerald-200 cursor-pointer"
              >
                Pickup: {simStudents[1].pickupCode} (Divya)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. ACTIVE PROPOSALS LIST FROM ENGINE */}
      {proposals.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-pink-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>Engine Drop Proposals</span>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-black">
                {proposals.length}
              </span>
            </h2>
            <span className="text-xs text-slate-400">
              Generated by directed graph matching algorithm
            </span>
          </div>

          <div className="space-y-6">
            {proposals.map((proposal) => {
              const isSealed = proposal.status === 'sealed';
              const isProposed = proposal.status === 'proposed';
              const isCompleted = proposal.status === 'completed';
              const acceptedCount = proposal.members.filter(m => m.accepted).length;
              const totalCount = proposal.members.length;
              const remainingSec = timeRemainingMap[proposal.id] ?? 300;

              return (
                <div
                  key={proposal.id}
                  className={`bg-white rounded-[2rem] border p-6 shadow-sm transition-all ${
                    isCompleted
                      ? 'border-emerald-300 ring-2 ring-emerald-50'
                      : isSealed
                      ? 'border-emerald-200'
                      : 'border-pink-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        LOOP #{proposal.id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isSealed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isCompleted
                          ? '✓ Completed'
                          : isSealed
                          ? 'Sealed (At Desk Escrow)'
                          : `${acceptedCount}/${totalCount} Accepted`}
                      </span>
                    </div>

                    {isProposed && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-mono font-bold">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>{formatTime(remainingSec)}</span>
                      </div>
                    )}
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {proposal.members.map((member, idx) => {
                      const gives = getItem(member.givesItemId);
                      const receives = getItem(member.receivesItemId);
                      const student = getStudent(member.studentId);

                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-pink-50/40 border border-pink-100 space-y-1.5 text-xs"
                        >
                          <div className="font-bold text-slate-900">
                            {member.name || student?.name || member.codename}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Gives: <strong className="text-slate-900">{gives?.title}</strong>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Receives: <strong className="text-slate-900">{receives?.title}</strong>
                          </div>
                          <div className="pt-1.5 border-t border-pink-100/60 flex items-center justify-between text-[10px]">
                            <span className="font-mono font-bold text-slate-600">
                              {member.dropoffCode}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                member.dropoffDone
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {member.dropoffDone ? 'In Escrow' : 'Waiting Drop'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TheDropView;
