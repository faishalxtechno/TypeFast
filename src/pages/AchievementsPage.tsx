import React, { useState } from 'react';
import {
  Trophy,
  Lock,
  CheckCircle,
  Zap,
  Target,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { Page, AchievementCategory } from '../types';
import { getUserAchievements } from '../services/achievementService';

interface AchievementsPageProps {
  onNavigate?: (page: Page) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const achievements = getUserAchievements();

  const unlockedCount = achievements.filter(a => !!a.unlockedAt).length;
  const totalCount = achievements.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const filtered = achievements.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const categories: { id: AchievementCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Badges', icon: <Layers className="w-4 h-4" /> },
    { id: 'speed', label: 'Speed', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: 'accuracy', label: 'Accuracy', icon: <Target className="w-4 h-4 text-cyan-500" /> },
    { id: 'volume', label: 'Volume', icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
    { id: 'streak', label: 'Streaks', icon: <Flame className="w-4 h-4 text-orange-500" /> },
    { id: 'special', label: 'Special', icon: <Award className="w-4 h-4 text-yellow-500" /> }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-8">
      {/* Header & Overall Mastery Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-brand-500/10 to-purple-500/15 border-2 border-amber-500/30 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Mastery Roadmap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Typing Achievements
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg">
            Unlock trophies and milestone badges as you elevate your speed, consistency, and daily streaks.
          </p>
        </div>

        {/* Progress Radial / Box */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/30 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-xl font-mono">
            {percentage}%
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Progress
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {unlockedCount} of {totalCount} Badges
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn-interactive flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ach => {
          const isUnlocked = !!ach.unlockedAt;
          const currentProgress = ach.progress || 0;
          const progressPercent = Math.min(100, Math.round((currentProgress / ach.requirement) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white/95 dark:bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5 hover:scale-[1.02]'
                  : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800/80 opacity-75'
              }`}
            >
              <div>
                {/* Icon & Status Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
                      isUnlocked
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-50 grayscale'
                    }`}
                  >
                    <span>{ach.icon}</span>
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>UNLOCKED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
                      <Lock className="w-3 h-3" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {ach.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress Bar & Detail */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <span>Requirement</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {currentProgress} / {ach.requirement} {ach.requirementType.toUpperCase()}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                        : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
