import React, { useState } from 'react';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Sliders,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Award,
  Flame,
  BarChart3,
  History as HistoryIcon,
  Keyboard as KeyboardIcon,
} from 'lucide-react';
import { Page, Theme, UserProfile } from '../types';
import { TypeFastLogo } from './TypeFastLogo';
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
  soundEnabled,
  onToggleSound,
  user,
  onLogout,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const { openSettings } = useSettings();
  const levelInfo = getLevelInfo();

  const handleOpenSettingsModal = () => {
    if (onOpenSettings) onOpenSettings();
    else openSettings();
  };

  const handleStartTypingClick = () => {
    if (currentPage === 'test') {
      const arena = document.getElementById('test-arena');
      if (arena) {
        arena.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = arena.querySelector('input');
        if (input) input.focus();
        return;
      }
    }
    onNavigate('test');
    setTimeout(() => {
      const arena = document.getElementById('test-arena');
      if (arena) {
        arena.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = arena.querySelector('input');
        if (input) input.focus();
      }
    }, 100);
  };

  const mainNavLinks: { id: Page; label: string }[] = [
    { id: 'test', label: 'Test' },
    { id: 'practice', label: 'Practice' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'about', label: 'About' },
  ];

  const secondaryNavItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'coach', label: 'AI Coach', icon: <Sparkles className="w-4 h-4 text-[#FAFAFA]" /> },
    { id: 'keyboard', label: 'Keyboard Heatmap', icon: <KeyboardIcon className="w-4 h-4 text-[#A7A6A6]" /> },
    { id: 'daily-challenge', label: 'Daily Challenge', icon: <Flame className="w-4 h-4 text-amber-400" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { id: 'certificate', label: 'Certificates', icon: <Award className="w-4 h-4 text-emerald-400" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-[#FAFAFA]" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-[#A7A6A6]" /> },
    { id: 'history', label: 'History', icon: <HistoryIcon className="w-4 h-4 text-[#A7A6A6]" /> },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === currentPage);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-md border-b border-[#1c1c1c]/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: TypeFast Minimal Logo & Brand */}
        <button
          onClick={() => {
            onNavigate('test');
            setMobileMenuOpen(false);
          }}
          className="flex items-center group focus:outline-none focus:ring-1 focus:ring-white/30 rounded-lg p-1 transition-transform active:scale-95"
          aria-label="TypeFast Home"
        >
          <TypeFastLogo size="md" />
        </button>

        {/* Center: Clean Desktop Navigation (Test, Practice, Leaderboard, About + More Dropdown) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {mainNavLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#FAFAFA] bg-white/[0.08] shadow-xs'
                    : 'text-[#B6B5B5] hover:text-[#FAFAFA] hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {/* More Menu Dropdown for secondary features */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isSecondaryActive
                  ? 'text-[#FAFAFA] bg-white/[0.08]'
                  : 'text-[#B6B5B5] hover:text-[#FAFAFA] hover:bg-white/[0.04]'
              }`}
              aria-label="Explore more features"
              aria-expanded={moreDropdownOpen}
            >
              <span>Explore</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-white' : 'text-[#888888]'}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-1.5 rounded-2xl bg-[#0d0d0d] border border-[#222222] shadow-2xl z-50 animate-scale-in">
                <div className="grid grid-cols-1 gap-0.5">
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                        currentPage === item.id
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-[#B6B5B5] hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Sound toggle, Settings, User Auth, and Primary White Pill CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute typing sounds' : 'Enable typing sounds'}
            title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
            className="p-2 rounded-full text-[#A7A6A6] hover:text-[#FAFAFA] hover:bg-white/[0.06] transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#666666]" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={handleOpenSettingsModal}
            aria-label="Settings and Preferences"
            title="Settings & Themes"
            className="p-2 rounded-full text-[#A7A6A6] hover:text-[#FAFAFA] hover:bg-white/[0.06] transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* User Profile or Sign In Link */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                className="flex items-center gap-2 py-1 pl-1 pr-2.5 rounded-full bg-[#111111] hover:bg-[#1a1a1a] border border-[#222222] transition-colors"
                aria-label="User menu"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#222222] text-white text-[10px] font-bold flex items-center justify-center">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-[#FAFAFA] max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#888888]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 p-1.5 rounded-2xl bg-[#0d0d0d] border border-[#222222] shadow-2xl z-50 animate-scale-in">
                  <div className="px-3 py-2 text-xs border-b border-[#1f1f1f] mb-1">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-[#888888]">Lvl {levelInfo.level} • {levelInfo.title}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#B6B5B5] hover:text-white hover:bg-white/[0.06] rounded-xl flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#FAFAFA]" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#B6B5B5] hover:text-white hover:bg-white/[0.06] rounded-xl flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#FAFAFA]" />
                    <span>Dashboard</span>
                  </button>
                  <div className="my-1 border-t border-[#1f1f1f]" />
                  <button
                    onClick={() => {
                      onLogout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-3 py-1.5 text-xs font-medium text-[#B6B5B5] hover:text-[#FAFAFA] transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Primary CTA: Large Rounded White Pill with Black Text */}
          <button
            onClick={handleStartTypingClick}
            className="px-5 py-2 rounded-full bg-[#FAFAFA] hover:bg-white text-[#050505] text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-white-pill"
          >
            Start Typing
          </button>
        </div>

        {/* Mobile Hamburger & Quick Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleStartTypingClick}
            className="px-3.5 py-1.5 rounded-full bg-[#FAFAFA] text-[#050505] text-xs font-semibold"
          >
            Start
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-xl text-[#FAFAFA] hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-Screen / Drawer Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[#050505]/98 backdrop-blur-2xl border-t border-[#1c1c1c] p-6 flex flex-col justify-between overflow-y-auto z-50 animate-fade-in">
          <div className="space-y-6">
            {/* Primary navigation items */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#666666] px-3 mb-2">Navigation</p>
              {mainNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-base font-semibold transition-colors flex items-center justify-between ${
                    currentPage === link.id
                      ? 'bg-white/10 text-white'
                      : 'text-[#B6B5B5] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Secondary features */}
            <div className="space-y-1 pt-2 border-t border-[#1a1a1a]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#666666] px-3 mb-2">Explore Features</p>
              <div className="grid grid-cols-2 gap-2">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-white/10 text-white font-bold'
                        : 'bg-[#0f0f0f] text-[#A7A6A6] hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick settings & Sound */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0f0f0f] border border-[#1c1c1c]">
              <button
                onClick={onToggleSound}
                className="flex items-center gap-2 text-xs font-medium text-[#A7A6A6]"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Sound ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-[#666666]" />
                    <span>Sound OFF</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleOpenSettingsModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-[#A7A6A6] hover:text-white"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Preferences</span>
              </button>
            </div>
          </div>

          {/* User Auth or Sign Up in mobile menu */}
          <div className="pt-6 border-t border-[#1c1c1c] space-y-3 pb-8">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0f0f0f]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center text-xs font-bold text-white">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-[#888888]">Lvl {levelInfo.level} • {levelInfo.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 rounded-full text-xs font-semibold text-white bg-[#141414] border border-[#262626] text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 rounded-full text-xs font-semibold text-[#050505] bg-white text-center"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={() => {
                handleStartTypingClick();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 rounded-full bg-[#FAFAFA] text-[#050505] text-sm font-bold text-center shadow-white-pill"
            >
              Start Typing
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
