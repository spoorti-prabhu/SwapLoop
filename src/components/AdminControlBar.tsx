import React from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Settings, RefreshCw, ShieldAlert, Gift, ShieldCheck, X } from 'lucide-react';

interface AdminControlBarProps {
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export const AdminControlBar: React.FC<AdminControlBarProps> = ({
  isVisible = true,
  onToggleVisibility
}) => {
  const { currentScenario, loadScenario } = useSwapLoop();

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2 relative z-40 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-pink-400" />
          <div className="flex items-center gap-1.5">
            <span className="font-bold uppercase tracking-wider text-pink-300">
              Admin Scenario Presets:
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-pink-300 shadow-2xs">
              F10
            </kbd>
          </div>
          <span className="text-slate-400 hidden xl:inline">
            1-click test configurations for matching engine rules & edge cases:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scenario A (Base 5) */}
          <button
            onClick={() => loadScenario('A')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentScenario === 'A'
                ? 'bg-[#db2777] text-white shadow-sm ring-2 ring-pink-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Arjun, Bhavya, Chetan, Divya, Esha. Matches 3-student loop (Arjun -> Bhavya -> Chetan)."
          >
            <span>Scenario A (Base 5)</span>
          </button>

          {/* Scenario B (+Free Gift) */}
          <button
            onClick={() => loadScenario('B')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentScenario === 'B'
                ? 'bg-[#db2777] text-white shadow-sm ring-2 ring-pink-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Adds Kiran with free gift Study table (F11 Gift Chains)"
          >
            <Gift className="w-3.5 h-3.5 text-pink-300" />
            <span>Scenario B (+Free Gift)</span>
          </button>

          {/* Scenario C (Trust Disqualified) */}
          <button
            onClick={() => loadScenario('C')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentScenario === 'C'
                ? 'bg-[#db2777] text-white shadow-sm ring-2 ring-pink-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Bhavya's bike set to Medium. Arjun & Bhavya are New tier. T4 trust rules disqualify 3-student loop; 2-person loops prohibited, so 'No valid loop found' appears."
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Scenario C (Trust Disqualified)</span>
          </button>

          {/* Scenario C (Trusted Upgrade) */}
          <button
            onClick={() => loadScenario('C_TRUSTED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentScenario === 'C_TRUSTED'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Arjun & Bhavya upgraded to Trusted tier! Bhavya's Medium bike is now eligible and the 3-student loop forms."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scenario C (Trusted Upgrade)</span>
          </button>

          {/* ↺ Reset */}
          <button
            onClick={() => loadScenario('default')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white font-medium transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset engine state to default seed data"
          >
            <RefreshCw className="w-3 h-3" />
            <span>↺ Reset</span>
          </button>

          {/* Close button to hide */}
          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              title="Hide Admin Bar (Press F10 to reopen)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminControlBar;
