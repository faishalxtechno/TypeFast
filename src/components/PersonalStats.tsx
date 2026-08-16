import React from 'react';
import { Trophy, Target, CheckCircle, Clock, Trash2, TrendingUp } from 'lucide-react';
import { UserStats } from '../types';
import { clearUserStats } from '../utils/storage';

interface PersonalStatsProps {
  stats: UserStats;
  onStatsCleared: () => void;
}

export const PersonalStats: React.FC<PersonalStatsProps> = ({ stats, onStatsCleared }) => {
  const handleClear = () => {
    if (window.confirm('Are you sure you want to reset all your typing statistics?')) {
      clearUserStats();
      onStatsCleared();
    }
  };

  const statCards = [
    {
      label: 'Best WPM',
      value: stats.bestWpm > 0 ? `${stats.bestWpm}` : '-',
      subtext: stats.bestWpm > 0 ? 'Words per minute' : 'Take a test to set',
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      bgGradient: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20',
      valueColor: 'text-amber-500 dark:text-amber-400',
    },
    {
      label: 'Best Accuracy',
      value: stats.bestAccuracy > 0 ? `${stats.bestAccuracy.toFixed(1)}%` : '-',
      subtext: stats.bestAccuracy > 0 ? 'Peak precision' : 'Take a test to set',
      icon: <Target className="w-5 h-5 text-cyan-500" />,
      bgGradient: 'from-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/20',
      valueColor: 'text-cyan-500 dark:text-cyan-400',
    },
    {
      label: 'Tests Completed',
      value: `${stats.testsCompleted}`,
      subtext: 'Practice sessions',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      bgGradient: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20',
      valueColor: 'text-emerald-500 dark:text-emerald-400',
    },
    {
      label: 'Time Practiced',
      value: stats.totalTimeTypedSeconds > 0 ? `${Math.round(stats.totalTimeTypedSeconds / 60)}m` : '0m',
      subtext: 'Total test duration',
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      bgGradient: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/20',
      valueColor: 'text-purple-500 dark:text-purple-400',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-500" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Your Statistics
          </h3>
        </div>

        {stats.testsCompleted > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1 rounded"
            title="Clear all saved statistics"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${card.bgGradient} bg-white/70 dark:bg-slate-900/60 border ${card.borderColor} backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              {card.icon}
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${card.valueColor}`}>
              {card.value}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              {card.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tests Mini History */}
      {stats.history && stats.history.length > 0 && (
        <div className="mt-6 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
            Recent Test Sessions
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {stats.history.slice(0, 8).map((h, i) => (
              <div
                key={h.id || i}
                className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs"
              >
                <div className="flex items-center gap-1.5 font-bold font-mono text-brand-600 dark:text-brand-400">
                  <span>{h.wpm} WPM</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  {h.accuracy.toFixed(0)}% acc • {h.duration}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
