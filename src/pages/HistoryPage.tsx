import React, { useState } from 'react';
import {
  History as HistoryIcon,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { Page, TestDuration, Difficulty } from '../types';
import { getFilteredHistory } from '../services/testService';

interface HistoryPageProps {
  onNavigate: (page: Page) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [duration, setDuration] = useState<TestDuration | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestWpm' | 'highestAccuracy'>('newest');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  const { items, total, totalPages } = getFilteredHistory({
    duration,
    difficulty,
    sortBy,
    search,
    page,
    pageSize
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Practice Records</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Typing Test History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Complete log of all your speed test practice runs and accuracy records ({total} sessions)
          </p>
        </div>

        <button
          onClick={() => onNavigate('test')}
          className="btn-interactive self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>New Typing Test</span>
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by WPM, difficulty, or date..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Duration Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
            <button
              onClick={() => { setDuration('all'); setPage(1); }}
              className={`btn-interactive px-2.5 py-1 rounded-lg transition-all ${duration === 'all' ? 'bg-brand-500 text-white' : 'text-slate-500'}`}
            >
              All Time
            </button>
            {([15, 30, 60, 120] as const).map(d => (
              <button
                key={d}
                onClick={() => { setDuration(d); setPage(1); }}
                className={`btn-interactive px-2.5 py-1 rounded-lg transition-all ${duration === d ? 'bg-brand-500 text-white' : 'text-slate-500'}`}
              >
                {d}s
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
            {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => { setDifficulty(diff); setPage(1); }}
                className={`btn-interactive px-2.5 py-1 rounded-lg capitalize transition-all ${difficulty === diff ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold' : 'text-slate-500'}`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="bg-transparent border-0 outline-none text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highestWpm">Highest WPM</option>
              <option value="highestAccuracy">Highest Accuracy</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Records Table */}
      <div className="overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-4 sm:px-6">Timestamp & Date</th>
                <th className="py-4 px-4 sm:px-6 text-right">Net WPM</th>
                <th className="py-4 px-4 sm:px-6 text-right">Raw WPM</th>
                <th className="py-4 px-4 sm:px-6 text-right">Accuracy</th>
                <th className="py-4 px-4 sm:px-6 text-right">Errors</th>
                <th className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center">Characters</th>
                <th className="py-4 px-4 sm:px-6 text-center">Test Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No tests match your selected filter criteria.
                  </td>
                </tr>
              ) : (
                items.map((test, i) => (
                  <tr key={test.id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-medium text-xs text-slate-700 dark:text-slate-300">
                      {new Date(test.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className="font-mono font-black text-base text-brand-600 dark:text-brand-400">
                        {test.wpm}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right font-mono text-xs text-slate-500">
                      {test.rawWpm}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {test.accuracy.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className={`font-mono font-semibold ${test.errors > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                        {test.errors}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 hidden sm:table-cell text-center font-mono text-xs text-slate-500">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{test.correctChars}</span> / <span className="text-rose-500">{test.incorrectChars}</span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {test.duration}s • {test.difficulty}
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
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing Page <strong className="text-slate-900 dark:text-white font-mono">{page}</strong> of <strong className="text-slate-900 dark:text-white font-mono">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="btn-interactive p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="btn-interactive p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
