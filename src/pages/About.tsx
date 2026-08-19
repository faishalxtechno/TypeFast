import React from 'react';
import {
  Zap,
  Target,
  Clock,
  Sparkles,
  Trophy,
  Award,
  Mail,
  Brain,
  ArrowRight
} from 'lucide-react';
import { Page } from '../types';

interface AboutProps {
  onNavigate?: (page: Page) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const highlights = [
    {
      icon: <Brain className="w-5 h-5 text-white" />,
      title: 'AI Typing Diagnostics',
      desc: 'Biomechanical telemetry analyzing keystroke pacing, weak-key clusters, and targeted drill recommendations.'
    },
    {
      icon: <Target className="w-5 h-5 text-white" />,
      title: 'Weak-Key Detection',
      desc: 'Interactive keyboard heatmaps track individual finger accuracy to uncover hesitation spots across every key.'
    },
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      title: 'Personalized Practice',
      desc: 'Vocabulary generators craft natural practice passages containing your specific difficult digraphs and keys.'
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      title: 'Real-Time Keystroke Engine',
      desc: 'Precision WPM, accuracy, and error tracking with zero-latency keystroke processing and audio synthesizer feedback.'
    },
    {
      icon: <Trophy className="w-5 h-5 text-white" />,
      title: 'XP Milestones & Streaks',
      desc: 'Progressive level milestones, rank titles, and consistency streaks to maintain daily deliberate practice.'
    },
    {
      icon: <Award className="w-5 h-5 text-white" />,
      title: 'Verified Certificates',
      desc: 'High-resolution landscape A4 credentials with unique certificate IDs, verification stamps, and 1-click export.'
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FAFAFA] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>About TypeFast</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-normal text-[#FAFAFA] tracking-tight">
          Built for people who want to get faster.
        </h1>

        <p className="text-base sm:text-lg text-[#A7A6A6] max-w-2xl mx-auto leading-relaxed">
          TypeFast turns typing practice into measurable progress. Test your speed, improve your accuracy, build consistency, and track your performance over time.
        </p>

        {onNavigate && (
          <div className="pt-2">
            <button
              onClick={() => onNavigate('test')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAFAFA] hover:bg-white text-[#050505] text-sm font-semibold transition-all duration-200 hover:scale-[1.02] shadow-white-pill cursor-pointer"
            >
              <span>Start Typing Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors space-y-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
              {h.icon}
            </div>
            <h3 className="text-base font-semibold text-[#FAFAFA]">
              {h.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#A7A6A6] leading-relaxed">
              {h.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Founder Profile Card */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-subtle-card space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-[#141414] border border-[#2a2a2a] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            FN
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] text-[#FAFAFA] text-xs font-semibold">
              <span>Founder & Lead Architect</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#FAFAFA]">
              Mr. Faishal Naushad
            </h2>
            <p className="text-xs sm:text-sm text-[#A7A6A6] leading-relaxed max-w-xl">
              TypeFast was founded and developed by Mr. Faishal Naushad to provide a clean, cinematic, distraction-free environment for serious typing practice and measurable speed growth.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#666666]">
            Have questions, feedback, or collaboration proposals?
          </div>

          <a
            href="mailto:connectwithfaishal@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#1f1f1f] text-[#FAFAFA] border border-[#262626] font-semibold text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-white" />
            <span>connectwithfaishal@gmail.com</span>
          </a>
        </div>
      </section>
    </div>
  );
};
