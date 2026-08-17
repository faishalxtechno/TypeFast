import { AppSettings, DEFAULT_SETTINGS, ThemeMode, ThemeName, CaretStyle } from '../types/settings';
import { TestDuration, Difficulty } from '../types';

const SETTINGS_KEY = 'typefast_v2_settings';
const LEGACY_SETTINGS_KEY = 'typefast_settings';
const LEGACY_THEME_KEY = 'typefast_theme';

const VALID_THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];
const VALID_THEMES: ThemeName[] = ['classic', 'midnight', 'ocean', 'forest', 'sunset', 'minimal'];
const VALID_CARET_STYLES: CaretStyle[] = ['line', 'block', 'underline'];
const VALID_DURATIONS: TestDuration[] = [15, 30, 60, 120];
const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * Returns whether the system currently prefers dark mode.
 */
export function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Resolves the effective theme mode ('light' | 'dark') based on user preference and OS setting.
 */
export function getEffectiveThemeMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return getSystemPrefersDark() ? 'dark' : 'light';
  }
  return mode;
}

/**
 * Safe retrieval of settings from localStorage with schema validation and legacy migration.
 */
export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return sanitizeSettings(parsed);
    }

    // Attempt legacy migration
    const legacyRaw = localStorage.getItem(LEGACY_SETTINGS_KEY);
    const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);

    let migrated: Partial<AppSettings> = {};

    if (legacyRaw) {
      try {
        const legacy = JSON.parse(legacyRaw);
        migrated = {
          duration: VALID_DURATIONS.includes(legacy.duration) ? legacy.duration : DEFAULT_SETTINGS.duration,
          difficulty: VALID_DIFFICULTIES.includes(legacy.difficulty) ? legacy.difficulty : DEFAULT_SETTINGS.difficulty,
          soundEnabled: typeof legacy.soundEnabled === 'boolean' ? legacy.soundEnabled : DEFAULT_SETTINGS.soundEnabled
        };
      } catch {
        // ignore legacy parsing error
      }
    }

    if (legacyTheme === 'light' || legacyTheme === 'dark') {
      migrated.themeMode = legacyTheme;
    }

    const merged = { ...DEFAULT_SETTINGS, ...migrated };
    saveStoredSettings(merged);
    return merged;
  } catch (e) {
    console.warn('Failed to load settings from storage, falling back to defaults:', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Sanitizes and validates an arbitrary settings object.
 */
function sanitizeSettings(obj: unknown): AppSettings {
  if (!obj || typeof obj !== 'object') return DEFAULT_SETTINGS;
  const s = obj as Record<string, unknown>;

  const themeMode = VALID_THEME_MODES.includes(s.themeMode as ThemeMode)
    ? (s.themeMode as ThemeMode)
    : DEFAULT_SETTINGS.themeMode;

  const selectedTheme = VALID_THEMES.includes(s.selectedTheme as ThemeName)
    ? (s.selectedTheme as ThemeName)
    : DEFAULT_SETTINGS.selectedTheme;

  const caretStyle = VALID_CARET_STYLES.includes(s.caretStyle as CaretStyle)
    ? (s.caretStyle as CaretStyle)
    : DEFAULT_SETTINGS.caretStyle;

  const soundEnabled = typeof s.soundEnabled === 'boolean'
    ? s.soundEnabled
    : DEFAULT_SETTINGS.soundEnabled;

  const soundVolume = typeof s.soundVolume === 'number' && !isNaN(s.soundVolume)
    ? Math.max(0, Math.min(1, s.soundVolume))
    : DEFAULT_SETTINGS.soundVolume;

  const keyboardEnabled = typeof s.keyboardEnabled === 'boolean'
    ? s.keyboardEnabled
    : DEFAULT_SETTINGS.keyboardEnabled;

  const animationsEnabled = typeof s.animationsEnabled === 'boolean'
    ? s.animationsEnabled
    : DEFAULT_SETTINGS.animationsEnabled;

  const duration = VALID_DURATIONS.includes(s.duration as TestDuration)
    ? (s.duration as TestDuration)
    : DEFAULT_SETTINGS.duration;

  const difficulty = VALID_DIFFICULTIES.includes(s.difficulty as Difficulty)
    ? (s.difficulty as Difficulty)
    : DEFAULT_SETTINGS.difficulty;

  return {
    themeMode,
    selectedTheme,
    soundEnabled,
    soundVolume,
    caretStyle,
    keyboardEnabled,
    animationsEnabled,
    duration,
    difficulty
  };
}

/**
 * Saves settings to localStorage safely.
 */
export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Also save legacy key for backward compatibility
    localStorage.setItem(LEGACY_SETTINGS_KEY, JSON.stringify({
      duration: settings.duration,
      difficulty: settings.difficulty,
      soundEnabled: settings.soundEnabled
    }));
  } catch (e) {
    console.warn('Failed to save settings to localStorage:', e);
  }
}

/**
 * Resets settings to factory default values.
 */
export function resetStoredSettings(): AppSettings {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      // ignore
    }
  }
  applySettingsToDOM(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

/**
 * Synchronizes application settings to the DOM attributes and classes.
 */
export function applySettingsToDOM(settings: AppSettings): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const effectiveMode = getEffectiveThemeMode(settings.themeMode);

  // Apply dark mode class
  if (effectiveMode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set theme data attribute for CSS variable styling
  root.setAttribute('data-theme', settings.selectedTheme);
  root.setAttribute('data-theme-mode', settings.themeMode);
  root.setAttribute('data-caret', settings.caretStyle);
  root.setAttribute('data-animations', settings.animationsEnabled ? 'true' : 'false');
}
