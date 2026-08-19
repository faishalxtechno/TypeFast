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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAFAFA] text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Targeted Conditioning</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal text-[#FAFAFA] tracking-tight">
          Personalized Practice
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#A7A6A6] max-w-xl mx-auto leading-relaxed">
          Custom drills automatically generated from your weakest keystrokes, transitions, and error patterns.
        </p>
      </PopIn>

      {/* Mode Selection Pills */}
      <PopIn delay={60} className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#0c0c0c] border border-[#1f1f1f] max-w-2xl mx-auto">
        {modesList.map(m => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === m.id
                ? 'bg-white text-black shadow-xs'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </PopIn>

      {/* Target Focus Keys Banner */}
      <PopIn delay={100} className="flex items-center justify-center gap-3 text-xs font-semibold text-[#A7A6A6]">
        <span>Focus Keys:</span>
        <div className="flex items-center gap-1.5">
          {practiceSession.targetKeys.map(k => (
            <span
              key={k}
              className="px-2 py-0.5 rounded-md bg-[#141414] text-[#FAFAFA] font-mono font-bold border border-[#262626]"
            >
              {k}
            </span>
          ))}
        </div>
      </PopIn>

      {/* Practice View States */}
      {!hasStarted ? (
        <PopIn delay={140} className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-subtle-card text-center space-y-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
            Preview Drill Passage
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] font-mono text-base sm:text-lg text-[#FAFAFA] max-w-2xl mx-auto leading-relaxed italic">
            "{practiceSession.text}"
          </div>

          <button
            onClick={handleStartPractice}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FAFAFA] hover:bg-white text-[#050505] font-semibold text-sm transition-all duration-200 hover:scale-[1.02] shadow-white-pill cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Begin Targeted Drill</span>
          </button>
        </PopIn>
      ) : completedResult ? (
        /* Practice Completed Comparison Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-subtle-card text-center space-y-8 animate-card-pop">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Practice Complete • Muscle Memory Conditioned</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-normal text-[#FAFAFA]">
            Performance Progression
          </h2>

          {/* Before vs After Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* Speed Comparison */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-[#222222] text-center space-y-1">
              <span className="text-[11px] font-semibold text-[#888888] uppercase">Speed Velocity</span>
              <div className="font-mono text-2xl font-bold text-[#FAFAFA]">
                {completedResult.afterWpm} WPM
              </div>
              <div className="text-xs font-semibold text-white">
                {completedResult.wpmDelta >= 0 ? `+${completedResult.wpmDelta}` : completedResult.wpmDelta} WPM vs Baseline
              </div>
            </div>

            {/* Accuracy Comparison */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-[#222222] text-center space-y-1">
              <span className="text-[11px] font-semibold text-[#888888] uppercase">Accuracy</span>
              <div className="font-mono text-2xl font-bold text-[#FAFAFA]">
                {completedResult.afterAcc.toFixed(1)}%
              </div>
              <div className="text-xs font-semibold text-white">
                {completedResult.accDelta >= 0 ? `+${completedResult.accDelta.toFixed(1)}%` : `${completedResult.accDelta.toFixed(1)}%`} vs Baseline
              </div>
            </div>

            {/* XP Awarded */}
            <div className="p-5 rounded-2xl bg-[#111111] border border-[#222222] text-center space-y-1">
              <span className="text-[11px] font-semibold text-[#888888] uppercase">XP Awarded</span>
              <div className="font-mono text-2xl font-bold text-white">
                +{completedResult.xpEarned} XP
              </div>
              <div className="text-xs text-[#888888]">
                Level Progress
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#1a1a1a]">
            <button
              onClick={() => handleModeChange(mode)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAFAFA] hover:bg-white text-black font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-[#FAFAFA] border border-[#262626] font-semibold text-xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
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
