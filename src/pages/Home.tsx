import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
  RotateCcw,
  Sliders,
  Palette,
  Volume2,
  VolumeX,
  Keyboard as KeyboardIcon,
  Crown,
  Medal,
  Minus
} from 'lucide-react';
import { TypingTest } from '../components/TypingTest';
import { TestSettings } from '../components/TestSettings';
import { Stats } from '../components/Stats';
import { Result } from '../components/Result';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { Page, TestDuration } from '../types';
import { useSettings } from '../context/SettingsContext';
import { getLeaderboardEntries, LeaderboardTimeframe } from '../services/leaderboardService';

interface HomeProps {
  engine: ReturnType<typeof useTypingEngine>;
  onNavigate?: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ engine, onNavigate }) => {
  const { settings, openSettings } = useSettings();
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<LeaderboardTimeframe>('allTime');

  const { entries } = getLeaderboardEntries({ timeframe: leaderboardTimeframe });

  const scrollToArena = () => {
    const arena = document.getElementById('test-arena');
    if (arena) {
      arena.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = arena.querySelector('input');
      if (input) input.focus();
    }
  };

  const handleSelectDuration = (d: TestDuration) => {
    engine.setDuration(d);
    scrollToArena();
  };

  return (
    <div className="w-full bg-[#050505] text-[#FAFAFA] selection:bg-white/20 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (Full-Screen Cinematic Keyboard Composition)  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden select-none">
        {/* Full-Bleed Cinematic Visual Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/images/hero-keyboard.jpg"
            alt="Cinematic Mechanical Keyboard"
            className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle Vignettes & Gradient Fades into #050505 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_95%)]" />
        </div>

        {/* Hero Content (Left-Aligned Cinematic Typography) */}
        <div className="relative z-10 max-w-6xl mx-auto w-full pt-8 pb-16">
          <div className="max-w-2xl text-left space-y-6 animate-reveal">
            {/* Main Headline */}
            <h1 className="font-sans font-normal text-5xl sm:text-6xl lg:text-7xl tracking-[-0.03em] text-[#FAFAFA] leading-[1.08]">
              Type Faster.<br />
              Think Faster.
            </h1>

            {/* Supporting Text */}
            <p className="font-sans font-normal text-base sm:text-lg text-[#A7A6A6] leading-relaxed max-w-xl">
              Improve your typing speed, accuracy, and consistency with focused practice built for modern users.
            </p>

            {/* Hero CTA Area */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              {/* Primary CTA: Large Rounded White Pill */}
              <button
                onClick={scrollToArena}
                className="px-7 py-3.5 rounded-full bg-[#FAFAFA] hover:bg-white text-[#050505] text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-white-pill cursor-pointer"
              >
                Start Typing
              </button>

              {/* Secondary CTA: Transparent White Text */}
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('leaderboard');
                  else {
                    const el = document.getElementById('leaderboard-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-3.5 text-sm sm:text-base font-semibold text-[#FAFAFA] hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer"
              >
                <span>View Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. TYPING PERFORMANCE PREVIEW & INTERACTIVE ARENA              */}
      {/* ------------------------------------------------------------- */}
      <section
        id="test-arena"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-6 scroll-mt-24"
      >
        {/* Duration & Difficulty Settings Bar */}
        <TestSettings
          duration={engine.duration}
          difficulty={engine.difficulty}
          soundEnabled={engine.soundEnabled}
          onDurationChange={engine.setDuration}
          onDifficultyChange={engine.setDifficulty}
          onToggleSound={() => engine.setSoundEnabled(!engine.soundEnabled)}
          disabled={engine.status === 'running'}
        />

        {/* Live Metrics with Minimal Separators */}
        <Stats
          timeLeft={engine.timeLeft}
          wpm={engine.liveWpm}
          accuracy={engine.liveAccuracy}
          errors={engine.errorsCount}
          isTestRunning={engine.status === 'running'}
        />

        {/* Interactive Typing Test Arena with Real Caret Motion */}
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

        {/* Optional Virtual Keyboard visualization */}
        {settings.keyboardEnabled && (
          <div className="pt-2 animate-card-pop">
            <VirtualKeyboard
              lastKeystroke={engine.lastKeystroke}
              onKeyPress={(k) => engine.handleInput(engine.userInput + k)}
            />
          </div>
        )}

        {/* Live Status & Quick Preferences */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 text-xs text-[#888888]">
          <div className="flex items-center gap-4">
            <button
              onClick={openSettings}
              className="flex items-center gap-1.5 hover:text-[#FAFAFA] transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#A7A6A6]" />
              <span>Theme: <strong className="text-[#FAFAFA] capitalize">{settings.selectedTheme}</strong></span>
            </button>

            <button
              onClick={() => engine.setSoundEnabled(!engine.soundEnabled)}
              className="flex items-center gap-1.5 hover:text-[#FAFAFA] transition-colors cursor-pointer"
            >
              {engine.soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audio: <strong className="text-[#FAFAFA]">ON</strong></span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#666666]" />
                  <span>Audio: <strong className="text-[#666666]">OFF</strong></span>
                </>
              )}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1">
              <KeyboardIcon className="w-3.5 h-3.5 text-[#A7A6A6]" />
              <span>Caret: <strong className="text-[#FAFAFA] capitalize">{settings.caretStyle}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSettings}
              className="flex items-center gap-1 text-[#A7A6A6] hover:text-[#FAFAFA] transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Preferences</span>
            </button>
          </div>
        </div>

        {/* Result Card when test completes */}
        {engine.status === 'completed' && engine.result && (
          <div className="pt-6">
            <Result
              result={engine.result}
              userStats={engine.userStats}
              onRestart={() => engine.restartTest(false)}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURES (Everything you need to type better)              */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-[#141414]">
        <div className="text-left max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A7A6A6] mb-2">Platform Capabilities</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FAFAFA] tracking-tight">
            Everything you need to type better.
          </h2>
        </div>

        {/* Clean Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {/* 1. Speed Tests */}
          <div className="space-y-2.5 p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white mb-4">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Speed Tests
            </h3>
            <p className="text-sm text-[#A7A6A6] leading-relaxed">
              Measure your typing speed in real time with high-precision keystroke evaluation and instant WPM analytics.
            </p>
          </div>

          {/* 2. Accuracy Tracking */}
          <div className="space-y-2.5 p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white mb-4">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Accuracy Tracking
            </h3>
            <p className="text-sm text-[#A7A6A6] leading-relaxed">
              Understand mistakes, isolate hesitation patterns, and build muscle memory for flawless precision.
            </p>
          </div>

          {/* 3. Practice Mode */}
          <div className="space-y-2.5 p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white mb-4">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Practice Mode
            </h3>
            <p className="text-sm text-[#A7A6A6] leading-relaxed">
              Practice without pressure and build consistency with targeted drills and personalized vocabulary passages.
            </p>
          </div>

          {/* 4. Performance History */}
          <div className="space-y-2.5 p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white mb-4">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Performance History
            </h3>
            <p className="text-sm text-[#A7A6A6] leading-relaxed">
              Track your improvement over time with detailed session logs, charts, and consistency breakdowns.
            </p>
          </div>

          {/* 5. Leaderboards */}
          <div className="space-y-2.5 p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white mb-4">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Leaderboards
            </h3>
            <p className="text-sm text-[#A7A6A6] leading-relaxed">
              Compare your performance with other typists worldwide across daily, weekly, and all-time rankings.
            </p>
          </div>

          {/* 6. Multiple Test Durations */}
          <div className="space-y-2.5 p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-white mb-4">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Multiple Test Durations
            </h3>
            <p className="text-sm text-[#A7A6A6] leading-relaxed">
              Support for 15s, 30s, 60s, 120s, and custom intervals tailored to sprints or long-form endurance tests.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. WPM VISUALIZATION (Your progress, measured.)               */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-[#141414]">
        <div className="text-left max-w-xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A7A6A6] mb-2">Analytics & Trajectory</p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#FAFAFA] tracking-tight">
            Your progress, measured.
          </h2>
          <p className="text-sm text-[#A7A6A6] mt-2">
            Minimal progression tracking showing how daily 5-minute sessions compound into speed.
          </p>
        </div>

        {/* Minimal Editorial WPM Progress Visualization */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#090909] border border-[#1c1c1c] shadow-subtle-card space-y-6">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span className="font-mono uppercase tracking-wider">WPM Progression</span>
            <span className="text-[#FAFAFA] font-semibold">+48% Average 5-Week Gain</span>
          </div>

          {/* Minimal Chart Component */}
          <div className="relative pt-6 pb-2">
            <svg viewBox="0 0 700 240" className="w-full h-auto overflow-visible select-none" fill="none">
              {/* Subtle Horizontal Grid lines */}
              <line x1="40" y1="20" x2="680" y2="20" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="680" y2="70" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="680" y2="120" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="680" y2="170" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="220" x2="680" y2="220" stroke="#262626" strokeWidth="1" />

              {/* Y-Axis Labels */}
              <text x="10" y="24" fill="#666666" fontSize="11" fontFamily="JetBrains Mono">100</text>
              <text x="16" y="74" fill="#666666" fontSize="11" fontFamily="JetBrains Mono">85</text>
              <text x="16" y="124" fill="#666666" fontSize="11" fontFamily="JetBrains Mono">70</text>
              <text x="16" y="174" fill="#666666" fontSize="11" fontFamily="JetBrains Mono">55</text>
              <text x="16" y="224" fill="#666666" fontSize="11" fontFamily="JetBrains Mono">40</text>

              {/* Subtle Curve Line */}
              <path
                d="M 60 190 Q 200 160, 340 110 T 640 40"
                stroke="rgba(250, 250, 250, 0.85)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Subtle Area Fill */}
              <path
                d="M 60 190 Q 200 160, 340 110 T 640 40 L 640 220 L 60 220 Z"
                fill="url(#progress-grad)"
                opacity="0.25"
              />

              {/* Data Points */}
              <g className="transition-transform duration-200">
                <circle cx="60" cy="190" r="4.5" fill="#050505" stroke="#FAFAFA" strokeWidth="2" />
                <circle cx="205" cy="155" r="4.5" fill="#050505" stroke="#FAFAFA" strokeWidth="2" />
                <circle cx="350" cy="108" r="4.5" fill="#050505" stroke="#FAFAFA" strokeWidth="2" />
                <circle cx="495" cy="72" r="4.5" fill="#050505" stroke="#FAFAFA" strokeWidth="2" />
                <circle cx="640" cy="40" r="5" fill="#FAFAFA" stroke="#050505" strokeWidth="2" />
              </g>

              {/* Gradient definition */}
              <defs>
                <linearGradient id="progress-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>

            {/* X-Axis Timeline Labels */}
            <div className="flex justify-between pl-8 sm:pl-10 pr-2 pt-3 text-xs font-mono text-[#666666]">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Week 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. TYPING MODES (Choose your pace.)                           */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-[#141414]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A7A6A6] mb-2">Pacing & Duration</p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#FAFAFA] tracking-tight">
            Choose your pace.
          </h2>
          <p className="text-sm text-[#A7A6A6] mt-2">
            Switch intervals with one click to warm up, benchmark, or build sustained stamina.
          </p>
        </div>

        {/* Interactive Duration Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
          {([15, 30, 60, 120] as TestDuration[]).map((d) => {
            const isSelected = engine.duration === d;
            return (
              <button
                key={d}
                onClick={() => handleSelectDuration(d)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAFAFA] text-[#050505] shadow-white-pill scale-105'
                    : 'bg-[#0f0f0f] text-[#A7A6A6] border border-[#1f1f1f] hover:text-[#FAFAFA] hover:border-[#333333]'
                }`}
              >
                {d}s Test
              </button>
            );
          })}

          <button
            onClick={scrollToArena}
            className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              ![15, 30, 60, 120].includes(engine.duration)
                ? 'bg-[#FAFAFA] text-[#050505] shadow-white-pill scale-105'
                : 'bg-[#0f0f0f] text-[#A7A6A6] border border-[#1f1f1f] hover:text-[#FAFAFA] hover:border-[#333333]'
            }`}
          >
            Custom Duration
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. LEADERBOARD (Fast fingers. Global competition.)           */}
      {/* ------------------------------------------------------------- */}
      <section id="leaderboard-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-[#141414]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#A7A6A6] mb-2">Live Rankings</p>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#FAFAFA] tracking-tight">
              Fast fingers. Global competition.
            </h2>
          </div>

          {/* Timeframe Filter Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] self-start sm:self-auto">
            {(['daily', 'weekly', 'monthly', 'allTime'] as LeaderboardTimeframe[]).map((tf) => {
              const labelMap: Record<LeaderboardTimeframe, string> = {
                daily: 'Today',
                weekly: 'Week',
                monthly: 'Month',
                allTime: 'All Time'
              };
              const isSelected = leaderboardTimeframe === tf;
              return (
                <button
                  key={tf}
                  onClick={() => setLeaderboardTimeframe(tf)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-black shadow-xs'
                      : 'text-[#888888] hover:text-[#FAFAFA]'
                  }`}
                >
                  {labelMap[tf]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-subtle-card">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d] text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
                <th className="py-3.5 px-4 sm:px-6">Rank</th>
                <th className="py-3.5 px-4 sm:px-6">Typist</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Speed</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Accuracy</th>
                <th className="py-3.5 px-4 sm:px-6 text-right hidden sm:table-cell">Duration</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {entries.slice(0, 7).map((entry) => (
                <tr
                  key={`${entry.rank}-${entry.player}`}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-[#A7A6A6]">
                    <div className="flex items-center gap-1.5">
                      {entry.rank === 1 && <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      {entry.rank === 2 && <Medal className="w-4 h-4 text-slate-300" />}
                      {entry.rank === 3 && <Medal className="w-4 h-4 text-amber-600" />}
                      <span>#{String(entry.rank).padStart(2, '0')}</span>
                    </div>
                  </td>

                  {/* Player Name */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="font-semibold text-[#FAFAFA]">{entry.player}</span>
                  </td>

                  {/* Speed */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-bold text-[#FAFAFA]">
                    {entry.wpm} <span className="text-[10px] text-[#666666]">WPM</span>
                  </td>

                  {/* Accuracy */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-[#A7A6A6]">
                    {entry.accuracy.toFixed(1)}%
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-[#666666] hidden sm:table-cell">
                    {entry.duration}s
                  </td>

                  {/* Trend */}
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    {entry.movement === 'up' && (
                      <span className="inline-flex items-center text-emerald-400 text-xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {entry.movement === 'down' && (
                      <span className="inline-flex items-center text-rose-400 text-xs">
                        <TrendingUp className="w-3.5 h-3.5 rotate-180" />
                      </span>
                    )}
                    {(!entry.movement || entry.movement === 'same') && (
                      <span className="inline-flex items-center text-[#555555] text-xs">
                        <Minus className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. ABOUT TYPEFAST (Built for people who want to get faster.)  */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-[#141414] text-center space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#A7A6A6]">Mission & Craft</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FAFAFA] tracking-tight max-w-2xl mx-auto">
          Built for people who want to get faster.
        </h2>
        <p className="text-base sm:text-lg text-[#A7A6A6] leading-relaxed max-w-2xl mx-auto">
          TypeFast turns typing practice into measurable progress. Test your speed, improve your accuracy, build consistency, and track your performance over time.
        </p>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. FINAL CTA (Ready to get faster?)                          */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-t border-[#141414] text-center px-4 sm:px-6">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-5xl font-normal text-[#FAFAFA] tracking-tight">
            Ready to get faster?
          </h2>
          <p className="text-base sm:text-lg text-[#A7A6A6]">
            One minute. One test. One better score.
          </p>
          <div className="pt-2">
            <button
              onClick={scrollToArena}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FAFAFA] hover:bg-white text-[#050505] text-base font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-white-pill cursor-pointer"
            >
              <span>Start Typing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
