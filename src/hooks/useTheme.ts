import { useSettings } from '../context/SettingsContext';
import { Theme } from '../types';
import { ThemeMode, ThemeName } from '../types/settings';

export function useTheme() {
  const { settings, updateSettings, effectiveThemeMode } = useSettings();

  const theme: Theme = effectiveThemeMode;
  const themeMode: ThemeMode = settings.themeMode;
  const selectedTheme: ThemeName = settings.selectedTheme;

  const toggleTheme = () => {
    // Quick toggle between light and dark modes
    if (themeMode === 'system') {
      updateSettings({ themeMode: effectiveThemeMode === 'dark' ? 'light' : 'dark' });
    } else {
      updateSettings({ themeMode: themeMode === 'dark' ? 'light' : 'dark' });
    }
  };

  const setTheme = (newMode: Theme) => {
    updateSettings({ themeMode: newMode });
  };

  const setThemeMode = (newMode: ThemeMode) => {
    updateSettings({ themeMode: newMode });
  };

  const setSelectedTheme = (themeName: ThemeName) => {
    updateSettings({ selectedTheme: themeName });
  };

  return {
    theme,
    themeMode,
    selectedTheme,
    toggleTheme,
    setTheme,
    setThemeMode,
    setSelectedTheme,
    effectiveThemeMode
  };
}
