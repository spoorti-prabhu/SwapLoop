import React from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Sparkles, Package, Repeat, Gift, Award } from 'lucide-react';
import { TriangleLoopIcon } from './SwapLoopLogo';

export const LoopWallView: React.FC = () => {
  const { stats, proposals } = useSwapLoop();

  const completedLoops = proposals.filter(p => p.status === 'completed');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>F12 • Campus Circular Impact</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Public Loop Wall & Statistics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Celebrating campus circularity! Every completed loop keeps dorm essentials out of landfills and builds campus connection.
        </p>
      </div>

      {/* Big Impact Stat Cards (F12) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group hover:border-pink-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold text-slate-400">Total Items Rehomed</span>
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
            {stats.totalRehomed}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100% cashless</span>
            <span>swapped student-to-student</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group hover:border-pink-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold text-slate-400">Loops Completed</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
            {stats.loopsCompleted}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-purple-600 font-bold">Closed Cycles</span>
            <span>authenticated via Swap Desk</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm relative overflow-hidden group hover:border-pink-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold text-slate-400">Longest Gift Chain</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
            {stats.longestGiftChain} Swappers
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">F11 Pay-it-Forward</span>
            <span>free gift cascade</span>
          </div>
        </div>
      </div>

      {/* Hall of Fame / Recent Completed Loops */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Recent Verified Campus Swaps</span>
        </h2>

        {completedLoops.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No loops completed in this active session yet. Complete pickups in the Swap Desk tab to register on the Wall!
          </div>
        ) : (
          <div className="space-y-3">
            {completedLoops.map((loop) => (
              <div
                key={loop.id}
                className="p-4 rounded-2xl bg-[#fff7f9] border border-pink-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <TriangleLoopIcon size={20} color="#f472b6" />
                  <span className="font-bold text-slate-900">
                    {loop.members.length}-Way Loop Verified
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">
                    {loop.members.map(m => m.codename).join(' ⇄ ')}
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ Desk Handover Sealed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoopWallView;
