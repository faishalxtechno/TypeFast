import React, { useState } from 'react';
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

const DURATIONS: { id: TestDuration; label: string }[] = [
  { id: 15, label: '15s' },
  { id: 30, label: '30s' },
  { id: 60, label: '60s' },
  { id: 120, label: '120s' },
];

const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'easy', label: 'Easy', desc: 'Short common words' },
  { id: 'medium', label: 'Medium', desc: 'Standard vocabulary' },
  { id: 'hard', label: 'Hard', desc: 'Complex words, punctuation & symbols' },
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
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customInput, setCustomInput] = useState('45');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val >= 5 && val <= 600) {
      onDurationChange(val as TestDuration);
      setCustomModalOpen(false);
    }
  };

  const isPresetDuration = DURATIONS.some((d) => d.id === duration);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-2 px-3 sm:px-5 rounded-2xl bg-[#0c0c0c]/90 border border-[#1c1c1c] backdrop-blur-md shadow-subtle-card transition-all">
      {/* Duration Selector */}
      <div className="flex items-center gap-1.5">
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#A7A6A6] mr-1">
          <Clock className="w-3 h-3 text-[#A7A6A6]" />
          <span>Time</span>
        </div>
        <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-[#222222]">
          {DURATIONS.map((d) => {
            const isSelected = duration === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onDurationChange(d.id)}
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={`${d.label} test duration`}
                className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FAFAFA] text-[#050505] shadow-xs'
                    : 'text-[#A7A6A6] hover:text-[#FAFAFA] hover:bg-white/[0.05]'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {d.label}
              </button>
            );
          })}

          {/* Custom Duration Option */}
          <button
            onClick={() => setCustomModalOpen(true)}
            disabled={disabled}
            aria-pressed={!isPresetDuration}
            className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              !isPresetDuration
                ? 'bg-[#FAFAFA] text-[#050505] shadow-xs'
                : 'text-[#A7A6A6] hover:text-[#FAFAFA] hover:bg-white/[0.05]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {!isPresetDuration ? `${duration}s` : 'Custom'}
          </button>
        </div>
      </div>

      <div className="hidden sm:block w-px h-5 bg-[#222222]" />

      {/* Difficulty Selector */}
      <div className="flex items-center gap-1.5">
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#A7A6A6] mr-1">
          <SlidersHorizontal className="w-3 h-3 text-[#A7A6A6]" />
          <span>Mode</span>
        </div>
        <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-[#222222]">
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => onDifficultyChange(diff.id)}
                disabled={disabled}
                aria-pressed={isSelected}
                title={diff.desc}
                className={`flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FAFAFA] text-[#050505] shadow-xs'
                    : 'text-[#A7A6A6] hover:text-[#FAFAFA] hover:bg-white/[0.05]'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {diff.id === 'hard' && <Sparkles className="w-3 h-3 text-amber-400" />}
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block w-px h-5 bg-[#222222]" />

      {/* Sound Toggle */}
      <button
        onClick={onToggleSound}
        aria-label={soundEnabled ? 'Typing sound ON' : 'Typing sound OFF'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 cursor-pointer ${
          soundEnabled
            ? 'bg-white/[0.08] text-[#FAFAFA] border-[#333333]'
            : 'bg-[#141414] text-[#666666] border-[#222222] hover:text-[#A7A6A6]'
        }`}
      >
        {soundEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sound</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-[#666666]" />
            <span>Muted</span>
          </>
        )}
      </button>

      {/* Custom Duration Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#0d0d0d] border border-[#242424] shadow-2xl text-left animate-scale-in">
            <h3 className="text-base font-bold text-[#FAFAFA] mb-1">Custom Test Duration</h3>
            <p className="text-xs text-[#A7A6A6] mb-4">Enter duration between 5 and 600 seconds.</p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="600"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-[#333333] text-white text-base font-mono focus:border-white focus:outline-none"
                  autoFocus
                />
                <span className="absolute right-4 top-2.5 text-xs text-[#666666]">seconds</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A7A6A6] hover:text-white hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-[#E5E5E5]"
                >
                  Set Duration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
