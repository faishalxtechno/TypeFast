import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { UserStats } from '../types';
import { getLeaderboardEntries, LeaderboardTimeframe } from '../services/leaderboardService';
import { PopIn } from '../components/animations/PopIn';

interface LeaderboardProps {
  userStats?: UserStats;
}

export const Leaderboard: React.FC<LeaderboardProps> = () => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('allTime');
  const { entries, userRank } = getLeaderboardEntries({ timeframe });

  const timeframes: { id: LeaderboardTimeframe; label: string }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'allTime', label: 'All-Time' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header (PopIn 0ms) */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Global Rankings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          TypeFast Hall of Fame
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The fastest typists across the globe. Compete, refine your precision, and claim your place at the top.
        </p>
      </PopIn>

      {/* Timeframe Filter Pills (PopIn 60ms) */}
      <PopIn delay={60} className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`btn-interactive px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                timeframe === tf.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </PopIn>

      {/* User Placement Banner (if applicable) */}
      {userRank && (
        <PopIn delay={100} className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-500/15 via-purple-500/10 to-amber-500/15 border border-brand-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-mono font-bold">
              #{userRank.rank}
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Your Current Standing
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Personal best recorded in this timeframe
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-brand-600 dark:text-brand-400">
              {userRank.wpm}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1">WPM</span>
          </div>
        </PopIn>
      )}

      {/* Leaderboard Table with Sequential Row Stagger */}
      <PopIn delay={140} className="overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-4 sm:px-6">Rank</th>
                <th className="py-4 px-4 sm:px-6">Typist</th>
                <th className="py-4 px-4 sm:px-6 text-right">WPM</th>
                <th className="py-4 px-4 sm:px-6 text-right">Accuracy</th>
                <th className="py-4 px-4 sm:px-6 text-right hidden sm:table-cell">Duration</th>
                <th className="py-4 px-4 sm:px-6 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {entries.map((entry, idx) => {
                const isTop3 = entry.rank <= 3;
                return (
                  <tr
                    key={`${entry.rank}-${entry.player}`}
                    style={{ animationDelay: `${Math.min(idx * 50, 350)}ms` }}
                    className={`animate-card-pop hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      entry.rank === 1
                        ? 'bg-amber-500/5'
                        : entry.rank === 2
                        ? 'bg-slate-200/20 dark:bg-slate-800/20'
                        : entry.rank === 3
                        ? 'bg-amber-700/5'
                        : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        {entry.rank === 1 && (
                          <Crown className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                        )}
                        {entry.rank === 2 && (
                          <Medal className="w-5 h-5 text-slate-400" />
                        )}
                        {entry.rank === 3 && (
                          <Medal className="w-5 h-5 text-amber-700" />
                        )}
                        <span className={`font-mono font-bold ${isTop3 ? 'text-base font-black text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          #{entry.rank}
                        </span>
                      </div>
                    </td>

                    {/* Typist Profile */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase border ${
                          entry.rank === 1
                            ? 'bg-amber-500 text-slate-950 border-amber-500 ring-2 ring-amber-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}>
                          {entry.player.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{entry.player}</span>
                            {entry.rank === 1 && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500 text-slate-950 font-black">
                                CHAMPION
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            @{entry.username || entry.player.toLowerCase().replace(/\s+/g, '')}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Speed WPM */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className="font-mono font-black text-base sm:text-lg text-brand-600 dark:text-brand-400">
                        {entry.wpm}
                      </span>
                    </td>

                    {/* Accuracy */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {entry.accuracy.toFixed(1)}%
                      </span>
                    </td>

                    {/* Mode / Duration */}
                    <td className="py-4 px-4 sm:px-6 text-right hidden sm:table-cell">
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium capitalize text-slate-600 dark:text-slate-300">
                        {entry.duration}s • {entry.difficulty}
                      </span>
                    </td>

                    {/* Trend */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      {entry.movement === 'up' && (
                        <span className="inline-flex items-center text-emerald-500 font-bold text-xs" title="Ranking moving up">
                          <TrendingUp className="w-4 h-4" />
                        </span>
                      )}
                      {entry.movement === 'down' && (
                        <span className="inline-flex items-center text-rose-500 font-bold text-xs" title="Ranking moving down">
                          <TrendingDown className="w-4 h-4" />
                        </span>
                      )}
                      {(!entry.movement || entry.movement === 'same') && (
                        <span className="inline-flex items-center text-slate-400 text-xs" title="Ranking steady">
                          <Minus className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PopIn>
    </div>
  );
};
