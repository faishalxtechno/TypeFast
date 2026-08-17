import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Trophy,
  Target,
  Award,
  Volume2,
  VolumeX,
  Palette,
  Keyboard as KeyboardIcon,
  Sliders
} from 'lucide-react';
import { TypingTest } from '../components/TypingTest';
import { TestSettings } from '../components/TestSettings';
import { Stats } from '../components/Stats';
import { Result } from '../components/Result';
import { PersonalStats } from '../components/PersonalStats';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { getUserAchievements } from '../services/achievementService';
import { getStoredCertificates } from '../utils/storage';
import { Page } from '../types';
import { PopIn } from '../components/animations/PopIn';
import { AnimatedSection } from '../components/animations/AnimatedSection';
import { useSettings } from '../context/SettingsContext';

interface HomeProps {
  engine: ReturnType<typeof useTypingEngine>;
  onNavigate?: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ engine, onNavigate }) => {
  const { settings, openSettings } = useSettings();
  const achievements = getUserAchievements();
  const certificates = getStoredCertificates();
  const unlockedBadges = achievements.filter(a => !!a.unlockedAt);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>TypeFast v2.0 Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Type <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-emerald-400 to-cyan-500">Faster</span>. Type <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-emerald-400 to-cyan-500">Smarter</span>.
        </h1>

        <p className="mt-4 text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Improve your speed and precision with real-time audio synthesizer feedback, virtual keyboard visualization, dynamic theme styles, and verified certificates.
        </p>
      </PopIn>

      {/* Main Typing Interactive Arena */}
      <PopIn delay={80} className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 scroll-mt-20" id="test-arena">
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

        {/* Typing Word Matrix Display with Custom Animated Caret */}
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

        {/* On-Screen Virtual Keyboard Visualization (if enabled in settings) */}
        {settings.keyboardEnabled && (
          <div className="animate-card-pop pt-1">
            <VirtualKeyboard
              lastKeystroke={engine.lastKeystroke}
              onKeyPress={(k) => engine.handleInput(engine.userInput + k)}
            />
          </div>
        )}

        {/* Live Status & Quick Settings Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <button
              onClick={openSettings}
              className="btn-interactive flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-brand-500" />
              <span>Theme: <strong className="text-slate-800 dark:text-slate-200 capitalize">{settings.selectedTheme}</strong></span>
            </button>

            <button
              onClick={() => engine.setSoundEnabled(!engine.soundEnabled)}
              className="btn-interactive flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              {engine.soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sound: <strong className="text-emerald-600 dark:text-emerald-400">ON ({Math.round(settings.soundVolume * 100)}%)</strong></span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sound: <strong className="text-slate-400">OFF</strong></span>
                </>
              )}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1">
              <KeyboardIcon className="w-3.5 h-3.5 text-cyan-500" />
              <span>Caret: <strong className="text-slate-800 dark:text-slate-200 capitalize">{settings.caretStyle}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSettings}
              className="btn-interactive flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Preferences</span>
            </button>
          </div>
        </div>
      </PopIn>

      {/* Result Card (shown when test completes) */}
      {engine.status === 'completed' && engine.result && (
        <section className="w-full max-w-4xl mx-auto">
          <Result
            result={engine.result}
            userStats={engine.userStats}
            onRestart={() => engine.restartTest(false)}
            onNavigate={onNavigate}
          />
        </section>
      )}

      {/* Personal Performance Stats */}
      <AnimatedSection className="w-full max-w-5xl mx-auto">
        <PersonalStats
          stats={engine.userStats}
          onStatsCleared={engine.refreshStats}
        />
      </AnimatedSection>

      {/* Homepage Feature Previews Grid */}
      {onNavigate && (
        <AnimatedSection className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
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
        </AnimatedSection>
      )}
    </div>
  );
};
