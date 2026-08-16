import React from 'react';
import { Clock, SlidersHorizontal, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { TestDuration, Difficulty } from '../types';

interface TestSettingsProps {
  duration: TestDuration;
  difficulty: Difficulty;
  soundEnabled: boolean;
  onDurationChange: (d: TestDuration) => void;
  onDifficultyChange: (diff: Difficulty) => void;
  onToggleSound: () => void;
  disabled?: boolean;
}

const DURATIONS: TestDuration[] = [15, 30, 60, 120];
const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Short common words' },
  { id: 'medium', label: 'Medium', desc: 'Standard vocabulary' },
  { id: 'hard', label: 'Hard', desc: 'Complex words, code & symbols' },
];

export const TestSettings: React.FC<TestSettingsProps> = ({
  duration,
  difficulty,
  soundEnabled,
  onDurationChange,
  onDifficultyChange,
  onToggleSound,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 py-2.5 px-3 sm:px-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-sm transition-all duration-200">
      {/* Duration Selector */}
      <div className="flex items-center gap-1.5">
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
          <Clock className="w-3.5 h-3.5 text-brand-500" />
          <span>Time</span>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          {DURATIONS.map((d) => {
            const isSelected = duration === d;
            return (
              <button
                key={d}
                onClick={() => onDurationChange(d)}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${d} seconds test duration`}
                className={`btn-interactive px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
          <span>Difficulty</span>
        </div>
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => onDifficultyChange(diff.id)}
                disabled={disabled}
                aria-pressed={isSelected}
                title={diff.desc}
                className={`btn-interactive flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {diff.id === 'hard' && <Sparkles className="w-3 h-3 text-amber-400" />}
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

      {/* Sound Toggle Button */}
      <button
        onClick={onToggleSound}
        aria-label={soundEnabled ? 'Typing sound ON' : 'Typing sound OFF'}
        title={soundEnabled ? 'Typing sound is enabled (Click to mute)' : 'Typing sound is disabled (Click to enable)'}
        className={`btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-150 cursor-pointer ${
          soundEnabled
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 shadow-sm'
            : 'bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-900'
        }`}
      >
        {soundEnabled ? (
          <>
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <span>Sound ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-400" />
            <span>Sound OFF</span>
          </>
        )}
      </button>
    </div>
  );
};
