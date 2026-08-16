import React, { useState } from 'react';
import { Target, AlertTriangle, Zap, Info } from 'lucide-react';
import { getKeyStats } from '../../services/weakKeyService';
import { KeyStat } from '../../types';

export type HeatmapFilter = 'accuracy' | 'mistakes' | 'speed';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

interface KeyboardHeatmapProps {
  onSelectKey?: (key: string) => void;
  className?: string;
}

export const KeyboardHeatmap: React.FC<KeyboardHeatmapProps> = ({ onSelectKey, className = '' }) => {
  const [filter, setFilter] = useState<HeatmapFilter>('accuracy');
  const [hoveredKey, setHoveredKey] = useState<KeyStat | null>(null);

  const stats = getKeyStats();

  const getKeyPerformanceTier = (stat: KeyStat | undefined): 'strong' | 'medium' | 'weak' => {
    if (!stat || stat.attempts < 3) return 'strong';
    if (stat.accuracy >= 95) return 'strong';
    if (stat.accuracy >= 88) return 'medium';
    return 'weak';
  };

  const getKeyColorClasses = (stat: KeyStat | undefined) => {
    const tier = getKeyPerformanceTier(stat);
    if (filter === 'accuracy') {
      if (tier === 'strong') return 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25';
      if (tier === 'medium') return 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25';
      return 'bg-rose-500/15 border-rose-500/60 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 ring-2 ring-rose-500/30';
    }
    if (filter === 'mistakes') {
      const mistakes = stat?.incorrect || 0;
      if (mistakes === 0) return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400';
      if (mistakes <= 3) return 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-400';
      return 'bg-rose-500/20 border-rose-500/60 text-rose-600 dark:text-rose-400 font-extrabold ring-2 ring-rose-500/30';
    }
    // Speed / default
    return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-brand-500';
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md space-y-6 animate-card-pop ${className}`}>
      {/* Header with Heatmap Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Interactive Keyboard Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify finger precision hotspots and error frequencies across all key positions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-bold">
          <button
            onClick={() => setFilter('accuracy')}
            className={`btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              filter === 'accuracy'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </button>
          <button
            onClick={() => setFilter('mistakes')}
            className={`btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              filter === 'mistakes'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Mistakes</span>
          </button>
          <button
            onClick={() => setFilter('speed')}
            className={`btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              filter === 'speed'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Speed Flow</span>
          </button>
        </div>
      </div>

      {/* Visual Keyboard Matrix */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[560px] sm:min-w-full flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex items-center gap-1.5 ${
                rowIdx === 1 ? 'pl-4' : rowIdx === 2 ? 'pl-10' : ''
              }`}
            >
              {row.map(char => {
                const stat = stats[char];
                const accuracy = stat ? stat.accuracy : 100;
                const mistakes = stat ? stat.incorrect : 0;
                const colorClasses = getKeyColorClasses(stat);

                return (
                  <button
                    key={char}
                    onClick={() => onSelectKey && onSelectKey(char)}
                    onMouseEnter={() => setHoveredKey(stat || { key: char, attempts: 0, correct: 0, incorrect: 0, accuracy: 100, mistakesAgainst: {} })}
                    onMouseLeave={() => setHoveredKey(null)}
                    className={`relative flex flex-col items-center justify-center w-11 sm:w-14 h-12 sm:h-14 rounded-xl border font-mono shadow-xs transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer ${colorClasses}`}
                  >
                    <span className="text-sm sm:text-base font-black">{char}</span>
                    <span className="text-[9px] sm:text-[10px] font-semibold opacity-90">
                      {filter === 'mistakes' ? `${mistakes} err` : `${accuracy.toFixed(0)}%`}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Spacebar Row */}
          <div className="w-full flex justify-center pt-1">
            <div className="w-64 sm:w-80 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-500">
              SPACEBAR (Thumb)
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Hover Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500" />
            <span>Strong (95%+)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-500" />
            <span>Medium (88-94%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500/30 border border-rose-500" />
            <span>Weak (&lt;88%)</span>
          </span>
        </div>

        {hoveredKey ? (
          <div className="font-mono text-xs text-slate-900 dark:text-white font-bold animate-fade-in">
            Key <strong className="text-brand-600 dark:text-brand-400 font-extrabold">{hoveredKey.key}</strong>: {hoveredKey.accuracy.toFixed(1)}% Accuracy • {hoveredKey.incorrect} Mistakes ({hoveredKey.attempts} Attempts)
          </div>
        ) : (
          <div className="text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Hover or tap any key to view detailed telemetry</span>
          </div>
        )}
      </div>
    </div>
  );
};
