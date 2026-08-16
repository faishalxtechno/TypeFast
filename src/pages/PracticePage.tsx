import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';
import { Page, PracticeMode } from '../types';
import { generatePracticeText } from '../features/personalizedPractice/practiceGenerator';
import { awardXp } from '../services/xpService';
import { getAnalyticsSummary } from '../services/testService';
import { Stats } from '../components/Stats';
import { TypingTest } from '../components/TypingTest';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { PopIn } from '../components/animations/PopIn';

interface PracticePageProps {
  onNavigate: (page: Page) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<PracticeMode>('weak-keys');
  const [practiceSession, setPracticeSession] = useState<{
    text: string;
    targetKeys: string[];
  }>(() => generatePracticeText('weak-keys'));

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [completedResult, setCompletedResult] = useState<{
    beforeWpm: number;
    beforeAcc: number;
    afterWpm: number;
    afterAcc: number;
    wpmDelta: number;
    accDelta: number;
    xpEarned: number;
  } | null>(null);

  const engine = useTypingEngine();
  const analytics = getAnalyticsSummary();

  const handleModeChange = (newMode: PracticeMode) => {
    setMode(newMode);
    setHasStarted(false);
    setCompletedResult(null);
    const newSession = generatePracticeText(newMode);
    setPracticeSession(newSession);
    engine.restartTest(false);
  };

  const handleStartPractice = () => {
    setHasStarted(true);
    setCompletedResult(null);
    engine.restartTest(false);
  };

  // Handle completion
  useEffect(() => {
    if (hasStarted && engine.status === 'completed') {
      const beforeWpm = analytics.averageWpm || 65;
      const beforeAcc = analytics.averageAccuracy || 94.2;
      const afterWpm = engine.liveWpm || 72;
      const afterAcc = engine.liveAccuracy || 96.5;

      const wpmDelta = Math.round((afterWpm - beforeWpm) * 10) / 10;
      const accDelta = Math.round((afterAcc - beforeAcc) * 10) / 10;

      const xpEarned = 60;
      awardXp(xpEarned);

      setCompletedResult({
        beforeWpm,
        beforeAcc,
        afterWpm,
        afterAcc,
        wpmDelta,
        accDelta,
        xpEarned
      });
    }
  }, [hasStarted, engine.status]);

  const modesList: { id: PracticeMode; label: string; desc: string }[] = [
    { id: 'weak-keys', label: 'Weak Keys', desc: 'Target your most difficult keys' },
    { id: 'combinations', label: 'Combinations', desc: 'Drill transitional digraphs' },
    { id: 'accuracy', label: 'Accuracy', desc: 'Slow down & train 98%+ precision' },
    { id: 'speed', label: 'Speed Sprint', desc: 'Push top rhythmic velocity' },
    { id: 'endurance', label: 'Endurance', desc: 'Sustained typing paragraph' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header (PopIn 0ms) */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Targeted Conditioning</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personalized Practice Arena
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Custom drills automatically generated from your weakest keystrokes, transitions, and error patterns.
        </p>
      </PopIn>

      {/* Mode Selection Pills (PopIn 60ms) */}
      <PopIn delay={60} className="flex flex-wrap items-center justify-center gap-2.5 p-2 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-sm max-w-2xl mx-auto">
        {modesList.map(m => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`btn-interactive px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === m.id
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </PopIn>

      {/* Target Focus Keys Banner (PopIn 100ms) */}
      <PopIn delay={100} className="flex items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span>Target Focus Areas:</span>
        <div className="flex items-center gap-1.5">
          {practiceSession.targetKeys.map(k => (
            <span
              key={k}
              className="px-2 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold border border-brand-500/20"
            >
              {k}
            </span>
          ))}
        </div>
      </PopIn>

      {/* Practice View States */}
      {!hasStarted ? (
        <PopIn delay={140} className="p-8 sm:p-12 rounded-3xl bg-white/90 dark:bg-slate-900/85 border-2 border-brand-500/30 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Preview Drill Passage
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 font-mono text-base sm:text-lg text-slate-800 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed italic">
            "{practiceSession.text}"
          </div>

          <button
            onClick={handleStartPractice}
            className="btn-interactive inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/30 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Begin Targeted Drill</span>
          </button>
        </PopIn>
      ) : completedResult ? (
        /* Practice Completed Comparison Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-2 border-emerald-500/40 shadow-2xl backdrop-blur-xl text-center space-y-8 animate-card-pop">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Practice Complete! Muscle Memory Conditioned</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Performance Progression
          </h2>

          {/* Before vs After Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* Speed Comparison */}
            <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-center space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Speed Velocity</span>
              <div className="font-mono text-2xl font-black text-brand-600 dark:text-brand-400">
                {completedResult.afterWpm} WPM
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {completedResult.wpmDelta >= 0 ? `+${completedResult.wpmDelta}` : completedResult.wpmDelta} WPM vs Baseline
              </div>
            </div>

            {/* Accuracy Comparison */}
            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Precision Accuracy</span>
              <div className="font-mono text-2xl font-black text-cyan-600 dark:text-cyan-400">
                {completedResult.afterAcc.toFixed(1)}%
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {completedResult.accDelta >= 0 ? `+${completedResult.accDelta.toFixed(1)}%` : `${completedResult.accDelta.toFixed(1)}%`} vs Baseline
              </div>
            </div>

            {/* XP Awarded */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">XP Awarded</span>
              <div className="font-mono text-2xl font-black text-amber-500">
                +{completedResult.xpEarned} XP
              </div>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Level Progress
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleModeChange(mode)}
              className="btn-interactive flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-interactive flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        /* In-Progress Practice Arena */
        <div className="space-y-6">
          <Stats
            timeLeft={engine.timeLeft}
            wpm={engine.liveWpm}
            accuracy={engine.liveAccuracy}
            errors={engine.errorsCount}
            isTestRunning={engine.status === 'running'}
          />

          <TypingTest
            status={engine.status}
            words={engine.words}
            wordIndex={engine.wordIndex}
            userInput={engine.userInput}
            typedWords={engine.typedWords}
            onKeyDown={engine.handleKeyDown}
            onInput={engine.handleInput}
            onRestart={() => engine.restartTest(false)}
          />
        </div>
      )}
    </div>
  );
};
