import { TestDuration, Difficulty } from './index';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeName = 'classic' | 'midnight' | 'ocean' | 'forest' | 'sunset' | 'minimal';

export type CaretStyle = 'line' | 'block' | 'underline';

export interface AppSettings {
  themeMode: ThemeMode;
  selectedTheme: ThemeName;
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  caretStyle: CaretStyle;
  keyboardEnabled: boolean;
  animationsEnabled: boolean;
  duration: TestDuration;
  difficulty: Difficulty;
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  selectedTheme: 'classic',
  soundEnabled: false,
  soundVolume: 0.5,
  caretStyle: 'line',
  keyboardEnabled: true,
  animationsEnabled: true,
  duration: 60,
  difficulty: 'medium'
};

export interface ThemeDefinition {
  id: ThemeName;
  name: string;
  description: string;
  accentColor: string;
  previewClass: string;
  badgeColor: string;
}

export const AVAILABLE_THEMES: ThemeDefinition[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean typing-test appearance with vibrant emerald accents.',
    accentColor: '#10b981',
    previewClass: 'from-emerald-500 to-teal-700',
    badgeColor: 'bg-emerald-500'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark premium developer-style appearance with electric indigo tones.',
    accentColor: '#6366f1',
    previewClass: 'from-indigo-500 to-slate-900',
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blue and cyan modern oceanic interface.',
    accentColor: '#06b6d4',
    previewClass: 'from-cyan-500 to-blue-700',
    badgeColor: 'bg-cyan-500'
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Dark green natural interface inspired by deep woodland sage.',
    accentColor: '#22c55e',
    previewClass: 'from-green-600 to-emerald-950',
    badgeColor: 'bg-green-600'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm coral, amber, and purple twilight twilight aesthetic.',
    accentColor: '#f97316',
    previewClass: 'from-orange-500 via-rose-500 to-purple-600',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Very clean, distraction-free monochrome slate interface.',
    accentColor: '#94a3b8',
    previewClass: 'from-slate-400 to-slate-800',
    badgeColor: 'bg-slate-400'
  }
];
