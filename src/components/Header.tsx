import React, { useState } from 'react';
import {
  Keyboard,
  Trophy,
  Info,
  Volume2,
  VolumeX,
  Menu,
  X,
  Zap,
  Award,
  Flame,
  LayoutDashboard,
  History as HistoryIcon,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Play,
  Settings as SettingsIcon
} from 'lucide-react';
import { Page, Theme, UserProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { getLevelInfo } from '../services/xpService';
import { useSettings } from '../context/SettingsContext';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme: Theme;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  user,
  onLogout,
  onOpenSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { openSettings } = useSettings();
  const levelInfo = getLevelInfo();

  const handleOpenSettingsModal = () => {
    if (onOpenSettings) onOpenSettings();
    else openSettings();
  };

  const mainNavItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'test', label: 'Test', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Coach', icon: <Sparkles className="w-4 h-4 text-brand-500" /> },
    { id: 'practice', label: 'Practice', icon: <Play className="w-4 h-4 text-emerald-500" /> },
    { id: 'keyboard', label: 'Keyboard', icon: <Keyboard className="w-4 h-4 text-cyan-500" /> },
    { id: 'history', label: 'History', icon: <HistoryIcon className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'daily-challenge', label: 'Daily Challenge', icon: <Flame className="w-4 h-4 text-amber-500" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4 text-yellow-500" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#090d16]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo with v2.0 Badge */}
        <button
          onClick={() => {
            onNavigate('test');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500/50 rounded-xl p-1 btn-interactive flex-shrink-0"
          aria-label="TypeFast v2.0 Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
            <Zap className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5 text-left">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Type<span className="text-brand-500">Fast</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25">
              v2.0
            </span>
          </div>
        </button>

        {/* Desktop Primary Navigation (2XL screens) */}
        <nav className="hidden 2xl:flex items-center gap-0.5 bg-slate-100/90 dark:bg-slate-900/70 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-800/70">
          {mainNavItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
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
        </nav>

        {/* Large Screen Streamlined Navigation */}
        <nav className="hidden lg:flex 2xl:hidden items-center gap-1 bg-slate-100/90 dark:bg-slate-900/70 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-800/70">
          {mainNavItems.slice(0, 6).map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`btn-interactive flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side Action Controls & Auth */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {/* Certificate Nav Link */}
          <button
            onClick={() => onNavigate('certificate')}
            className={`btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'certificate'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="hidden xl:inline">Certificates</span>
          </button>

          {/* Level Badge */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-black"
            title={`${levelInfo.title} (${levelInfo.currentXp} XP)`}
          >
            <span>Lvl {levelInfo.level}</span>
          </div>

          {/* Sound toggle button */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Disable typing sound' : 'Enable typing sound'}
            title={soundEnabled ? 'Typing sound ON' : 'Typing sound OFF'}
            className="btn-interactive p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Theme Toggle (Light / Dark / System) */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* Settings Trigger Button */}
          <button
            onClick={handleOpenSettingsModal}
            aria-label="Open Settings"
            title="Preferences & Settings (Theme, Caret, Keyboard, Audio)"
            className="btn-interactive p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* Auth State Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn-interactive flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-xl object-cover border border-brand-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-scale-in">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-brand-500" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-cyan-500" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      handleOpenSettingsModal();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <SettingsIcon className="w-4 h-4 text-amber-500" />
                    <span>Settings</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    onClick={() => {
                      onLogout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('login')}
                className="btn-interactive px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="btn-interactive px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile quick controls & menu trigger */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={handleOpenSettingsModal}
            aria-label="Settings"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 btn-interactive"
          >
            <SettingsIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/95 px-4 pt-3 pb-6 space-y-2 animate-fade-in backdrop-blur-xl max-h-[85vh] overflow-y-auto">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                currentPage === item.id
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={() => {
              onNavigate('certificate');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Certificates</span>
          </button>

          <button
            onClick={() => {
              handleOpenSettingsModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            <SettingsIcon className="w-4 h-4 text-brand-500" />
            <span>Settings & Themes</span>
          </button>

          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            <Info className="w-4 h-4 text-blue-500" />
            <span>About TypeFast</span>
          </button>

          {/* User Auth in Mobile */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800"
                >
                  <User className="w-4 h-4 text-brand-500" />
                  <span>{user.name} (Lvl {levelInfo.level})</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-brand-500 text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
