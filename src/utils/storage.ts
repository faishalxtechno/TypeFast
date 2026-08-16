import { UserStats, TestResult, Theme, TestDuration, Difficulty, CertificateData } from '../types';

const STATS_KEY = 'typefast_stats';
const THEME_KEY = 'typefast_theme';
const SETTINGS_KEY = 'typefast_settings';
const CERTIFICATES_KEY = 'typefast_certificates';

export interface StoredSettings {
  duration: TestDuration;
  difficulty: Difficulty;
  soundEnabled: boolean;
}

const DEFAULT_STATS: UserStats = {
  bestWpm: 0,
  bestAccuracy: 0,
  testsCompleted: 0,
  totalTimeTypedSeconds: 0,
  history: []
};

const DEFAULT_SETTINGS: StoredSettings = {
  duration: 60,
  difficulty: 'medium',
  soundEnabled: true
};

export function getStoredStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      bestWpm: typeof parsed.bestWpm === 'number' ? parsed.bestWpm : 0,
      bestAccuracy: typeof parsed.bestAccuracy === 'number' ? parsed.bestAccuracy : 0,
      testsCompleted: typeof parsed.testsCompleted === 'number' ? parsed.testsCompleted : 0,
      totalTimeTypedSeconds: typeof parsed.totalTimeTypedSeconds === 'number' ? parsed.totalTimeTypedSeconds : 0,
      history: Array.isArray(parsed.history) ? parsed.history : []
    };
  } catch (e) {
    console.warn('Failed to load stats from localStorage:', e);
    return DEFAULT_STATS;
  }
}

export function saveTestResult(result: TestResult): { updatedStats: UserStats; isNewBest: boolean } {
  const current = getStoredStats();
  const isNewBest = result.wpm > current.bestWpm;
  
  const updatedStats: UserStats = {
    bestWpm: Math.max(current.bestWpm, result.wpm),
    bestAccuracy: current.testsCompleted === 0 
      ? result.accuracy 
      : Math.max(current.bestAccuracy, result.accuracy),
    testsCompleted: current.testsCompleted + 1,
    totalTimeTypedSeconds: current.totalTimeTypedSeconds + result.duration,
    history: [result, ...current.history.slice(0, 49)] // Keep last 50 tests
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
  } catch (e) {
    console.warn('Failed to save test result to localStorage:', e);
  }

  return { updatedStats, isNewBest };
}

export function getStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch {
    // fallback
  }
  return 'dark';
}

export function saveStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.warn('Failed to save theme:', e);
  }
}

export function getStoredSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      duration: [15, 30, 60, 120].includes(parsed.duration) ? parsed.duration : 60,
      difficulty: ['easy', 'medium', 'hard'].includes(parsed.difficulty) ? parsed.difficulty : 'medium',
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: StoredSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function clearUserStats(): UserStats {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch (e) {
    console.warn('Failed to clear stats:', e);
  }
  return DEFAULT_STATS;
}

// -------------------------------------------------------------
// Certificates Storage Management
// -------------------------------------------------------------

export function getStoredCertificates(): CertificateData[] {
  try {
    const raw = localStorage.getItem(CERTIFICATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load certificates from localStorage:', e);
    return [];
  }
}

export function saveCertificate(cert: CertificateData): void {
  try {
    const list = getStoredCertificates();
    // Prevent duplicates for the same certificate ID or test result ID
    const filtered = list.filter(c => c.id !== cert.id && c.testResultId !== cert.testResultId);
    const updated = [cert, ...filtered];
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save certificate to localStorage:', e);
  }
}

export function getCertificateById(id: string): CertificateData | null {
  const list = getStoredCertificates();
  return list.find(c => c.id.toUpperCase() === id.toUpperCase()) || null;
}

export function getCertificateByTestId(testResultId: string): CertificateData | null {
  const list = getStoredCertificates();
  return list.find(c => c.testResultId === testResultId) || null;
}

export function deleteCertificate(id: string): CertificateData[] {
  try {
    const list = getStoredCertificates();
    const updated = list.filter(c => c.id !== id);
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to delete certificate:', e);
    return [];
  }
}
