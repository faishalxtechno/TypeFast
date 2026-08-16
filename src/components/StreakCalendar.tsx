import React from 'react';
import { Flame, CheckCircle2, CircleDashed } from 'lucide-react';
import { getStreakInfo, getPast7DaysStatus } from '../services/challengeService';

interface StreakCalendarProps {
  className?: string;
  onStartChallenge?: () => void;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ className = '', onStartChallenge }) => {
  const streak = getStreakInfo();
  const past7Days = getPast7DaysStatus();

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 backdrop-blur-md shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 animate-pulse">
            <Flame className="w-7 h-7 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Daily Challenge Streak
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{streak.currentStreak} Day Streak</span>
              {streak.currentStreak >= 3 && (
                <span className="text-base">🔥</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-right">
          <span>Best: <strong className="text-slate-900 dark:text-white font-mono">{streak.longestStreak} days</strong></span>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 py-1">
        {past7Days.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-150 ${
              item.completed
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs scale-[1.02]'
                : item.isToday
                ? 'bg-white dark:bg-slate-800 border-brand-500/50 text-slate-800 dark:text-slate-200 ring-2 ring-brand-500/20'
                : 'bg-slate-100/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 text-slate-400'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
              {item.dayName}
            </span>
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            ) : item.isToday ? (
              <Flame className="w-5 h-5 text-brand-500 animate-pulse" />
            ) : (
              <CircleDashed className="w-5 h-5 text-slate-300 dark:text-slate-700" />
            )}
          </div>
        ))}
      </div>

      {onStartChallenge && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 flex items-center justify-between">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Complete today's challenge to maintain your streak!
          </p>
          <button
            onClick={onStartChallenge}
            className="btn-interactive px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Start Challenge
          </button>
        </div>
      )}
    </div>
  );
};
