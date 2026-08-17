import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSettings } from '../types/settings';
import {
  getStoredSettings,
  saveStoredSettings,
  resetStoredSettings,
  applySettingsToDOM,
  getEffectiveThemeMode
} from '../utils/settingsStorage';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  effectiveThemeMode: 'light' | 'dark';
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [effectiveThemeMode, setEffectiveThemeMode] = useState<'light' | 'dark'>(() =>
    getEffectiveThemeMode(settings.themeMode)
  );

  // Apply settings to DOM on initial mount & changes
  useEffect(() => {
    applySettingsToDOM(settings);
    setEffectiveThemeMode(getEffectiveThemeMode(settings.themeMode));
    saveStoredSettings(settings);
  }, [settings]);

  // Listen for OS system theme changes if themeMode is 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleOSThemeChange = () => {
      if (settings.themeMode === 'system') {
        applySettingsToDOM(settings);
        setEffectiveThemeMode(getEffectiveThemeMode('system'));
      }
    };

    try {
      mediaQuery.addEventListener('change', handleOSThemeChange);
    } catch {
      // Fallback for older browsers
      mediaQuery.addListener(handleOSThemeChange);
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', handleOSThemeChange);
      } catch {
        mediaQuery.removeListener(handleOSThemeChange);
      }
    };
  }, [settings.themeMode]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = resetStoredSettings();
    setSettings(defaults);
  }, []);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        effectiveThemeMode,
        isSettingsOpen,
        setIsSettingsOpen,
        openSettings,
        closeSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
