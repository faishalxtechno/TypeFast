import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Volume2,
  VolumeX,
  Keyboard,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Check,
  Play,
  AlertTriangle
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { AVAILABLE_THEMES, ThemeMode, ThemeName, CaretStyle } from '../types/settings';
import { playKeyClickSound, playCompletionSound, playButtonClickSound } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'appearance' | 'typing' | 'sound'>('appearance');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showResetConfirm) {
          setShowResetConfirm(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showResetConfirm, onClose]);

  if (!isOpen) return null;

  const handleModeChange = (mode: ThemeMode) => {
    playButtonClickSound();
    updateSettings({ themeMode: mode });
  };

  const handleThemeChange = (themeName: ThemeName) => {
    playButtonClickSound();
    updateSettings({ selectedTheme: themeName });
  };

  const handleCaretChange = (style: CaretStyle) => {
    playButtonClickSound();
    updateSettings({ caretStyle: style });
  };

  const handleSoundToggle = () => {
    const next = !settings.soundEnabled;
    updateSettings({ soundEnabled: next });
    if (next) {
      playKeyClickSound(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    updateSettings({ soundVolume: vol });
  };

  const handleTestSound = (type: 'click' | 'error' | 'chime') => {
    if (type === 'click') playKeyClickSound(false);
    else if (type === 'error') playKeyClickSound(true);
    else if (type === 'chime') playCompletionSound();
  };

  const handleResetConfirm = () => {
    resetSettings();
    setShowResetConfirm(false);
    playButtonClickSound();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal-pop"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-lg font-extrabold text-slate-900 dark:text-white">
                TypeFast Preferences & Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize your theme, sound, virtual keyboard, and typing caret.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="btn-interactive p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'appearance'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800/80 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('typing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'typing'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800/80 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Typing & Caret</span>
          </button>

          <button
            onClick={() => setActiveTab('sound')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'sound'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-800/80 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sound Effects</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-fade-in">
              {/* Theme Mode Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleModeChange('light')}
                    className={`btn-interactive flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      settings.themeMode === 'light'
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Light</span>
                  </button>

                  <button
                    onClick={() => handleModeChange('dark')}
                    className={`btn-interactive flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      settings.themeMode === 'dark'
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Dark</span>
                  </button>

                  <button
                    onClick={() => handleModeChange('system')}
                    className={`btn-interactive flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                      settings.themeMode === 'system'
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Laptop className="w-4 h-4 text-cyan-500" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Color Theme Selector Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Choose Color Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_THEMES.map((t) => {
                    const isSelected = settings.selectedTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className={`btn-interactive flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 ring-2 ring-brand-500/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40'
                        }`}
                      >
                        {/* Theme Swatch Dot */}
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.previewClass} flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                        </div>

                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {t.name}
                            </span>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-brand-500 text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                            {t.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPING & CARET */}
          {activeTab === 'typing' && (
            <div className="space-y-6 animate-fade-in">
              {/* Caret Style Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Caret Cursor Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'line' as CaretStyle, label: 'Line', desc: 'Vertical thin cursor' },
                    { id: 'block' as CaretStyle, label: 'Block', desc: 'Highlighted char box' },
                    { id: 'underline' as CaretStyle, label: 'Underline', desc: 'Bottom character bar' }
                  ].map((c) => {
                    const isSelected = settings.caretStyle === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleCaretChange(c.id)}
                        className={`btn-interactive flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/25'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="font-extrabold text-sm mb-1">{c.label}</span>
                        <span className="text-[10px] text-slate-400">{c.desc}</span>

                        {/* Visual sample */}
                        <div className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 font-mono text-base font-bold relative flex items-center justify-center">
                          <span className="relative">
                            {c.id === 'line' && (
                              <span className="absolute -left-0.5 top-0 bottom-0 w-[2.5px] bg-brand-500 rounded-full animate-smooth-caret" />
                            )}
                            {c.id === 'block' && (
                              <span className="absolute inset-0 bg-brand-500/30 border border-brand-500 rounded-xs" />
                            )}
                            {c.id === 'underline' && (
                              <span className="absolute left-0 right-0 -bottom-0.5 h-[2.5px] bg-brand-500 rounded-full" />
                            )}
                            A
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* On-screen Keyboard Visualization Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5 pr-4">
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-cyan-500" />
                    <span>On-Screen Virtual Keyboard Visualization</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Display interactive mechanical keyboard keys underneath the typing test with keypress highlights.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateSettings({ keyboardEnabled: !settings.keyboardEnabled })}
                  className={`btn-interactive relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    settings.keyboardEnabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-pressed={settings.keyboardEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.keyboardEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* UI Animations Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5 pr-4">
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Micro-Animations & Smooth Motion</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enable subtle card pop-ins, caret blinking, and spring bounce transitions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
                  className={`btn-interactive relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    settings.animationsEnabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-pressed={settings.animationsEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SOUND EFFECTS */}
          {activeTab === 'sound' && (
            <div className="space-y-6 animate-fade-in">
              {/* Master Sound Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5 pr-4">
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Sound Effects Audio Feedback</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tactile mechanical keypress clicks, soft error thuds, and completion chimes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSoundToggle}
                  className={`btn-interactive relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-pressed={settings.soundEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Volume Slider */}
              <div className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 transition-opacity ${
                settings.soundEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="uppercase tracking-wider">Master Volume</span>
                  <span className="font-mono text-brand-500 font-extrabold">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={handleVolumeChange}
                  className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />

                {/* Sound Test Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleTestSound('click')}
                    className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <Play className="w-3 h-3 text-emerald-500" />
                    <span>Test Key Click</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestSound('error')}
                    className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <Play className="w-3 h-3 text-rose-500" />
                    <span>Test Error Thud</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestSound('chime')}
                    className="btn-interactive flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <Play className="w-3 h-3 text-amber-500" />
                    <span>Test Completion Chime</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="btn-interactive flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Settings</span>
          </button>

          <button
            onClick={onClose}
            className="btn-interactive px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold shadow-md shadow-brand-500/25 cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Confirmation Modal for Reset Settings */}
        {showResetConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full text-center space-y-4 animate-modal-pop">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Reset All Settings?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This will restore default System theme, Classic palette, Line caret, sound volume, and animations.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="btn-interactive py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetConfirm}
                  className="btn-interactive py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
