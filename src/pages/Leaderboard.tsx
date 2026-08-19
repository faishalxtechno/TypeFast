import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
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
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'allTime', label: 'All Time' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Header */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAFAFA] text-xs font-semibold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5 text-white" />
          <span>Global Standings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal text-[#FAFAFA] tracking-tight">
          TypeFast Hall of Fame
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#A7A6A6] max-w-xl mx-auto leading-relaxed">
          The fastest typists across the globe. Compete, refine your precision, and claim your place at the top.
        </p>
      </PopIn>

      {/* Timeframe Filter Pills */}
      <PopIn delay={60} className="flex items-center justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f]">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                timeframe === tf.id
                  ? 'bg-white text-black shadow-xs'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </PopIn>

      {/* User Placement Banner (if applicable) */}
      {userRank && (
        <PopIn delay={100} className="p-4 sm:p-5 rounded-2xl bg-[#0c0c0c] border border-[#262626] shadow-subtle-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-mono font-bold">
              #{userRank.rank}
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base text-[#FAFAFA]">
                Your Current Standing
              </div>
              <div className="text-xs text-[#666666]">
                Personal best recorded in this timeframe
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-[#FAFAFA]">
              {userRank.wpm}
            </span>
            <span className="text-xs font-semibold text-[#888888] ml-1">WPM</span>
          </div>
        </PopIn>
      )}

      {/* Leaderboard Table */}
      <PopIn delay={140} className="overflow-hidden rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-subtle-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d] text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
                <th className="py-3.5 px-4 sm:px-6">Rank</th>
                <th className="py-3.5 px-4 sm:px-6">Typist</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Speed</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Accuracy</th>
                <th className="py-3.5 px-4 sm:px-6 text-right hidden sm:table-cell">Mode</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {entries.map((entry, idx) => (
                <tr
                  key={`${entry.rank}-${entry.player}`}
                  style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                  className="hover:bg-white/[0.02] transition-colors animate-card-pop"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      {entry.rank === 1 && (
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                      {entry.rank === 2 && (
                        <Medal className="w-4 h-4 text-slate-300" />
                      )}
                      {entry.rank === 3 && (
                        <Medal className="w-4 h-4 text-amber-600" />
                      )}
                      <span className="font-mono font-bold text-[#A7A6A6]">
                        #{String(entry.rank).padStart(2, '0')}
                      </span>
                    </div>
                  </td>

                  {/* Typist Profile */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#242424] text-white flex items-center justify-center font-bold text-xs">
                        {entry.player.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                          <span>{entry.player}</span>
                          {entry.rank === 1 && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-white text-black font-bold">
                              #1
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#666666]">
                          @{entry.username || entry.player.toLowerCase().replace(/\s+/g, '')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Speed */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-bold text-[#FAFAFA]">
                    {entry.wpm} <span className="text-[10px] text-[#666666]">WPM</span>
                  </td>

                  {/* Accuracy */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-[#A7A6A6]">
                    {entry.accuracy.toFixed(1)}%
                  </td>

                  {/* Mode */}
                  <td className="py-3.5 px-4 sm:px-6 text-right hidden sm:table-cell">
                    <span className="px-2 py-1 rounded-md bg-[#121212] text-xs font-mono text-[#888888] capitalize">
                      {entry.duration}s • {entry.difficulty}
                    </span>
                  </td>

                  {/* Trend */}
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    {entry.movement === 'up' && (
                      <span className="inline-flex items-center text-emerald-400 text-xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {entry.movement === 'down' && (
                      <span className="inline-flex items-center text-rose-400 text-xs">
                        <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                      </span>
                    )}
                    {(!entry.movement || entry.movement === 'same') && (
                      <span className="inline-flex items-center text-[#555555] text-xs">
                        <Minus className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PopIn>
    </div>
  );
};
