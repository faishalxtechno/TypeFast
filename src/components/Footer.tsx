import React from 'react';
import { Zap, Keyboard, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#0c1017]/80 backdrop-blur-sm transition-colors py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Type<span className="text-brand-500">Fast</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Type Faster. Type Smarter.
            </p>
          </div>

          {/* Shortcut Badges */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Keyboard className="w-4 h-4 text-brand-500" />
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono border border-slate-200 dark:border-slate-700">Tab</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono border border-slate-200 dark:border-slate-700">Enter</kbd>
              <span className="ml-1">Restart</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono border border-slate-200 dark:border-slate-700">Esc</kbd>
              <span className="ml-1">Reset</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <button
              onClick={() => onNavigate('test')}
              className="hover:text-brand-500 transition-colors"
            >
              Test
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="hover:text-brand-500 transition-colors"
            >
              Leaderboard
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-brand-500 transition-colors"
            >
              About
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} TypeFast. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for typing enthusiasts & developers with
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
