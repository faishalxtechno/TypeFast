import React, { useState } from 'react';
import { Trophy, Target, CheckCircle, Clock, Trash2, TrendingUp, History } from 'lucide-react';
import { UserStats } from '../types';
import { clearUserStats } from '../utils/storage';

interface PersonalStatsProps {
  stats: UserStats;
  onStatsCleared: () => void;
}

export const PersonalStats: React.FC<PersonalStatsProps> = ({ stats, onStatsCleared }) => {
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const handleClear = () => {
    clearUserStats();
    onStatsCleared();
    setConfirmReset(false);
  };

  const statCards = [
    {
      label: 'Best WPM',
      value: stats.bestWpm > 0 ? `${stats.bestWpm}` : '-',
      subtext: stats.bestWpm > 0 ? 'Words per minute' : 'Take a test to set',
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      valueColor: 'text-amber-500 dark:text-amber-400',
    },
    {
      label: 'Best Accuracy',
      value: stats.bestAccuracy > 0 ? `${stats.bestAccuracy.toFixed(1)}%` : '-',
      subtext: stats.bestAccuracy > 0 ? 'Peak precision' : 'Take a test to set',
      icon: <Target className="w-5 h-5 text-cyan-500" />,
      bgGradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-500/30',
      valueColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      label: 'Tests Completed',
      value: `${stats.testsCompleted}`,
      subtext: 'Practice sessions',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Time Practiced',
      value: stats.totalTimeTypedSeconds > 0 ? `${Math.round(stats.totalTimeTypedSeconds / 60)}m` : '0m',
      subtext: 'Total test duration',
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30',
      valueColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <section id="statistics" className="w-full max-w-4xl mx-auto mt-12 scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Your Performance & Statistics
          </h3>
        </div>

        {stats.testsCompleted > 0 && (
          <div>
            {confirmReset ? (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <span className="text-xs text-slate-500 dark:text-slate-400">Reset all?</span>
                <button
                  onClick={handleClear}
                  className="btn-interactive px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="btn-interactive px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="btn-interactive flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2.5 py-1 rounded-lg border border-transparent hover:border-rose-500/30 cursor-pointer"
                title="Clear all saved statistics"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Stats</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${card.bgGradient} bg-white/80 dark:bg-slate-900/70 border ${card.borderColor} backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              {card.icon}
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${card.valueColor}`}>
              {card.value}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
              {card.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tests Mini History */}
      {stats.history && stats.history.length > 0 && (
        <div className="mt-6 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/90 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            <History className="w-3.5 h-3.5 text-brand-500" />
            <span>Recent Test Sessions</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {stats.history.slice(0, 10).map((h, i) => (
              <div
                key={h.id || i}
                className="flex-shrink-0 px-3.5 py-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs transition-all hover:border-brand-500/50"
              >
                <div className="flex items-center gap-1.5 font-bold font-mono text-brand-600 dark:text-brand-400 text-sm">
                  <span>{h.wpm} WPM</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {h.accuracy.toFixed(0)}% acc • {h.duration}s • <span className="capitalize">{h.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
