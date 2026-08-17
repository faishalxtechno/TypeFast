import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Theme } from '../types';

interface ThemeToggleProps {
  theme?: Theme;
  onToggle?: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  onToggle,
  className = ''
}) => {
  const { settings, updateSettings, effectiveThemeMode } = useSettings();

  const handleCycleTheme = () => {
    if (onToggle) {
      onToggle();
      return;
    }

    // Cycle through: light -> dark -> system -> light
    if (settings.themeMode === 'light') {
      updateSettings({ themeMode: 'dark' });
    } else if (settings.themeMode === 'dark') {
      updateSettings({ themeMode: 'system' });
    } else {
      updateSettings({ themeMode: 'light' });
    }
  };

  const getLabel = () => {
    if (settings.themeMode === 'system') return 'Theme: System (Auto)';
    if (settings.themeMode === 'dark') return 'Theme: Dark';
    return 'Theme: Light';
  };

  return (
    <button
      onClick={handleCycleTheme}
      aria-label={getLabel()}
      title={`${getLabel()} (Click to change mode)`}
      className={`btn-interactive relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer ${className}`}
    >
      {settings.themeMode === 'system' ? (
        <div className="relative">
          <Laptop className="w-5 h-5 text-cyan-500 transition-transform duration-300 hover:scale-110" />
          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
            effectiveThemeMode === 'dark' ? 'bg-indigo-400' : 'bg-amber-400'
          }`} />
        </div>
      ) : settings.themeMode === 'dark' ? (
        <Moon className="w-5 h-5 text-indigo-400 transition-transform duration-300 hover:-rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-amber-500 transition-transform duration-300 hover:rotate-45" />
      )}
    </button>
  );
};
