import React, { useState } from 'react';
import {
  Flame,
  Clock,
  SlidersHorizontal,
  Users,
  CheckCircle2,
  RotateCcw,
  Play,
  ArrowRight
} from 'lucide-react';
import { Page, UserProfile } from '../types';
import { getTodayChallenge, submitDailyChallenge } from '../services/challengeService';
import { StreakCalendar } from '../components/StreakCalendar';
import { TypingTest } from '../components/TypingTest';
import { Stats } from '../components/Stats';
import { useTypingEngine } from '../hooks/useTypingEngine';

interface DailyChallengePageProps {
  user: UserProfile | null;
  onNavigate: (page: Page) => void;
}

export const DailyChallengePage: React.FC<DailyChallengePageProps> = ({ user, onNavigate }) => {
  const challenge = getTodayChallenge();
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [challengeResult, setChallengeResult] = useState<{
    wpm: number;
    accuracy: number;
    errors: number;
    rank: number;
    topPercentile: string;
  } | null>(null);

  const engine = useTypingEngine();

  const handleStart = () => {
    setHasStarted(true);
    setChallengeResult(null);
    engine.restartTest(false);
  };

  // When test finishes while on daily challenge
  React.useEffect(() => {
    if (hasStarted && engine.status === 'completed') {
      const sub = submitDailyChallenge({
        wpm: engine.liveWpm || 65,
        accuracy: engine.liveAccuracy || 97,
        errors: engine.errorsCount,
        userId: user?.id
      });
      setChallengeResult({
        wpm: sub.result.wpm,
        accuracy: sub.result.accuracy,
        errors: sub.result.errors,
        rank: sub.result.rank || 127,
        topPercentile: sub.result.topPercentile || 'Top 10%'
      });
    }
  }, [hasStarted, engine.status, user]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-10">
      {/* Hero Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Universal Daily Benchmark</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Daily Typing Challenge
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Every day, all TypeFast typists around the world race through the exact same challenge text. Test your speed, maintain your streak, and climb the daily leaderboard!
        </p>
      </div>

      {/* Streak Calendar Banner */}
      <StreakCalendar />

      {/* Challenge Arena */}
      {!hasStarted ? (
        /* Pre-Challenge Information Card */
        <div className="p-6 sm:p-10 rounded-3xl bg-white/90 dark:bg-slate-900/80 border-2 border-brand-500/30 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Today's Official Text</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 font-mono text-base sm:text-lg text-slate-800 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed italic">
            "{challenge.promptText}"
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>{challenge.duration} Seconds</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 capitalize">
              <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
              <span>{challenge.difficulty} Difficulty</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{challenge.participantsCount.toLocaleString()} Participants</span>
            </span>
          </div>

          <div>
            <button
              onClick={handleStart}
              className="btn-interactive inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/30 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Today's Challenge</span>
            </button>
          </div>
        </div>
      ) : challengeResult ? (
        /* Completed Result Card */
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-2 border-brand-500/40 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-scale-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Challenge Complete! Streak Maintained 🔥</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Your Challenge Score
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-center">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase">Speed</span>
              <div className="text-3xl font-black font-mono text-brand-600 dark:text-brand-400 mt-1">
                {challengeResult.wpm} <span className="text-xs">WPM</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">Accuracy</span>
              <div className="text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                {challengeResult.accuracy.toFixed(1)}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Daily Rank</span>
              <div className="text-3xl font-black font-mono text-amber-500 mt-1">
                #{challengeResult.rank}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Percentile</span>
              <div className="text-3xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
                {challengeResult.topPercentile}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleStart}
              className="btn-interactive flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>

            <button
              onClick={() => onNavigate('leaderboard')}
              className="btn-interactive flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md"
            >
              <span>View Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* In-Progress Challenge Test Arena */
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
    </div>
  );
};
