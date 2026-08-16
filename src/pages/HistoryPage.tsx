import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TestDuration, Difficulty } from '../types';
import { getFilteredHistory } from '../services/testService';
import { PopIn } from '../components/animations/PopIn';

export const HistoryPage: React.FC = () => {
  const [duration, setDuration] = useState<TestDuration | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestWpm' | 'highestAccuracy'>('newest');
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const { items, totalPages, total } = getFilteredHistory({
    duration,
    difficulty,
    search,
    sortBy,
    page,
    pageSize
  });

  const handleSort = (field: 'date' | 'wpm' | 'accuracy') => {
    if (field === 'date') {
      setSortBy(sortBy === 'newest' ? 'oldest' : 'newest');
    } else if (field === 'wpm') {
      setSortBy('highestWpm');
    } else {
      setSortBy('highestAccuracy');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header (PopIn 0ms) */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <HistoryIcon className="w-4 h-4 text-brand-500" />
          <span>Full Performance Log</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Typing Test History
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Comprehensive historical archive of all your typing sessions, metrics, accuracy distributions, and progression logs.
        </p>
      </PopIn>

      {/* Filter & Search Bar (PopIn 60ms) */}
      <PopIn delay={60} className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by keywords or date..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Duration Filter */}
          <select
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value === 'all' ? 'all' : (Number(e.target.value) as TestDuration));
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Durations</option>
            <option value="15">15 Seconds</option>
            <option value="30">30 Seconds</option>
            <option value="60">60 Seconds</option>
            <option value="120">120 Seconds</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as Difficulty | 'all');
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy Tier</option>
            <option value="medium">Medium Tier</option>
            <option value="hard">Hard Tier</option>
          </select>
        </div>
      </PopIn>

      {/* History Table (PopIn 120ms) */}
      <PopIn delay={120} className="overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th
                  onClick={() => handleSort('date')}
                  className="py-4 px-6 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date & Time</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('wpm')}
                  className="py-4 px-6 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Speed (WPM)</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('accuracy')}
                  className="py-4 px-6 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Accuracy</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-6 text-right">Errors</th>
                <th className="py-4 px-6 text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-sans text-sm">
                    No matching test results found in history.
                  </td>
                </tr>
              ) : (
                items.map((r, idx) => (
                  <tr
                    key={r.id || idx}
                    style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                    className="animate-card-pop hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 font-medium font-sans">
                      {new Date(r.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-base text-brand-600 dark:text-brand-400">
                      {r.wpm}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-cyan-600 dark:text-cyan-400">
                      {r.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-4 px-6 text-right text-rose-500 font-semibold">
                      {r.errors}
                    </td>
                    <td className="py-4 px-6 text-center font-sans">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold capitalize text-slate-600 dark:text-slate-300">
                        {r.duration}s • {r.difficulty}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing page <strong className="text-slate-800 dark:text-white">{page}</strong> of <strong className="text-slate-800 dark:text-white">{totalPages}</strong> ({total} total tests)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-interactive p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-interactive p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </PopIn>
    </div>
  );
};
