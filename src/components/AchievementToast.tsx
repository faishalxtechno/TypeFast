import React, { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  useEffect(() => {
    if (achievement) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
        });
      } catch {
        // Safe fallback
      }

      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="flex items-center gap-3.5 p-4 pr-5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white border-2 border-amber-500/50 shadow-2xl backdrop-blur-xl max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-2xl flex items-center justify-center flex-shrink-0 border border-amber-500/40">
          <span>{achievement.icon}</span>
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievement Unlocked!</span>
          </div>
          <div className="font-extrabold text-sm text-white mt-0.5">
            {achievement.name}
          </div>
          <div className="text-xs text-slate-300">
            {achievement.description}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="btn-interactive p-1 text-slate-400 hover:text-white"
          aria-label="Dismiss achievement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
