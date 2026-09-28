import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Sparkles, Package, Repeat, Gift, Award, ShieldCheck, BookOpen } from 'lucide-react';
import { TriangleLoopIcon } from './SwapLoopLogo';
import { StudentStoriesModal } from './StudentStoriesModal';

export const LoopWallView: React.FC = () => {
  const { stats, proposals, items, allUsers } = useSwapLoop();
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);

  const completedLoops = proposals.filter(p => p.status === 'completed');

  // Compute largest loop of the week (defaults to 5-person loop record)
  const largestCompletedSize = completedLoops.reduce(
    (max, loop) => Math.max(max, loop.members.length),
    0
  );
  const largestLoopOfTheWeek = largestCompletedSize > 0 ? `${largestCompletedSize}-Person Cycle` : '5-Person Cycle';

  const getItem = (itemId: string) => items.find(i => i.id === itemId);
  const getUser = (userId: string) => allUsers.find(u => u.id === userId);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF7F9] to-white p-6 sm:p-10 rounded-[2.5rem] border border-pink-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-10 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#DE5B9B] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Loop Wall • Campus Circularity Impact</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The Campus Loop Wall
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Celebrating campus circularity! Every completed loop keeps essentials in circulation, cuts student debt, and fosters genuine trust within the university community.
          </p>
        </div>
      </div>

      {/* 4 ANIMATED METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Items Rehomed */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group hover:border-pink-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Total Items Rehomed
            </span>
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 font-mono tracking-tight animate-pulse" style={{ animationDuration: '3s' }}>
            {stats.totalRehomed}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-extrabold">100% cashless</span>
            <span>circular swaps</span>
          </div>
        </div>

        {/* Metric 2: Successful Loops Completed */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group hover:border-purple-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Successful Loops Completed
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 font-mono tracking-tight animate-pulse" style={{ animationDuration: '3.2s' }}>
            {stats.loopsCompleted}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-purple-600 font-extrabold">Closed Cycles</span>
            <span>desk verified</span>
          </div>
        </div>

        {/* Metric 3: Longest Gift Chain */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Longest Gift Chain
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 font-mono tracking-tight animate-pulse" style={{ animationDuration: '2.8s' }}>
            {stats.longestGiftChain} Swappers
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-extrabold">Pay-it-Forward</span>
            <span>community chain</span>
          </div>
        </div>

        {/* Metric 4: Largest Loop of the Week */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group hover:border-amber-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Largest Loop of Week
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight animate-pulse" style={{ animationDuration: '3.5s' }}>
            {largestLoopOfTheWeek}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-amber-600 font-extrabold">5 Swappers</span>
            <span>multi-way cycle</span>
          </div>
        </div>
      </div>

      {/* HALL OF FAME: RECENT COMPLETED CAMPUS LOOPS */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-pink-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-pink-50 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Verified Campus Swaps</span>
            </h2>
            <p className="text-xs text-slate-500">
              Loops whose escrow pickup codes were validated at the campus desk.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            {completedLoops.length} loops authenticated
          </span>
        </div>

        {completedLoops.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-pink-50 text-[#DE5B9B] flex items-center justify-center">
              <TriangleLoopIcon size={24} color="#DE5B9B" />
            </div>
            <div className="font-bold text-slate-700 text-sm">No completed loops in active session yet</div>
            <p>
              Complete the physical drop-offs and pickups in the <strong>Swap Desk</strong> tab to see your closed loops immortalized here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedLoops.map((loop) => (
              <div
                key={loop.id}
                className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50/40 via-white to-pink-50/30 border border-emerald-200/90 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-black text-xs text-slate-900 font-mono">
                      LOOP #{loop.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                      {loop.members.length}-Way Verified Closed Cycle
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Completed via Campus Desk Escrow
                  </span>
                </div>

                {/* Swapper Chain with Revealed Identities */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {loop.members.map((m) => {
                    const realUser = getUser(m.studentId);
                    const itemGiven = getItem(m.givesItemId);

                    return (
                      <div
                        key={m.studentId}
                        className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-xs text-xs space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                            {(m.name || realUser?.name || 'S')[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">
                              {m.name || realUser?.name || m.codename}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold">
                              {realUser?.trustLevel || 'Student'} Swapper
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 pt-1">
                          Rehomed: <strong>{itemGiven?.title || 'Item'}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Ethos Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Campus Safe Circular Economy</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Made for students, kinder to the planet.
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            No money changes hands. No predatory secondhand markups. Every semester, hundreds of tons of dorm appliances, lab gear, and textbooks stay in use right here on campus.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsStoriesOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#db2777] to-[#be185d] hover:from-[#be185d] hover:to-[#9d174d] text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read the stories by students</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <div className="text-2xl font-black text-pink-400 font-mono">100%</div>
            <div className="text-[11px] text-slate-300 uppercase tracking-wider font-bold">Cashless</div>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <div className="text-2xl font-black text-emerald-400 font-mono">Zero</div>
            <div className="text-[11px] text-slate-300 uppercase tracking-wider font-bold">Landfill</div>
          </div>
        </div>
      </div>

      {/* Student Stories Modal */}
      <StudentStoriesModal
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
      />
    </div>
  );
};

export default LoopWallView;
