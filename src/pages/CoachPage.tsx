import React from 'react';
import {
  Sparkles,
  Zap,
  Target,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Play
} from 'lucide-react';
import { Page } from '../types';
import { generateAICoachAnalysis } from '../services/aiCoachService';
import { getAnalyticsSummary } from '../services/testService';
import { getWeakestKeys } from '../services/weakKeyService';
import { PopIn } from '../components/animations/PopIn';
import { StaggerItem } from '../components/animations/StaggerItem';

interface CoachPageProps {
  onNavigate: (page: Page) => void;
}

export const CoachPage: React.FC<CoachPageProps> = ({ onNavigate }) => {
  const analysis = generateAICoachAnalysis();
  const analytics = getAnalyticsSummary();
  const weakestKeys = getWeakestKeys(6);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* 1. Header (PopIn 0ms) */}
      <PopIn delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>AI Typing Diagnostics</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your AI Typing Coach
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Data-driven biomechanical analysis of your keystroke cadence, error hotspots, and personalized practice drills.
            </p>
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="btn-interactive self-start sm:self-center flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/25 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Personalized Practice</span>
          </button>
        </div>
      </PopIn>

      {/* 2. Main AI Coach Diagnostic Card (PopIn 60ms) */}
      <PopIn delay={60}>
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-500/15 via-emerald-500/10 to-cyan-500/15 border-2 border-brand-500/30 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-brand-500/20">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Current Benchmark Assessment
              </span>
              <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 font-mono">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{analytics.currentWpm}</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">WPM</span>
                </div>
                <div className="text-slate-300 dark:text-slate-700">•</div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">{analytics.currentAccuracy.toFixed(1)}%</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">Accuracy</span>
                </div>
                <div className="text-slate-300 dark:text-slate-700">•</div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">{analytics.consistencyScore.toFixed(0)}%</span>
                  <span className="text-xs font-bold text-slate-500 ml-1">Consistency</span>
                </div>
              </div>
            </div>

            {/* Difficult Keys Badges */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Identified Weak Keys
              </span>
              <div className="flex items-center gap-2">
                {analysis.weakKeys.map(k => (
                  <div
                    key={k}
                    className="w-10 h-10 rounded-xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-600 dark:text-rose-400 font-mono font-black text-base flex items-center justify-center shadow-xs"
                  >
                    {k}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnosis & Actionable Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Primary Weakness</span>
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {analysis.mainWeakness}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-brand-500/40 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Recommendation</span>
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {analysis.recommendation}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate('practice')}
              className="btn-interactive inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md"
            >
              <span>Launch Recommended Drill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </PopIn>

      {/* 3. 5 AI Insights Cards with Stagger */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Speed Insight */}
        <StaggerItem index={0} baseDelay={50} className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Speed Velocity</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {analysis.speedAnalysis}
          </p>
        </StaggerItem>

        {/* Accuracy Insight */}
        <StaggerItem index={1} baseDelay={50} className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Accuracy Discipline</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {analysis.accuracyAnalysis}
          </p>
        </StaggerItem>

        {/* Consistency Insight */}
        <StaggerItem index={2} baseDelay={50} className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Cadence Consistency</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {analysis.consistencyAnalysis}
          </p>
        </StaggerItem>

        {/* Weak Combinations Insight */}
        <StaggerItem index={3} baseDelay={50} className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Key Combinations</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Frequent mistake digraphs: <strong className="font-mono text-rose-600 dark:text-rose-400">{analysis.weakCombinations.join(', ')}</strong>. Practice transitional finger flow.
          </p>
        </StaggerItem>

        {/* Progress Insight */}
        <StaggerItem index={4} baseDelay={50} className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 md:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Improvement Velocity</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {analysis.progressAnalysis} Regular daily practice is elevating your neuromuscular response time.
          </p>
        </StaggerItem>
      </div>

      {/* 4. Weak Keys Drill Breakdown Table (PopIn 260ms) */}
      <PopIn delay={260} className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Weak-Key Accuracy Telemetry
          </h3>
          <button
            onClick={() => onNavigate('keyboard')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Explore Full Heatmap
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {weakestKeys.map(k => (
            <div
              key={k.key}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 font-mono font-black text-lg flex items-center justify-center border border-rose-500/30">
                  {k.key}
                </div>
                <div>
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {k.accuracy.toFixed(1)}% Acc
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {k.incorrect} errors in {k.attempts} presses
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('practice')}
                className="btn-interactive px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Drill
              </button>
            </div>
          ))}
        </div>
      </PopIn>
    </div>
  );
};
