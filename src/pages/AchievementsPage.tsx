import { Trophy, CheckCircle2, Lock } from 'lucide-react';
import { getUserAchievements } from '../services/achievementService';
import { PopIn } from '../components/animations/PopIn';
import { StaggerItem } from '../components/animations/StaggerItem';

import { Page } from '../types';

interface AchievementsPageProps {
  onNavigate?: (page: Page) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = () => {
  const achievements = getUserAchievements();
  const unlocked = achievements.filter(a => !!a.unlockedAt);
  const percent = Math.round((unlocked.length / achievements.length) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header (PopIn 0ms) */}
      <PopIn delay={0} className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Milestone Badges</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Typing Mastery Achievements
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unlock badges as you accelerate your speed, conquer challenges, and build consistency.
        </p>
      </PopIn>

      {/* Progress Summary Card (PopIn 60ms) */}
      <PopIn delay={60} className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-brand-500/15 border border-amber-500/30 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Total Badges Unlocked
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            {unlocked.length} <span className="text-lg font-medium text-slate-500">/ {achievements.length}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Keep practicing daily to unlock the Master Typist and Grandmaster badges!
          </p>
        </div>

        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Progress</span>
            <span className="font-mono">{percent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-brand-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </PopIn>

      {/* 13 Achievements Grid with Stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {achievements.map((a, idx) => (
          <StaggerItem
            key={a.id}
            index={idx}
            baseDelay={40}
            className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between ${
              a.unlockedAt
                ? 'bg-white/95 dark:bg-slate-900/90 border-amber-500/40 shadow-xl shadow-amber-500/5'
                : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
                  a.unlockedAt
                    ? 'bg-amber-500/20 border-amber-500/40 shadow-xs text-amber-500'
                    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}>
                  {a.unlockedAt ? a.icon : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  a.unlockedAt
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {a.unlockedAt ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                {a.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {a.description}
              </p>
            </div>

            {/* Unlocked status footer */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="capitalize text-[11px] font-semibold">{a.category}</span>
              {a.unlockedAt && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{new Date(a.unlockedAt).toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </StaggerItem>
        ))}
      </div>
    </div>
  );
};
