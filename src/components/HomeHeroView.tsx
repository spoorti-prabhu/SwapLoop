import React, { useState, useEffect } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { ItemIllustration } from './ItemIllustration';
import { BlindSecurityModal } from './BlindSecurityModal';
import {
  Sparkles,
  ArrowRight,
  RotateCw,
  Clock,
  ShieldCheck,
  Building,
  Award,
  Repeat,
  ChevronRight,
  Gift
} from 'lucide-react';

interface HomeHeroViewProps {
  onOpenArchitecture?: () => void;
}

export const HomeHeroView: React.FC<HomeHeroViewProps> = ({ onOpenArchitecture: _onOpenArchitecture }) => {
  const { setActiveTab, dropCountdownSeconds } = useSwapLoop();
  const [activeCycleStep, setActiveCycleStep] = useState(0);
  const [isBlindSecurityOpen, setIsBlindSecurityOpen] = useState(false);
  const [selectedScenarioTab, setSelectedScenarioTab] = useState<'A' | 'B'>('A');

  // Format seconds into HH : MM : SS
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

  const time = formatCountdown(dropCountdownSeconds);

  // Animated looping cycle indicator
  useEffect(() => {
    const maxSteps = selectedScenarioTab === 'A' ? 3 : 4;
    setActiveCycleStep(0);
    const interval = setInterval(() => {
      setActiveCycleStep((prev) => (prev + 1) % maxSteps);
    }, 2800);
    return () => clearInterval(interval);
  }, [selectedScenarioTab]);

  return (
    <div className="space-y-16 pb-12 animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white via-[#FFF7F9] to-[#FFF0F4] border border-pink-200/80 p-8 sm:p-12 lg:p-16 shadow-sm">
        {/* Soft background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Action */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/70 border border-pink-200 text-xs font-bold uppercase tracking-wider text-pink-700">
              <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
              <span>Campus Circular Economy • 100% Cashless</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              FIND THE SWAPS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500">
                NOBODY CAN SEE.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
              Give what you don't need. Get what you actually want. SwapLoop's algorithmic engine weaves hidden multi-student circular trades across university dorms.
            </p>

            {/* Next Drop Status Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-pink-100 shadow-sm backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Drop</div>
                  <div className="text-sm font-extrabold text-slate-900">Today · 5:00 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-black text-base tracking-widest">
                  {time.hours}
                </div>
                <span className="text-slate-400 font-bold">:</span>
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-black text-base tracking-widest">
                  {time.minutes}
                </div>
                <span className="text-slate-400 font-bold">:</span>
                <div className="px-2.5 py-1.5 rounded-lg bg-pink-600 text-white font-black text-base tracking-widest">
                  {time.seconds}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('browse')}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:from-[#ec4899] hover:to-[#f43f5e] text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>EXPLORE ITEMS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setActiveTab('drop')}
                className="px-7 py-3.5 rounded-full bg-white hover:bg-pink-50/70 text-slate-800 font-bold text-sm border border-pink-200 shadow-sm transition-all duration-200 flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4 text-pink-500" />
                <span>SEE THE DROP</span>
              </button>
            </div>
          </div>

          {/* Right Column: Animated Interactive Campus Loop Visualization */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none bg-white/80 backdrop-blur-md rounded-3xl border border-pink-200/90 p-5 sm:p-7 shadow-xl shadow-pink-500/5">
              {/* Header with Interactive Scenario Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-pink-50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Hidden Campus Loop</span>
                </div>

                {/* Scenario Toggle Tabs */}
                <div className="flex items-center bg-[#FFF7FA] p-1 rounded-full border border-pink-200/80 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedScenarioTab('A')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      selectedScenarioTab === 'A'
                        ? 'bg-gradient-to-r from-[#db2777] to-[#be185d] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#db2777] hover:bg-white/60'
                    }`}
                  >
                    Scenario A (3-Student Loop)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedScenarioTab('B')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedScenarioTab === 'B'
                        ? 'bg-gradient-to-r from-[#db2777] to-[#be185d] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#db2777] hover:bg-white/60'
                    }`}
                  >
                    <Gift className="w-3 h-3 text-pink-300" />
                    <span>Scenario B (Gift Loop)</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Scenario Loop Content */}
              {selectedScenarioTab === 'A' ? (
                /* SCENARIO A: 3-STUDENT DIRECT ONE-WAY CLOSED LOOP */
                <div key="scenario-a" className="relative space-y-3.5 animate-fadeIn">
                  {/* Node 1: Arjun */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    activeCycleStep === 0
                      ? 'bg-rose-50/80 border-rose-300 shadow-md shadow-rose-200/50 scale-[1.02]'
                      : 'bg-white border-pink-100 hover:border-pink-200'
                  }`}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0">
                        A
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">Arjun Sharma</div>
                        <div className="text-xs text-slate-500 truncate">Hostel 3 • Gives Drafter, Wants Bike</div>
                      </div>
                    </div>
                    <ItemIllustration title="Mini drafter" size="sm" />
                  </div>

                  {/* Arrow Down 1 */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-[#db2777] text-xs font-bold shadow-sm">
                      ↓
                    </div>
                  </div>

                  {/* Node 2: Bhavya */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    activeCycleStep === 1
                      ? 'bg-rose-50/80 border-rose-300 shadow-md shadow-rose-200/50 scale-[1.02]'
                      : 'bg-white border-pink-100 hover:border-pink-200'
                  }`}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center font-bold text-pink-700 text-sm flex-shrink-0">
                        B
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">Bhavya Patel</div>
                        <div className="text-xs text-slate-500 truncate">Hostel 2 • Gives Bicycle, Wants Ext Board</div>
                      </div>
                    </div>
                    <ItemIllustration title="Bicycle" size="sm" />
                  </div>

                  {/* Arrow Down 2 */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-[#db2777] text-xs font-bold shadow-sm">
                      ↓
                    </div>
                  </div>

                  {/* Node 3: Chetan */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    activeCycleStep === 2
                      ? 'bg-rose-50/80 border-rose-300 shadow-md shadow-rose-200/50 scale-[1.02]'
                      : 'bg-white border-pink-100 hover:border-pink-200'
                  }`}>
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-sm flex-shrink-0">
                        C
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">Chetan Verma</div>
                        <div className="text-xs text-slate-500 truncate">Hostel 4 • Gives Ext Board, Wants Drafter</div>
                      </div>
                    </div>
                    <ItemIllustration title="Extension board" size="sm" />
                  </div>

                  {/* One-Way Loop Closes Back to Student A */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 border border-pink-200 text-center">
                    <div className="text-xs font-bold text-pink-700 flex items-center justify-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5 text-[#db2777]" />
                      <span>One-Way Loop: Chetan's Ext Board ➔ Bhavya • Arjun receives Bhavya's Bike!</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Direct 3-student closed loop (A → B → C → back to A) with zero monetary exchange.
                    </div>
                  </div>
                </div>
              ) : (
                /* SCENARIO B: GIFT LOOP WITH DONOR PASS-THROUGH INTEGRATED INTO THE CIRCULAR CHAIN */
                <div key="scenario-b" className="relative space-y-2.5 animate-fadeIn">
                  {/* Node 1: Kiran (Free Gift Donor) */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeCycleStep === 0
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-md shadow-emerald-200/50 scale-[1.02]'
                      : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs flex-shrink-0 shadow-xs">
                        K
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">Kiran Reddy</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase flex items-center gap-0.5">
                            <Gift className="w-2.5 h-2.5" /> Free Gift
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">Hostel 3 • Gives Solid Wood Study Table • Donor Pass-Through</div>
                      </div>
                    </div>
                    <ItemIllustration title="Solid Wood Study Table" size="sm" />
                  </div>

                  {/* Arrow Down 1 */}
                  <div className="flex justify-center -my-1.5 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 text-xs font-bold shadow-sm">
                      ↓
                    </div>
                  </div>

                  {/* Node 2: Arjun */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeCycleStep === 1
                      ? 'bg-rose-50/80 border-rose-300 shadow-md shadow-rose-200/50 scale-[1.02]'
                      : 'bg-white border-pink-100 hover:border-pink-200'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-xs flex-shrink-0">
                        A
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Arjun Sharma</div>
                        <div className="text-[11px] text-slate-500 truncate">Hostel 3 • Receives Study Table, Gives Mini Drafter</div>
                      </div>
                    </div>
                    <ItemIllustration title="Mini drafter" size="sm" />
                  </div>

                  {/* Arrow Down 2 */}
                  <div className="flex justify-center -my-1.5 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-[#db2777] text-xs font-bold shadow-sm">
                      ↓
                    </div>
                  </div>

                  {/* Node 3: Bhavya */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeCycleStep === 2
                      ? 'bg-rose-50/80 border-rose-300 shadow-md shadow-rose-200/50 scale-[1.02]'
                      : 'bg-white border-pink-100 hover:border-pink-200'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center font-bold text-pink-700 text-xs flex-shrink-0">
                        B
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Bhavya Patel</div>
                        <div className="text-[11px] text-slate-500 truncate">Hostel 2 • Receives Drafter, Gives Bicycle</div>
                      </div>
                    </div>
                    <ItemIllustration title="Bicycle" size="sm" />
                  </div>

                  {/* Arrow Down 3 */}
                  <div className="flex justify-center -my-1.5 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-[#db2777] text-xs font-bold shadow-sm">
                      ↓
                    </div>
                  </div>

                  {/* Node 4: Chetan */}
                  <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                    activeCycleStep === 3
                      ? 'bg-rose-50/80 border-rose-300 shadow-md shadow-rose-200/50 scale-[1.02]'
                      : 'bg-white border-pink-100 hover:border-pink-200'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-xs flex-shrink-0">
                        C
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Chetan Verma</div>
                        <div className="text-[11px] text-slate-500 truncate">Hostel 4 • Receives Bike, Passes Gift Chain Forward</div>
                      </div>
                    </div>
                    <ItemIllustration title="Extension board" size="sm" />
                  </div>

                  {/* Pay-It-Forward Loop Closes */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-pink-500/10 to-amber-500/10 border border-emerald-200 text-center">
                    <div className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Gift Loop: Kiran's Free Table unlocks 4-student circular chain!</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Donor pass-through creates pay-it-forward circularity with zero monetary cost.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (5-STEP CLEAR JOURNEY) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/60 text-pink-600 text-xs font-bold uppercase tracking-wider">
            <span>The Circular Mechanism</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How SwapLoop Works in 5 Steps
          </h2>
          <p className="text-sm text-slate-500">
            From dorm closet to campus handover. Cashless, trust-verified, and algorithmic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-pink-200 transition-all duration-200">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-black text-sm mb-4 border border-pink-100">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">List What You Have</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add an unused study tool, gadget, book, or hostel gear into your inventory.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('have')}
              className="pt-4 mt-4 border-t border-pink-50 flex items-center text-[11px] font-bold text-pink-600 hover:text-pink-700 cursor-pointer transition-colors group/link w-full text-left"
            >
              <span className="group-hover/link:underline">My Items (Have)</span>
              <ChevronRight className="w-3 h-3 ml-0.5 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-pink-200 transition-all duration-200">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-sm mb-4 border border-rose-100">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Tell Us What You Want</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse student listings and tap "I Want This" on items you need this semester.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('browse')}
              className="pt-4 mt-4 border-t border-pink-50 flex items-center text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer transition-colors group/link w-full text-left"
            >
              <span className="group-hover/link:underline">Browse Feed</span>
              <ChevronRight className="w-3 h-3 ml-0.5 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-pink-200 transition-all duration-200">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm mb-4 border border-purple-100">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">The Daily Drop Matches</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every day at 5:00 PM, the engine finds closed loops of 3 to 5 students.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('drop')}
              className="pt-4 mt-4 border-t border-pink-50 flex items-center text-[11px] font-bold text-purple-600 hover:text-purple-700 cursor-pointer transition-colors group/link w-full text-left"
            >
              <span className="group-hover/link:underline">The Drop Engine</span>
              <ChevronRight className="w-3 h-3 ml-0.5 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-pink-200 transition-all duration-200">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm mb-4 border border-indigo-100">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Accept Blind Proposals</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review your blind swap offer within 5 minutes. Names remain locked until 100% accept.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsBlindSecurityOpen(true)}
              className="pt-4 mt-4 border-t border-pink-50 flex items-center text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors group/link w-full text-left"
            >
              <span className="group-hover/link:underline">Blind Security</span>
              <ChevronRight className="w-3 h-3 ml-0.5 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-pink-200 transition-all duration-200">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm mb-4 border border-emerald-100">
                5
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Secure Swap Desk Escrow</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drop off your item at the campus desk. Pickup codes release once all items are secured.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('desk')}
              className="pt-4 mt-4 border-t border-pink-50 flex items-center text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer transition-colors group/link w-full text-left"
            >
              <span className="group-hover/link:underline">Secure Swap Desk Escrow</span>
              <ChevronRight className="w-3 h-3 ml-0.5 transition-transform group-hover/link:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CAMPUS ECOSYSTEM & TRUST PILLARS */}
      <section className="rounded-3xl bg-white border border-pink-100 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="border-b border-pink-50 pb-6">
          <div>
            <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">Dormitory Architecture</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built for University Residence Halls
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Protected by college verification, trust tiers, and physical campus escrow stations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Trust Tier Card */}
          <div className="p-6 rounded-2xl bg-[#FFF7F9]/80 border border-pink-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Trust Value Bands (T4)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              New students trade Low-value items. Successful swaps unlock Medium ($50) and High ($150) tiers, preventing scamming and mismatched value loops.
            </p>
          </div>

          {/* Physical Escrow Card */}
          <div className="p-6 rounded-2xl bg-[#FFF7F9]/80 border border-pink-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Physical Escrow Station</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In multi-student loops, "give before receive" fails. The Swap Desk holds all items until verified, ensuring no student ever walks away empty-handed.
            </p>
          </div>

          {/* Swap Score Card */}
          <div className="p-6 rounded-2xl bg-[#FFF7F9]/80 border border-pink-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Dynamic Swap Score</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students begin with 100 points. Completing drops increases priority (+10); ghosting or declines deduct points. Scores below 60 are excluded from drops.
            </p>
          </div>
        </div>
      </section>

      {/* Blind Security Details Modal */}
      <BlindSecurityModal
        isOpen={isBlindSecurityOpen}
        onClose={() => setIsBlindSecurityOpen(false)}
        onGoToProposal={() => {
          setIsBlindSecurityOpen(false);
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
};

export default HomeHeroView;
