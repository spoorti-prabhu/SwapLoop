import React from 'react';
import { X, Server, Database, Cpu, Clock, ShieldCheck, ArrowDown, Activity, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-pink-100 my-8">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#fff7f9] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <BrandLogo variant="badge" badgeSize="w-9 h-9" />
          <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600">
            System Architecture (Section 32)
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          How SwapLoop Works Under the Hood
        </h2>
        <p className="text-sm text-slate-500 mb-8 max-w-2xl">
          SwapLoop replaces prices and bargaining with a directed-graph matching engine that computes closed circular cycles and multi-party gift chains across campus dorms.
        </p>

        {/* Interactive Architecture Flow Diagram */}
        <div className="space-y-6">
          {/* Layer 1: Client */}
          <div className="p-5 rounded-2xl bg-[#fff7f9] border border-pink-200 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <div className="w-8 h-8 rounded-xl bg-white text-pink-500 flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <span>1. Frontend Client Layer (React 18 + Vite + Tailwind CSS)</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-pink-600 bg-white px-2.5 py-0.5 rounded-full border border-pink-100">
                Port 5173
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-10">
              Blush mist design system (`#FFF7F9`), reactive auth state, strict blind proposals UI masking, live countdowns, micro-interactions, and role switching (`[Student]`, `[Desk Operator]`, `[Admin]`).
            </p>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center -my-3">
            <div className="w-8 h-8 rounded-full bg-white border border-pink-200 shadow-sm flex items-center justify-center text-pink-500 animate-bounce">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Layer 2: API Gateway */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
                  <Server className="w-4 h-4" />
                </div>
                <span>2. REST API & Authorization Layer (Node.js + Express)</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                Port 3001
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-10 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-pink-500" /> Blind Proposal Sanitizer
                </strong>
                <span>Strips real names and contact notes from network payload until proposal is sealed (F7).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Trust Rule Validator
                </strong>
                <span>Enforces T4 value bands: New (Low), Trusted (Low+Med), Veteran (All).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-900 block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-600" /> Daily Drop Cron
                </strong>
                <span>Scheduled background job executes matching daily at 8:00 PM.</span>
              </div>
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center -my-3">
            <div className="w-8 h-8 rounded-full bg-white border border-pink-200 shadow-sm flex items-center justify-center text-pink-500 animate-bounce">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Layer 3: Engine & Database */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                <Cpu className="w-4 h-4 text-pink-600" />
                <span>3A. Swap Engine Pipeline</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 pl-6 list-disc">
                <li><strong>Cycle Finder:</strong> DFS search for closed cycles ($k = 2\dots 5$).</li>
                <li><strong>Gift Chain Finder:</strong> Traces pay-it-forward free gift cascades.</li>
                <li><strong>Trust T4 Filter:</strong> Disqualifies loops with value violations.</li>
                <li><strong>Optimizer:</strong> Max-independent set maximizes students satisfied.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>3B. Persistent Database (SQLite)</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1 pl-6">
                <div>File: <code className="text-pink-600 font-mono font-bold">server/data/swaploop.db</code></div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Stores users, items, wants, proposals, single-use codes, declined signatures, reports, and scenario states with full persistence across server restarts.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Production-Ready Full-Stack Architecture</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechArchitectureModal;
