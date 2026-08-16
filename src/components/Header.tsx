import React, { useState } from 'react';
import { Keyboard, Trophy, Info, Github, Volume2, VolumeX, Menu, X, Zap, Mail } from 'lucide-react';
import { Page, Theme } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme: Theme;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'test', label: 'Test', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#090d16]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate('test');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500/50 rounded-xl p-1 btn-interactive"
          aria-label="TypeFast Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
            <Zap className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Type<span className="text-brand-500">Fast</span>
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/70 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-800/70">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`btn-interactive flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Contact Button in Nav */}
          <a
            href="mailto:connectwithfaishal@gmail.com"
            aria-label="Contact Founder & Developer"
            className="btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-150"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </a>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Sound click toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Disable typing sound' : 'Enable typing sound'}
            title={soundEnabled ? 'Typing sound ON' : 'Typing sound OFF'}
            className="btn-interactive p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all duration-150 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-brand-500 dark:text-brand-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="btn-interactive flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-800 transition-all duration-150"
          >
            <Github className="w-4 h-4" />
            <span className="hidden lg:inline">GitHub</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 btn-interactive"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/95 px-4 pt-3 pb-5 space-y-2 animate-fade-in backdrop-blur-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                currentPage === item.id
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* Mobile Contact Link */}
          <a
            href="mailto:connectwithfaishal@gmail.com"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            <Mail className="w-5 h-5 text-brand-500" />
            <span>Contact</span>
          </a>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-2">
            <button
              onClick={onToggleSound}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-500" /> : <VolumeX className="w-4 h-4" />}
              <span>Key Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
