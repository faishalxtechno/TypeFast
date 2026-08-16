import React, { useState } from 'react';
import { Flame, Calendar, CheckCircle2, Play } from 'lucide-react';
import { Page, UserProfile } from '../types';
import { getTodayChallenge, submitDailyChallenge, getStreakInfo } from '../services/challengeService';
import { StreakCalendar } from '../components/StreakCalendar';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { TypingTest } from '../components/TypingTest';
import { Stats } from '../components/Stats';
import { PopIn } from '../components/animations/PopIn';

interface DailyChallengePageProps {
  user: UserProfile | null;
  onNavigate: (page: Page) => void;
}

export const DailyChallengePage: React.FC<DailyChallengePageProps> = ({ onNavigate }) => {
  const challenge = getTodayChallenge();
  const streak = getStreakInfo();
  const [hasStarted, setHasStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedStats, setCompletedStats] = useState<{ wpm: number; accuracy: number; percentile: number } | null>(null);

  const engine = useTypingEngine();

  const handleStart = () => {
    setHasStarted(true);
    engine.restartTest(false);
  };

  React.useEffect(() => {
    if (hasStarted && engine.status === 'completed') {
      const wpm = engine.liveWpm || 74;
      const acc = engine.liveAccuracy || 97.8;
      const percentile = wpm >= 80 ? 95 : wpm >= 60 ? 82 : 65;

      submitDailyChallenge({
        wpm,
        accuracy: acc,
        errors: engine.errorsCount
      });

      setCompleted(true);
      setCompletedStats({ wpm, accuracy: acc, percentile });
    }
  }, [hasStarted, engine.status, engine.liveWpm, engine.liveAccuracy, engine.errorsCount]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header (PopIn 0ms) */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Daily Speed Benchmark</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Today's Challenge Arena
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Every day at midnight UTC, a new universal typing passage is generated for all typists worldwide. Test your speed and keep your streak alive.
        </p>
      </PopIn>

      {/* Main Challenge Arena & Streak Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenge Box (Span 2) */}
        <PopIn delay={80} className="lg:col-span-2">
          {!hasStarted ? (
            <div className="p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-slate-900/85 border-2 border-amber-500/30 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
                  +75 XP Reward
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Standard 60-Second Universal Benchmark • Medium Difficulty
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm sm:text-base font-mono text-slate-700 dark:text-slate-300 italic line-clamp-3">
                "{challenge.promptText}"
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleStart}
                  className="btn-interactive w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-500/30 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Challenge</span>
                </button>
              </div>
            </div>
          ) : completed && completedStats ? (
            /* Completed Challenge Results Card */
            <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-2 border-emerald-500/40 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-card-pop">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Daily Challenge Completed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Your daily streak has been incremented to <strong className="text-amber-500 font-bold">{streak.currentStreak} Days</strong>.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase">Speed</div>
                  <div className="text-2xl font-black font-mono text-brand-600 dark:text-brand-400 mt-1">
                    {completedStats.wpm}
                  </div>
                  <div className="text-[10px] text-slate-500">WPM</div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase">Accuracy</div>
                  <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                    {completedStats.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-500">Precision</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase">Rank</div>
                  <div className="text-2xl font-black font-mono text-amber-500 mt-1">
                    Top {100 - completedStats.percentile}%
                  </div>
                  <div className="text-[10px] text-slate-500">Percentile</div>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-interactive px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Active Arena */
            <div className="space-y-6 animate-fade-in">
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
        </PopIn>

        {/* Streak Calendar (Span 1) */}
        <PopIn delay={140} className="space-y-6">
          <StreakCalendar onStartChallenge={handleStart} />
        </PopIn>
      </div>
    </div>
  );
};
