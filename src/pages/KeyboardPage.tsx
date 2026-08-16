import React from 'react';
import { Target, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { Page } from '../types';
import { KeyboardHeatmap } from '../features/keyboardHeatmap/KeyboardHeatmap';
import { getKeyStats, getWeakestKeys, getStrongestKeys } from '../services/weakKeyService';

interface KeyboardPageProps {
  onNavigate: (page: Page) => void;
}

export const KeyboardPage: React.FC<KeyboardPageProps> = ({ onNavigate }) => {
  const weakest = getWeakestKeys(4);
  const strongest = getStrongestKeys(4);
  const allStats = Object.values(getKeyStats()).sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-10">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Target className="w-4 h-4 text-cyan-500" />
          <span>Biomechanical Heatmap</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Keyboard Performance Heatmap
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Inspect your per-key finger accuracy, mistake hot spots, and error frequencies across all QWERTY key locations.
        </p>
      </div>

      {/* Heatmap Component */}
      <KeyboardHeatmap onSelectKey={() => onNavigate('practice')} />

      {/* Quick Analysis Grid (Weakest vs Strongest) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Keys Hotspots */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-rose-500/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Weakest Key Hotspots
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-500 uppercase">Attention Needed</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {weakest.map(k => (
              <div
                key={k.key}
                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-1"
              >
                <div className="font-mono font-black text-2xl text-rose-600 dark:text-rose-400">
                  {k.key}
                </div>
                <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {k.accuracy.toFixed(1)}% Acc
                </div>
                <div className="text-[10px] text-slate-500">
                  {k.incorrect} mistakes
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="btn-interactive w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Practice These Weak Keys</span>
          </button>
        </div>

        {/* Strongest Keys */}
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-emerald-500/30 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Strongest Muscle Memory
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-500 uppercase">Flawless Cadence</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {strongest.map(k => (
              <div
                key={k.key}
                className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1"
              >
                <div className="font-mono font-black text-2xl text-emerald-600 dark:text-emerald-400">
                  {k.key}
                </div>
                <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  {k.accuracy.toFixed(1)}% Acc
                </div>
                <div className="text-[10px] text-slate-500">
                  {k.correct} hits
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center">
            ✨ Excellent high-precision muscle memory on home-row anchor keys.
          </div>
        </div>
      </div>

      {/* Complete Key Telemetry Ranking Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          All Key Telemetry & Precision Rankings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Key</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
                <th className="py-3 px-4 text-right">Mistakes</th>
                <th className="py-3 px-4 text-right">Correct Hits</th>
                <th className="py-3 px-4 text-right">Total Attempts</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {allStats.map(stat => (
                <tr key={stat.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-black text-base text-brand-600 dark:text-brand-400">
                    {stat.key}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    {stat.accuracy.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right text-rose-500 font-semibold">
                    {stat.incorrect}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-500">
                    {stat.correct}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">
                    {stat.attempts}
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      stat.accuracy >= 95
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : stat.accuracy >= 88
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                    }`}>
                      {stat.accuracy >= 95 ? 'Strong' : stat.accuracy >= 88 ? 'Medium' : 'Weak'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
