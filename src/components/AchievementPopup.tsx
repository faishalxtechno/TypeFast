import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Zap } from 'lucide-react';
import { Achievement } from '../types';
import { Modal } from './Modal';
import { playCompletionSound } from '../utils/sound';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose,
  soundEnabled = true
}) => {
  useEffect(() => {
    if (achievement) {
      if (soundEnabled) {
        try {
          playCompletionSound();
        } catch {
          // safe fallback
        }
      }

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
        });
      } catch {
        // safe fallback
      }
    }
  }, [achievement, soundEnabled]);

  if (!achievement) return null;

  return (
    <Modal
      isOpen={!!achievement}
      onClose={onClose}
      maxWidth="max-w-md"
      showCloseButton={false}
    >
      <div className="text-center space-y-5">
        {/* Animated Trophy Emblem */}
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-500 border-2 border-amber-500/40 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 animate-number-spring">
          <span>{achievement.icon}</span>
        </div>

        {/* Title & Tag */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievement Unlocked!</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {achievement.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
            {achievement.description}
          </p>
        </div>

        {/* XP Bonus Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-400 font-mono font-bold text-sm">
          <Zap className="w-4 h-4 fill-brand-500" />
          <span>+150 XP Awarded</span>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="btn-interactive w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/30 cursor-pointer"
          >
            Claim & Continue
          </button>
        </div>
      </div>
    </Modal>
  );
};
