import React from 'react';
import { Sparkles, ShieldCheck, Gauge, Keyboard, Volume2, Database } from 'lucide-react';
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
    soundEnabled,
    result,
    userStats,
    setDuration,
    setDifficulty,
    setSoundEnabled,
    handleKeyDown,
    handleInput,
    restartTest,
    refreshStats,
  } = engine;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center">
      {/* Hero Section */}
      <section id="test" className="text-center mb-6 sm:mb-8 animate-fade-in scroll-mt-24">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Typing Experience</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Type<span className="text-brand-500">Fast</span>
        </h1>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-brand-600 dark:text-brand-400 tracking-tight">
          Type Faster. Type Smarter.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-medium">
          Improve your typing speed, accuracy, and consistency.
        </p>
      </section>

      {/* Test Controls / Settings (15s, 30s, 60s, 120s & Easy, Medium, Hard & Sound Toggle) */}
      <div className="mb-6 w-full flex justify-center animate-fade-in">
        <TestSettings
          duration={duration}
          difficulty={difficulty}
          soundEnabled={soundEnabled}
          onDurationChange={setDuration}
          onDifficultyChange={setDifficulty}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          disabled={status === 'running'}
        />
      </div>

      {/* Primary Focus: Typing Test Arena or Results Modal */}
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

      {/* Features Section */}
      <section id="features" className="w-full max-w-4xl mt-16 scroll-mt-20">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Engineered for Precision & Speed
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Built with zero fluff to provide an ultra-responsive typing workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-brand-500/40">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Gauge className="w-4 h-4" />
              </div>
              <span>Live WPM & Accuracy</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standardized 5-character normalized algorithm with live speed tracking and error rate detection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-brand-500/40">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Volume2 className="w-4 h-4" />
              </div>
              <span>Tactile Audio Synth</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero-latency synthesized mechanical key clicks, subtle error cues, and victory chimes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-brand-500/40">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Keyboard className="w-4 h-4" />
              </div>
              <span>Home-Row Shortcuts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Keep hands in home position: use <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] border border-slate-300 dark:border-slate-700">Esc</kbd> to restart anytime.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-brand-500/40">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>3 Difficulty Modes</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              From high-frequency common words to programming keywords, punctuation, and camelCase.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-brand-500/40">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
              <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500">
                <Database className="w-4 h-4" />
              </div>
              <span>Private Local Storage</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your test history and personal records stay safely on your device with instant persistence.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-brand-500/40">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Theme & Sound Toggles</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Easily toggle between sleek Dark mode and clean Light mode, with independent sound controls.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
