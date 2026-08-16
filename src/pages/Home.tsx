import React from 'react';
import { Sparkles, ShieldCheck, Gauge, Keyboard } from 'lucide-react';
import { TestSettings } from '../components/TestSettings';
import { Stats } from '../components/Stats';
import { TypingTest } from '../components/TypingTest';
import { Result } from '../components/Result';
import { PersonalStats } from '../components/PersonalStats';
import { UseTypingEngineReturn } from '../hooks/useTypingEngine';

interface HomeProps {
  engine: UseTypingEngineReturn;
}

export const Home: React.FC<HomeProps> = ({ engine }) => {
  const {
    status,
    duration,
    difficulty,
    timeLeft,
    words,
    wordIndex,
    userInput,
    typedWords,
    liveWpm,
    liveAccuracy,
    errorsCount,
    result,
    userStats,
    setDuration,
    setDifficulty,
    handleKeyDown,
    handleInput,
    restartTest,
    refreshStats,
  } = engine;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center">
      {/* Hero Brand Title & Tagline */}
      <div className="text-center mb-6 sm:mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Minimalist Typing Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Type<span className="text-brand-500">Fast</span>
        </h1>
        <p className="mt-2 text-base sm:text-xl font-medium text-slate-600 dark:text-slate-400 tracking-tight">
          Type Faster. Type Smarter.
        </p>
      </div>

      {/* Test Controls / Settings (15s, 30s, 60s, 120s & Easy, Medium, Hard) */}
      <div className="mb-6 w-full flex justify-center">
        <TestSettings
          duration={duration}
          difficulty={difficulty}
          onDurationChange={setDuration}
          onDifficultyChange={setDifficulty}
          disabled={status === 'running'}
        />
      </div>

      {/* Conditional rendering: Results Modal or Active Test View */}
      {status === 'completed' && result ? (
        <div className="w-full">
          <Result
            result={result}
            userStats={userStats}
            onRestart={() => restartTest(true)}
          />
        </div>
      ) : (
        <div className="w-full space-y-6 animate-fade-in">
          {/* Live Stats Row: Time, WPM, Accuracy, Errors */}
          <Stats
            timeLeft={timeLeft}
            wpm={liveWpm}
            accuracy={liveAccuracy}
            errors={errorsCount}
            isTestRunning={status === 'running'}
          />

          {/* Core Interactive Typing Box */}
          <TypingTest
            status={status}
            words={words}
            wordIndex={wordIndex}
            userInput={userInput}
            typedWords={typedWords}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onRestart={() => restartTest(true)}
          />
        </div>
      )}

      {/* Personal Statistics Dashboard */}
      <PersonalStats stats={userStats} onStatsCleared={refreshStats} />

      {/* Quick Feature Highlights / Tips */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            <Gauge className="w-4 h-4 text-amber-500" />
            <span>Precise WPM Tracking</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard 5-character normalized formula with live per-keystroke velocity calculation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Multi-Tier Difficulties</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Practice everything from common 3-letter words to complex programming syntax and capitalization.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            <Keyboard className="w-4 h-4 text-cyan-500" />
            <span>Developer-First Shortcuts</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keep your hands on home row: use Esc to reset or Tab + Enter to quickly cycle new passages.
          </p>
        </div>
      </div>
    </div>
  );
};
