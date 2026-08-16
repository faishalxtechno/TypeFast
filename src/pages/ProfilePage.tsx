import React, { useState } from 'react';
import {
  Mail,
  Calendar,
  Zap,
  Target,
  Trophy,
  Flame,
  TrendingUp,
  Edit3,
  Check,
  X,
  LogOut
} from 'lucide-react';
import { Page, UserProfile } from '../types';
import { updateProfile } from '../services/authService';
import { getAnalyticsSummary } from '../services/testService';
import { getStreakInfo } from '../services/challengeService';
import { getUserAchievements } from '../services/achievementService';

interface ProfilePageProps {
  user: UserProfile | null;
  onLogout: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (page: Page) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onLogout,
  onUpdateUser,
  onNavigate
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user?.name || '');
  const [editBio, setEditBio] = useState<string>(user?.bio || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center animate-fade-in space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto text-2xl">
          👤
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sign In to Access Your Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Create an account or log in to sync your typing tests, achievements, and cloud records.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('login')}
            className="btn-interactive px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-md"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="btn-interactive px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const analytics = getAnalyticsSummary();
  const streak = getStreakInfo();
  const achievements = getUserAchievements();
  const unlockedBadges = achievements.filter(a => !!a.unlockedAt);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateProfile({
      name: editName.trim() || user.name,
      bio: editBio.trim()
    });
    if (updated) {
      onUpdateUser(updated);
      setIsEditing(false);
      setToastMessage('Profile updated successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-fade-in space-y-10">
      {/* Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-brand-500 shadow-lg shadow-brand-500/20 flex-shrink-0"
          />

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                @{user.username}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {user.joinDate}</span>
              </span>
            </div>

            {user.bio && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-center md:self-start">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-interactive flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-brand-500" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={onLogout}
            className="btn-interactive flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm border border-rose-200/60 dark:border-rose-800/60 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Profile Information
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-brand-500"
                  placeholder="Share a bit about your typing journey..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lifetime Stats Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-amber-500/30 text-center shadow-xs">
          <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-500">
            {analytics.bestWpm} <span className="text-xs">WPM</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Best Speed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-brand-500/30 text-center shadow-xs">
          <TrendingUp className="w-5 h-5 text-brand-500 mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black font-mono text-brand-600 dark:text-brand-400">
            {analytics.averageWpm} <span className="text-xs">WPM</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Average Speed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-cyan-500/30 text-center shadow-xs">
          <Target className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400">
            {analytics.bestAccuracy.toFixed(1)}%
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Peak Accuracy</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-orange-500/30 text-center shadow-xs">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <div className="text-2xl sm:text-3xl font-black font-mono text-orange-600 dark:text-orange-400">
            {streak.currentStreak} Days
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Streak</span>
        </div>
      </div>

      {/* Unlocked Badges Showcase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Unlocked Badges ({unlockedBadges.length} / {achievements.length})
            </h3>
          </div>

          <button
            onClick={() => onNavigate('achievements')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            View All Badges
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {unlockedBadges.map(ach => (
            <div
              key={ach.id}
              className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center text-center shadow-xs"
            >
              <span className="text-2xl mb-1">{ach.icon}</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">
                {ach.name}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold capitalize mt-0.5">
                {ach.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
