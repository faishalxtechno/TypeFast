import React from 'react';
import { Zap, Activity, Target, Award, CheckCircle, Lightbulb, BookOpen, Layers } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-10">
      {/* Hero */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Documentation & Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About TypeFast
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          TypeFast is a modern typing practice platform designed to help users improve typing speed, accuracy, and consistency.
        </p>
      </div>

      {/* Section: What is TypeFast? */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            What is TypeFast?
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
          TypeFast is built from the ground up for software developers, writers, students, and professionals who demand a clean, zero-distraction typing experience. By focusing on live feedback, granular error tracking, and customizable test parameters, TypeFast enables you to build muscle memory and reach your peak typing velocity.
        </p>
      </div>

      {/* Section: Why Typing Speed Matters */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Why Typing Speed Matters
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Frictionless Thought Flow
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Typing at 80+ WPM prevents cognitive bottlenecking, allowing ideas and code to translate seamlessly onto the screen.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Hours Saved Annually
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Doubling your speed from 40 WPM to 80 WPM saves over 21 days worth of working time every year for full-time computer users.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Reduced Physical Fatigue
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Touch-typing minimizes repetitive head-bobbing between screen and keyboard, easing neck and wrist strain.
            </p>
          </div>
        </div>
      </div>

      {/* Section: Formulas & Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How WPM Works */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              How WPM Works
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Standard typing industry metrics define one "word" as exactly 5 keystrokes (including letters, spaces, and punctuation).
          </p>
          <div className="p-4 rounded-2xl bg-brand-500/5 dark:bg-slate-950 border border-brand-500/20 font-mono text-xs sm:text-sm text-brand-600 dark:text-brand-400">
            WPM = (Correct Characters / 5) / Elapsed Minutes
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            This normalization ensures fair benchmarking across texts with short words (e.g. "cat") and long words (e.g. "architecture").
          </p>
        </div>

        {/* How Accuracy Works */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              How Accuracy Works
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Accuracy represents the percentage of correct characters typed against the total volume of keystrokes made.
          </p>
          <div className="p-4 rounded-2xl bg-cyan-500/5 dark:bg-slate-950 border border-cyan-500/20 font-mono text-xs sm:text-sm text-cyan-600 dark:text-cyan-400">
            Accuracy = (Correct Characters / Total Typed Characters) × 100
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Maintaining 95%+ accuracy is crucial because backspacing to correct errors degrades overall speed.
          </p>
        </div>
      </div>

      {/* Speed Benchmark Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Typing Speed Benchmarks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Worldwide distribution of typing speeds
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { range: '120+ WPM', label: 'Grandmaster / Top 1%', desc: 'Elite professional typists and competitive gamers.', color: 'border-amber-500/40 text-amber-500' },
            { range: '90 – 119 WPM', label: 'Master / Top 5%', desc: 'Exceptionally fast touch typists and high-speed software engineers.', color: 'border-purple-500/40 text-purple-500' },
            { range: '70 – 89 WPM', label: 'Pro / Top 15%', desc: 'Productive professional standard. Smooth and fluid typing.', color: 'border-brand-500/40 text-brand-500' },
            { range: '50 – 69 WPM', label: 'Fluent / Above Average', desc: 'Good everyday speed for writers, researchers, and students.', color: 'border-cyan-500/40 text-cyan-500' },
            { range: '35 – 49 WPM', label: 'Intermediate / Global Average', desc: 'Average global typing speed (roughly 41 WPM).', color: 'border-blue-500/40 text-blue-500' },
            { range: '< 35 WPM', label: 'Novice / Beginner', desc: 'Sight typing or learning touch typing positions.', color: 'border-slate-400/40 text-slate-400' },
          ].map((tier, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 gap-2"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${tier.color} bg-white dark:bg-slate-900`}>
                  {tier.range}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {tier.label}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 sm:text-right">
                {tier.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Touch Typing Tips */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pro Tips to Increase Your WPM
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
            <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Master Home Row Position</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Rest your index fingers on the tactile bumps of F and J keys (ASDF - JKL;).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
            <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Prioritize Accuracy Over Speed</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Typing clean keystrokes builds muscle memory. Speed is the natural outcome of high accuracy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
            <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Read 1-2 Words Ahead</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Keep your eyes slightly ahead of the cursor to maintain rhythm and avoid hesitation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60">
            <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Daily 10-Minute Sessions</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Consistent daily micro-sessions yield better muscle memory retention than occasional long sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
