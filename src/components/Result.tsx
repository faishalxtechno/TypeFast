import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Zap, Target, AlertCircle, Clock, Award, CheckCircle2, XCircle, BarChart2 } from 'lucide-react';
import { TestResult, UserStats } from '../types';
import { getSpeedFeedback } from '../utils/typingCalculations';

interface ResultProps {
  result: TestResult;
  userStats: UserStats;
  onRestart: () => void;
}

export const Result: React.FC<ResultProps> = ({ result, userStats, onRestart }) => {
  const feedback = getSpeedFeedback(result.wpm, result.accuracy);

  useEffect(() => {
    // Fire festive celebratory confetti on achievements
    if (result.isNewBest || result.wpm >= 60) {
      try {
        confetti({
          particleCount: result.isNewBest ? 120 : 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#3b82f6']
        });
      } catch {
        // Safe fallback
      }
    }
  }, [result]);

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800/90 shadow-2xl p-6 sm:p-10 overflow-hidden relative backdrop-blur-xl">
        {/* Background decorative ambient glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          {result.isNewBest && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-500 font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 animate-pulse">
              <Trophy className="w-4 h-4" />
              <span>🎉 New Personal Best Record!</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Test Complete!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {feedback.message}
          </p>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-bold border ${feedback.badgeColor}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{feedback.tier} ({feedback.percentile})</span>
            </span>
          </div>
        </div>

        {/* Primary Hero Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mb-8 relative z-10">
          {/* WPM */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-brand-500/15 to-transparent border border-brand-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              <Zap className="w-4 h-4" />
              <span>WPM</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-brand-600 dark:text-brand-400">
              {result.wpm}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Raw: {result.rawWpm} WPM
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-cyan-500/15 to-transparent border border-cyan-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
              <Target className="w-4 h-4" />
              <span>Accuracy</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
              {result.accuracy.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Precision rate
            </span>
          </div>

          {/* Errors */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-rose-500/15 to-transparent border border-rose-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Errors</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              {result.errors}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Mistyped chars
            </span>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-purple-500/15 to-transparent border border-purple-500/35 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
              <Clock className="w-4 h-4" />
              <span>Time</span>
            </div>
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
              {result.duration}s
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 capitalize">
              {result.difficulty} mode
            </span>
          </div>
        </div>

        {/* Detailed Breakdown & Personal Stats Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
          {/* Character Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              <BarChart2 className="w-4 h-4 text-brand-500" />
              <span>Character Breakdown</span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Correct Characters
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {result.correctChars}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Incorrect Characters
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {result.incorrectChars}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 dark:text-slate-400">Total Characters Typed</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {result.totalChars}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Record Comparison */}
          <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Personal Records</span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="text-slate-600 dark:text-slate-400">All-Time Best WPM</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {userStats.bestWpm} WPM
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span className="text-slate-600 dark:text-slate-400">Best Accuracy</span>
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {userStats.bestAccuracy.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 dark:text-slate-400">Total Tests Completed</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {userStats.testsCompleted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <button
            onClick={onRestart}
            autoFocus
            className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/25 cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-500/40"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
