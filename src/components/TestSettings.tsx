import React from 'react';
import { Clock, SlidersHorizontal, Sparkles } from 'lucide-react';
import { TestDuration, Difficulty } from '../types';

interface TestSettingsProps {
  duration: TestDuration;
  difficulty: Difficulty;
  onDurationChange: (d: TestDuration) => void;
  onDifficultyChange: (diff: Difficulty) => void;
  disabled?: boolean;
}

const DURATIONS: TestDuration[] = [15, 30, 60, 120];
const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Short common words' },
  { id: 'medium', label: 'Medium', desc: 'Standard vocabulary' },
  { id: 'hard', label: 'Hard', desc: 'Complex words & symbols' },
];

export const TestSettings: React.FC<TestSettingsProps> = ({
  duration,
  difficulty,
  onDurationChange,
  onDifficultyChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2 px-3 sm:px-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-sm transition-all duration-200">
      {/* Duration Selector */}
      <div className="flex items-center gap-1.5">
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mr-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Time</span>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          {DURATIONS.map((d) => {
            const isSelected = duration === d;
            return (
              <button
                key={d}
                onClick={() => onDurationChange(d)}
                disabled={disabled}
                className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {d}s
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

      {/* Difficulty Selector */}
      <div className="flex items-center gap-1.5">
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Difficulty</span>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => onDifficultyChange(diff.id)}
                disabled={disabled}
                title={diff.desc}
                className={`flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {diff.id === 'hard' && <Sparkles className="w-3 h-3 text-amber-400" />}
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
