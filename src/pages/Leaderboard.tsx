import React, { useState } from 'react';
import { Trophy, Medal, Crown, Sparkles, Filter, Users, Radio } from 'lucide-react';
import { INITIAL_LEADERBOARD } from '../data/leaderboardData';
import { UserStats } from '../types';

interface LeaderboardProps {
  userStats: UserStats;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ userStats }) => {
  const [filterDuration, setFilterDuration] = useState<number | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredEntries = INITIAL_LEADERBOARD.filter((entry) => {
    if (filterDuration !== 'all' && entry.duration !== filterDuration) return false;
    if (filterDifficulty !== 'all' && entry.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4" />
          <span>Hall of Fame</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          TypeFast Leaderboard
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          See how you stack up against the fastest typists around the globe.
        </p>

        {/* Global Multiplayer Coming Soon Banner */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-semibold">
          <Radio className="w-4 h-4 animate-pulse text-brand-500" />
          <span>Online multiplayer races & global ranks in active development!</span>
        </div>
      </div>

      {/* User's Current Standings Card */}
      <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-cyan-500/10 border border-brand-500/30 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Local Ranking
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {userStats.bestWpm > 0 ? (
                  <span>
                    Personal Best: <span className="text-brand-500 font-mono">{userStats.bestWpm} WPM</span> ({userStats.bestAccuracy.toFixed(1)}% Acc)
                  </span>
                ) : (
                  <span>No completed tests yet. Complete a test to establish your rank!</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
              {userStats.testsCompleted} Tests Completed
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-500" />
          <span>Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Duration Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-medium">
            <button
              onClick={() => setFilterDuration('all')}
              className={`btn-interactive px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterDuration === 'all'
                  ? 'bg-brand-500 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Time
            </button>
            {[15, 30, 60, 120].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDuration(d)}
                className={`btn-interactive px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterDuration === d
                    ? 'bg-brand-500 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-medium">
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`btn-interactive px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                  filterDifficulty === diff
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
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
                <th className="py-4 px-4 sm:px-6 w-16 text-center">Rank</th>
                <th className="py-4 px-4 sm:px-6">Player</th>
                <th className="py-4 px-4 sm:px-6 text-right">WPM</th>
                <th className="py-4 px-4 sm:px-6 text-right">Accuracy</th>
                <th className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center">Mode</th>
                <th className="py-4 px-4 sm:px-6 hidden md:table-cell text-right">Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No typists found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  let rankBadge: React.ReactNode = (
                    <span className="font-mono font-bold text-slate-500">{entry.rank}</span>
                  );

                  if (entry.rank === 1) {
                    rankBadge = (
                      <div className="w-7 h-7 mx-auto rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center font-bold">
                        <Crown className="w-4 h-4 fill-amber-400" />
                      </div>
                    );
                  } else if (entry.rank === 2) {
                    rankBadge = (
                      <div className="w-7 h-7 mx-auto rounded-full bg-slate-300/30 text-slate-400 flex items-center justify-center font-bold">
                        <Medal className="w-4 h-4" />
                      </div>
                    );
                  } else if (entry.rank === 3) {
                    rankBadge = (
                      <div className="w-7 h-7 mx-auto rounded-full bg-amber-700/20 text-amber-600 flex items-center justify-center font-bold">
                        <Medal className="w-4 h-4" />
                      </div>
                    );
                  }

                  return (
                    <tr
                      key={entry.rank}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6 text-center">{rankBadge}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {entry.player}
                          </span>
                          {entry.rank <= 3 && (
                            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                              <Sparkles className="w-2.5 h-2.5" />
                              PRO
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <span className="font-mono font-extrabold text-base sm:text-lg text-brand-600 dark:text-brand-400">
                          {entry.wpm}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                          {entry.accuracy.toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {entry.duration}s • {entry.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 hidden md:table-cell text-right text-xs text-slate-500 dark:text-slate-400">
                        {entry.date}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
