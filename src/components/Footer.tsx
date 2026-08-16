import React from 'react';
import { Zap, Mail } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="footer" className="w-full mt-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#090d16]/90 backdrop-blur-md transition-colors pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Type<span className="text-brand-500">Fast</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              Type Faster. Type Smarter.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The AI-powered typing improvement platform. Discover weak keys with interactive heatmaps, drill personalized training passages, track streaks, and earn verified certificates.
            </p>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              AI & Training
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('test')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Typing Test</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('coach')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>AI Typing Coach</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practice')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Personalized Practice</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('keyboard')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Keyboard Heatmap</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Achievements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Streaks & Community
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
              <li>
                <button
                  onClick={() => onNavigate('daily-challenge')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Daily Challenge</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Leaderboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('achievements')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Achievements</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('certificate')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Certificates</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="btn-interactive hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>About TypeFast</span>
                </button>
              </li>
            </ul>

            <a
              href="mailto:connectwithfaishal@gmail.com"
              className="btn-interactive inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/30 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              <span>connectwithfaishal@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Founder Credit & Copyright Divider */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Founded & Developed by Mr. Faishal Naushad</span>
          </div>

          <div className="flex items-center gap-4">
            <p>© 2026 TypeFast. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
