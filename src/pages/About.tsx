import React from 'react';
import {
  Zap,
  Target,
  Clock,
  Sparkles,
  Trophy,
  Award,
  Mail,
  Brain
} from 'lucide-react';

import { Page } from '../types';

interface AboutProps {
  onNavigate?: (page: Page) => void;
}

export const About: React.FC<AboutProps> = () => {
  const highlights = [
    {
      icon: <Brain className="w-5 h-5 text-brand-500" />,
      title: 'AI Typing Coach',
      desc: 'Deep biomechanical diagnostics analyzing keystroke pacing, weak-key clusters, and targeted drill recommendations.'
    },
    {
      icon: <Target className="w-5 h-5 text-cyan-500" />,
      title: 'Weak-Key Detection',
      desc: 'Interactive keyboard heatmaps track individual finger accuracy to uncover hesitation spots across every key.'
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: 'Personalized Practice',
      desc: 'Automated vocabulary generators craft natural practice passages containing your specific difficult digraphs and keys.'
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      title: 'Live Telemetry Engine',
      desc: 'Precision WPM, accuracy, and error tracking with zero-latency keystroke processing and synthesized key clicks.'
    },
    {
      icon: <Trophy className="w-5 h-5 text-emerald-500" />,
      title: 'Gamified XP & Streaks',
      desc: 'Progressive level milestones, title ranks from Beginner to TypeFast Master, and daily streak rewards.'
    },
    {
      icon: <Award className="w-5 h-5 text-yellow-500" />,
      title: 'Official Certificates',
      desc: 'High-resolution landscape A4 credentials with unique certificate IDs, verification stamps, and 1-click export.'
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-fade-in space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>About TypeFast 5.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Type Faster. Type Smarter.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          TypeFast is a state-of-the-art typing-learning platform engineered for developers, writers, students, and speed enthusiasts worldwide.
        </p>
      </section>

      {/* Powered by Personalized Learning Section */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-500/15 via-purple-500/10 to-cyan-500/15 border-2 border-brand-500/30 shadow-2xl backdrop-blur-xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Powered by Personalized Learning</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Adaptive AI Feedback & Precision Heatmaps
        </h2>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          TypeFast analyzes your typing performance to help you identify weak keys, improve accuracy, build speed, and practice more effectively.
        </p>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {h.icon}
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {h.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {h.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Founder Profile Card */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-brand-500/25 flex-shrink-0">
            FN
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
              <span>Platform Architect & Creator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Mr. Faishal Naushad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              TypeFast was founded and developed by Mr. Faishal Naushad to make touch-typing practice engaging, aesthetically pleasing, and scientifically effective.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-500">
            Have questions, feedback, or collaboration proposals?
          </div>

          <a
            href="mailto:connectwithfaishal@gmail.com"
            className="btn-interactive inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-md"
          >
            <Mail className="w-4 h-4" />
            <span>connectwithfaishal@gmail.com</span>
          </a>
        </div>
      </section>
    </div>
  );
};
