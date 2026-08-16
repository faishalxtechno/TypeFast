import React, { useState } from 'react';
import {
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { UserStats, TestDuration, Difficulty } from '../types';
import { getLeaderboardEntries, LeaderboardTimeframe } from '../services/leaderboardService';

interface LeaderboardProps {
  userStats: UserStats;
}

export const Leaderboard: React.FC<LeaderboardProps> = () => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('allTime');
  const [duration, setDuration] = useState<TestDuration | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');

  const { entries, userRank } = getLeaderboardEntries({
    timeframe,
    duration,
    difficulty
  });

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm border border-amber-500/40 shadow-sm shadow-amber-500/20">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-300/20 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-300/40">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-700/20 text-amber-700 dark:text-amber-500 flex items-center justify-center font-bold text-sm border border-amber-700/40">
            🥉
          </div>
        );
      default:
        return (
          <span className="w-8 text-center font-mono font-bold text-sm text-slate-500 dark:text-slate-400">
            #{rank}
          </span>
        );
    }
  };

  const renderMovement = (movement?: 'up' | 'down' | 'same', val?: number) => {
    if (movement === 'up') {
      return (
        <span className="inline-flex items-center text-[10px] font-bold text-emerald-500 font-mono">
          <ArrowUp className="w-3 h-3" />
          {val || 1}
        </span>
      );
    }
    if (movement === 'down') {
      return (
        <span className="inline-flex items-center text-[10px] font-bold text-rose-500 font-mono">
          <ArrowDown className="w-3 h-3" />
          {val || 1}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[10px] font-bold text-slate-400">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-8">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Global Speed Standings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          TypeFast Leaderboard
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The fastest touch typists ranked by real typing speed, precision accuracy, and verified test duration.
        </p>
      </div>

      {/* User Rank Highlight Banner (if ranked) */}
      {userRank && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-500/20 via-emerald-500/10 to-transparent border-2 border-brand-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-black font-mono text-base shadow-md shadow-brand-500/30">
              #{userRank.rank}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Your Current Placement
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                You are ranked #{userRank.rank} among global typists!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-mono">
            <span><strong className="text-brand-600 dark:text-brand-400 font-black">{userRank.wpm} WPM</strong></span>
            <span>•</span>
            <span><strong className="text-cyan-600 dark:text-cyan-400 font-bold">{userRank.accuracy.toFixed(1)}% Acc</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Moving Up</span>
            </span>
          </div>
        </div>
      )}

      {/* Timeframe & Mode Filter Bars */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Timeframe Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-bold">
          {(['daily', 'weekly', 'monthly', 'allTime'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`btn-interactive px-3.5 py-1.5 rounded-xl capitalize transition-all ${
                timeframe === tf
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf === 'allTime' ? 'All Time' : tf}
            </button>
          ))}
        </div>

        {/* Duration & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Duration */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
            <button
              onClick={() => setDuration('all')}
              className={`btn-interactive px-2.5 py-1 rounded-lg transition-all ${duration === 'all' ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold' : 'text-slate-500'}`}
            >
              All
            </button>
            {([15, 30, 60, 120] as const).map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`btn-interactive px-2.5 py-1 rounded-lg transition-all ${duration === d ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold' : 'text-slate-500'}`}
              >
                {d}s
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
            {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`btn-interactive px-2.5 py-1 rounded-lg capitalize transition-all ${difficulty === diff ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold' : 'text-slate-500'}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-4 sm:px-6 w-16">Rank</th>
                <th className="py-4 px-2 w-12 text-center">Trend</th>
                <th className="py-4 px-4 sm:px-6">Player</th>
                <th className="py-4 px-4 sm:px-6 text-right">Net WPM</th>
                <th className="py-4 px-4 sm:px-6 text-right">Accuracy</th>
                <th className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center">Mode</th>
                <th className="py-4 px-4 sm:px-6 hidden md:table-cell text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {entries.map((entry) => (
                <tr
                  key={`${entry.rank}-${entry.player}`}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-brand-500/10 dark:bg-brand-950/40 font-bold border-l-4 border-l-brand-500'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-4 sm:px-6">
                    {getRankBadge(entry.rank)}
                  </td>

                  {/* Trend Movement */}
                  <td className="py-4 px-2 text-center">
                    {renderMovement(entry.movement, entry.movementValue)}
                  </td>

                  {/* Player Name */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${entry.isCurrentUser ? 'text-brand-600 dark:text-brand-400' : 'text-slate-900 dark:text-white'}`}>
                        {entry.player}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-500 text-white font-black">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>

                  {/* WPM */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <span className="font-mono font-black text-base text-brand-600 dark:text-brand-400">
                      {entry.wpm}
                    </span>
                  </td>

                  {/* Accuracy */}
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {entry.accuracy.toFixed(1)}%
                    </span>
                  </td>

                  {/* Mode */}
                  <td className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {entry.duration}s • {entry.difficulty}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-right text-xs text-slate-500 dark:text-slate-400">
                    {entry.date}
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
