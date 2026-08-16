import React from 'react';
import {
  Zap,
  Target,
  Trophy,
  Flame,
  Award,
  CheckCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  History as HistoryIcon,
  Play
} from 'lucide-react';
import { Page, UserProfile } from '../types';
import { PerformanceChart } from '../components/PerformanceChart';
import { StreakCalendar } from '../components/StreakCalendar';
import { getAnalyticsSummary, getAllTests } from '../services/testService';
import { getStreakInfo } from '../services/challengeService';
import { getStoredCertificates } from '../utils/storage';
import { getUserAchievements } from '../services/achievementService';

interface DashboardProps {
  user: UserProfile | null;
  onNavigate: (page: Page) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const analytics = getAnalyticsSummary();
  const streak = getStreakInfo();
  const certificates = getStoredCertificates();
  const recentTests = getAllTests().slice(0, 5);
  const achievements = getUserAchievements();
  const unlockedCount = achievements.filter(a => !!a.unlockedAt).length;

  const displayName = user ? user.name : 'Typist';

  const statCards = [
    {
      label: 'Best WPM',
      value: `${analytics.bestWpm}`,
      sub: 'All-Time Peak',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'from-amber-500/10 via-amber-500/5 to-transparent',
      border: 'border-amber-500/30'
    },
    {
      label: 'Average WPM',
      value: `${analytics.averageWpm}`,
      sub: 'Rolling Mean Speed',
      icon: <TrendingUp className="w-5 h-5 text-brand-500" />,
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'from-brand-500/10 via-brand-500/5 to-transparent',
      border: 'border-brand-500/30'
    },
    {
      label: 'Best Accuracy',
      value: `${analytics.bestAccuracy.toFixed(1)}%`,
      sub: 'Peak Precision',
      icon: <Target className="w-5 h-5 text-cyan-500" />,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      border: 'border-cyan-500/30'
    },
    {
      label: 'Average Accuracy',
      value: `${analytics.averageAccuracy.toFixed(1)}%`,
      sub: 'Error Discipline',
      icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'from-purple-500/10 via-purple-500/5 to-transparent',
      border: 'border-purple-500/30'
    },
    {
      label: 'Tests Completed',
      value: `${recentTests.length > 0 ? getAllTests().length : 0}`,
      sub: 'Practice Sessions',
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      border: 'border-emerald-500/30'
    },
    {
      label: 'Certificates Earned',
      value: `${certificates.length}`,
      sub: 'Official Credentials',
      icon: <Award className="w-5 h-5 text-yellow-500" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'from-yellow-500/10 via-yellow-500/5 to-transparent',
      border: 'border-yellow-500/30'
    },
    {
      label: 'Current Streak',
      value: `${streak.currentStreak} Days`,
      sub: 'Consecutive Daily',
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'from-orange-500/10 via-orange-500/5 to-transparent',
      border: 'border-orange-500/30'
    },
    {
      label: 'Longest Streak',
      value: `${streak.longestStreak} Days`,
      sub: 'Record Consistency',
      icon: <Trophy className="w-5 h-5 text-rose-500" />,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'from-rose-500/10 via-rose-500/5 to-transparent',
      border: 'border-rose-500/30'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-500/15 via-emerald-500/10 to-cyan-500/15 border border-brand-500/30 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TypeFast Pro Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg">
            Ready to push your typing speed and muscle memory to the next tier today?
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('test')}
            className="btn-interactive flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/30 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Typing Test</span>
          </button>
          <button
            onClick={() => onNavigate('daily-challenge')}
            className="btn-interactive flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Daily Challenge</span>
          </button>
        </div>
      </div>

      {/* 8 Metric Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${card.bg} bg-white/80 dark:bg-slate-900/70 border ${card.border} backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              {card.icon}
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${card.color}`}>
              {card.value}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Streak Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart (Span 2) */}
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>

        {/* Streak Calendar & Achievements Mini-Widget (Span 1) */}
        <div className="space-y-6">
          <StreakCalendar onStartChallenge={() => onNavigate('daily-challenge')} />

          {/* Achievements Preview Card */}
          <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Achievements Progress
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                {unlockedCount} / {achievements.length} Unlocked
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-brand-500 transition-all duration-500"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>

            <div className="flex gap-2 justify-between mb-3">
              {achievements.slice(0, 5).map(a => (
                <div
                  key={a.id}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${
                    a.unlockedAt
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 opacity-40 grayscale'
                  }`}
                  title={`${a.name}: ${a.description}`}
                >
                  {a.icon}
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('achievements')}
              className="w-full text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1 pt-1"
            >
              <span>View All 13 Achievements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Tests Table & Personal Best Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tests Table (Span 2) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-brand-500" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Recent Practice Tests
              </h3>
            </div>

            <button
              onClick={() => onNavigate('history')}
              className="btn-interactive text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTests.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs sm:text-sm">
              No tests completed yet. Start your first typing test!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3 text-right">WPM</th>
                    <th className="pb-3 px-3 text-right">Accuracy</th>
                    <th className="pb-3 px-3 text-right">Errors</th>
                    <th className="pb-3 px-3 text-center">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentTests.map((t, idx) => (
                    <tr key={t.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {new Date(t.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-brand-600 dark:text-brand-400">
                        {t.wpm}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                        {t.accuracy.toFixed(1)}%
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {t.errors}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium capitalize text-slate-600 dark:text-slate-300">
                          {t.duration}s • {t.difficulty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Highlighted Personal Best (Span 1) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-brand-500/15 border-2 border-amber-500/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Trophy className="w-3.5 h-3.5" />
              <span>Personal Best Record</span>
            </div>

            <div className="text-5xl font-black font-mono text-amber-500 dark:text-amber-400 tracking-tight">
              {analytics.bestWpm > 0 ? `${analytics.bestWpm}` : '0'} <span className="text-xl">WPM</span>
            </div>

            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
              With {analytics.bestAccuracy.toFixed(1)}% Precision
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Your personal best speed represents your top typing throughput. Keep training regularly to elevate your velocity!
            </p>
          </div>

          <div className="pt-6 border-t border-amber-500/20">
            <button
              onClick={() => onNavigate('test')}
              className="btn-interactive w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Beat Your Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
