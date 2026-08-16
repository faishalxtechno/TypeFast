import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Play
} from 'lucide-react';
import { Page } from '../types';
import { PerformanceChart } from '../components/PerformanceChart';
import { getAnalyticsSummary } from '../services/testService';

interface AnalyticsPageProps {
  onNavigate: (page: Page) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const analytics = getAnalyticsSummary();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Deep Insights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive breakdown of your typing throughput, cadence consistency, and growth trajectory.
          </p>
        </div>

        <button
          onClick={() => onNavigate('test')}
          className="btn-interactive self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Practice Test</span>
        </button>
      </div>

      {/* 4 Analytics Hero Cards (Speed, Accuracy, Consistency, Growth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Speed Card */}
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Speed Velocity</span>
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-brand-600 dark:text-brand-400">
            {analytics.currentWpm} <span className="text-sm font-sans font-semibold text-slate-500">WPM</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Peak: <strong className="font-mono text-slate-700 dark:text-slate-200">{analytics.bestWpm} WPM</strong></span>
            <span className="text-slate-500">Avg: <strong className="font-mono text-slate-700 dark:text-slate-200">{analytics.averageWpm} WPM</strong></span>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Precision Accuracy</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400">
            {analytics.currentAccuracy.toFixed(1)}<span className="text-sm font-sans font-semibold text-slate-500">%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Peak: <strong className="font-mono text-slate-700 dark:text-slate-200">{analytics.bestAccuracy.toFixed(1)}%</strong></span>
            <span className="text-slate-500">Avg: <strong className="font-mono text-slate-700 dark:text-slate-200">{analytics.averageAccuracy.toFixed(1)}%</strong></span>
          </div>
        </div>

        {/* Consistency Card */}
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Typing Consistency</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400">
            {analytics.consistencyScore.toFixed(1)}<span className="text-sm font-sans font-semibold text-slate-500">%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Cadence: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">High Stability</strong></span>
            <span className="text-slate-500 font-mono text-[11px]">σ low variance</span>
          </div>
        </div>

        {/* Growth Card */}
        <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">30-Day Growth</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-amber-500 dark:text-amber-400">
            +{analytics.monthlyImprovementPercent.toFixed(1)}<span className="text-sm font-sans font-semibold text-slate-500">%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">7-Day: <strong className="font-mono text-emerald-600 dark:text-emerald-400">+{analytics.weeklyImprovementPercent.toFixed(1)}%</strong></span>
            <span className="text-slate-500">All: <strong className="font-mono text-brand-600 dark:text-brand-400">+{analytics.allTimeImprovementPercent.toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <PerformanceChart />

      {/* In-Depth Velocity & Metric Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              WPM Calculation Formula
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Standard 5-character normalized equation: <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-brand-600 dark:text-brand-400">(Correct Characters / 5) / Elapsed Minutes</code>. Ensures equal benchmarking regardless of word lengths.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              📈
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Consistency Index
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Measures the variance and standard deviation between keystroke velocities. A score above 90% signifies smooth rhythmic cadence without hesitation spikes.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
              🎯
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Accuracy Compounding
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Maintaining 97%+ accuracy minimizes costly backspacing penalties. Studies demonstrate that speed increases 2.4x faster when practicing with high accuracy discipline.
          </p>
        </div>
      </div>
    </div>
  );
};
