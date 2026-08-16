import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Trophy,
  Target,
  Award
} from 'lucide-react';
import { TypingTest } from '../components/TypingTest';
import { TestSettings } from '../components/TestSettings';
import { Stats } from '../components/Stats';
import { Result } from '../components/Result';
import { PersonalStats } from '../components/PersonalStats';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { getUserAchievements } from '../services/achievementService';
import { getStoredCertificates } from '../utils/storage';
import { Page } from '../types';

interface HomeProps {
  engine: ReturnType<typeof useTypingEngine>;
  onNavigate?: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ engine, onNavigate }) => {
  const achievements = getUserAchievements();
  const certificates = getStoredCertificates();
  const unlockedBadges = achievements.filter(a => !!a.unlockedAt);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-16">
      {/* Hero Section */}
      <section className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 animate-scale-in">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>TypeFast 4.0 Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Type <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-emerald-400 to-cyan-500">Faster</span>. Type <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-emerald-400 to-cyan-500">Smarter</span>.
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Improve your speed. Improve your accuracy. Become a better typist with real-time feedback, analytics, streaks, and verified credentials.
        </p>
      </section>

      {/* Main Typing Interactive Arena */}
      <section id="test-arena" className="w-full max-w-4xl mx-auto space-y-6 scroll-mt-20">
        {/* Duration & Difficulty Controls Bar */}
        <TestSettings
          duration={engine.duration}
          difficulty={engine.difficulty}
          soundEnabled={engine.soundEnabled}
          onDurationChange={engine.setDuration}
          onDifficultyChange={engine.setDifficulty}
          onToggleSound={() => engine.setSoundEnabled(!engine.soundEnabled)}
          disabled={engine.status === 'running'}
        />

        {/* Live Metrics Bar */}
        <Stats
          timeLeft={engine.timeLeft}
          wpm={engine.liveWpm}
          accuracy={engine.liveAccuracy}
          errors={engine.errorsCount}
          isTestRunning={engine.status === 'running'}
        />

        {/* Typing Word Matrix Display */}
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
      </section>

      {/* Result Card (shown when test completes) */}
      {engine.status === 'completed' && engine.result && (
        <section className="w-full max-w-4xl mx-auto animate-scale-in">
          <Result
            result={engine.result}
            userStats={engine.userStats}
            onRestart={() => engine.restartTest(false)}
          />
        </section>
      )}

      {/* Personal Performance Stats */}
      <section className="w-full max-w-5xl mx-auto">
        <PersonalStats
          stats={engine.userStats}
          onStatsCleared={engine.refreshStats}
        />
      </section>

      {/* Homepage Feature Previews Grid */}
      {onNavigate && (
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Daily Challenge Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 shadow-lg backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Daily Challenge</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Universal Daily Challenge & Streak
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Compete against global typists on today's universal benchmark text and build your 7-day consistency streak.
              </p>
            </div>
            <button
              onClick={() => onNavigate('daily-challenge')}
              className="btn-interactive self-start inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <span>Take Today's Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Achievements Preview Card */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Trophy className="w-4 h-4 text-purple-500" />
                <span>Achievements Progression</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Earn 13 Typing Mastery Trophies
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Unlock milestone badges from "First Step" and "Speed Typist" up to "Lightning" and "Certificate Collector".
              </p>
            </div>
            <button
              onClick={() => onNavigate('achievements')}
              className="btn-interactive self-start inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              <span>View All Achievements ({unlockedBadges.length} unlocked)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Global Leaderboard Card */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Target className="w-4 h-4 text-cyan-500" />
                <span>Global Standings</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Daily, Weekly & All-Time Rankings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Track your worldwide rank against the fastest fingers on the web with live movement indicators.
              </p>
            </div>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="btn-interactive self-start inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              <span>Explore Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Certificates Preview Card */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Official Credentials</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Generate & Export Certificates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Export A4 landscape certificates in high-resolution PNG, print vector PDF, and showcase your typing milestones.
              </p>
            </div>
            <button
              onClick={() => onNavigate('certificate')}
              className="btn-interactive self-start inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline cursor-pointer"
            >
              <span>My Certificates ({certificates.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
