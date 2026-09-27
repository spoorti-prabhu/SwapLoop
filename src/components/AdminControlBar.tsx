import React from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { Settings, RefreshCw, ShieldAlert, Gift } from 'lucide-react';

export const AdminControlBar: React.FC = () => {
  const { currentScenario, loadScenario } = useSwapLoop();

  // Show if user is Admin or for convenient testing
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-pink-400" />
          <span className="font-bold uppercase tracking-wider text-pink-300">
            Admin Scenario Presets (F10):
          </span>
          <span className="text-slate-400 hidden sm:inline">
            1-click test configurations for matching engine rules & edge cases:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scenario A */}
          <button
            onClick={() => loadScenario('A')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              currentScenario === 'A'
                ? 'bg-pink-600 text-white shadow-sm ring-2 ring-pink-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Arjun, Bhavya, Chetan, Divya, Esha. Picks 3-student loop over 2-student loop."
          >
            <span>Scenario A (Base 5)</span>
          </button>

          {/* Scenario B */}
          <button
            onClick={() => loadScenario('B')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              currentScenario === 'B'
                ? 'bg-pink-600 text-white shadow-sm ring-2 ring-pink-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Adds Kiran with free gift Study table (F11 Gift Chains)"
          >
            <Gift className="w-3 h-3 text-pink-300" />
            <span>Scenario B (+Free Gift)</span>
          </button>

          {/* Scenario C */}
          <button
            onClick={() => loadScenario('C')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              currentScenario === 'C'
                ? 'bg-pink-600 text-white shadow-sm ring-2 ring-pink-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Bhavya's bike set to Medium. T4 trust rules disqualify 3-student loop, engine picks 2-student loop (Arjun -> Divya)!"
          >
            <ShieldAlert className="w-3 h-3 text-amber-300" />
            <span>Scenario C (T4 Trust Lock)</span>
          </button>

          {/* Reset */}
          <button
            onClick={() => loadScenario('default')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white font-medium transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminControlBar;
