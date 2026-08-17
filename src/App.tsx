import React, { useState, useEffect, useCallback } from 'react';
import { Page, UserProfile, Achievement } from './types';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { useTheme } from './hooks/useTheme';
import { useTypingEngine } from './hooks/useTypingEngine';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { AchievementPopup } from './components/AchievementPopup';
import { PageTransition } from './components/animations/PageTransition';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { CoachPage } from './pages/CoachPage';
import { PracticePage } from './pages/PracticePage';
import { KeyboardPage } from './pages/KeyboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Leaderboard } from './pages/Leaderboard';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { CertificatePage } from './pages/CertificatePage';
import { About } from './pages/About';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { getCurrentUser, logoutUser } from './services/authService';
import { checkAndUnlockAchievements } from './services/achievementService';
import { recordKeyEvents } from './services/weakKeyService';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('test');
  const [activeCertificateId, setActiveCertificateId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  const { isSettingsOpen, openSettings, closeSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const engine = useTypingEngine();

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then((currentUser) => {
      if (mounted) {
        setUser(currentUser);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Listen to URL hash changes e.g. #/dashboard, #/coach, #/practice, #/keyboard
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();

      if (hash.startsWith('#/certificate')) {
        const parts = window.location.hash.split('/');
        if (parts.length >= 3 && parts[2]) {
          setActiveCertificateId(parts[2]);
        }
        setCurrentPage('certificate');
      } else if (hash === '#/dashboard') {
        setCurrentPage('dashboard');
      } else if (hash === '#/coach') {
        setCurrentPage('coach');
      } else if (hash === '#/practice') {
        setCurrentPage('practice');
      } else if (hash === '#/keyboard') {
        setCurrentPage('keyboard');
      } else if (hash === '#/history') {
        setCurrentPage('history');
      } else if (hash === '#/analytics') {
        setCurrentPage('analytics');
      } else if (hash === '#/leaderboard') {
        setCurrentPage('leaderboard');
      } else if (hash === '#/daily-challenge') {
        setCurrentPage('daily-challenge');
      } else if (hash === '#/achievements') {
        setCurrentPage('achievements');
      } else if (hash === '#/about') {
        setCurrentPage('about');
      } else if (hash === '#/login' || hash === '#/signin' || window.location.pathname === '/signin' || window.location.pathname === '/login') {
        setCurrentPage('login');
      } else if (hash === '#/signup' || window.location.pathname === '/signup') {
        setCurrentPage('signup');
      } else if (hash === '#/profile' || window.location.pathname === '/profile') {
        setCurrentPage('profile');
      } else if (hash === '#/test' || hash === '' || hash === '#' || window.location.pathname === '/' || window.location.pathname === '/test') {
        setCurrentPage('test');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback((page: Page, certId?: string) => {
    setCurrentPage(page);
    if (certId) {
      setActiveCertificateId(certId);
      window.location.hash = `#/certificate/${certId}`;
    } else {
      window.location.hash = `#/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = useCallback(() => {
    logoutUser();
    setUser(null);
    handleNavigate('test');
  }, [handleNavigate]);

  // Check achievements & record key telemetry whenever test completes
  useEffect(() => {
    if (engine.status === 'completed' && engine.result) {
      // Check achievements
      const newlyUnlocked = checkAndUnlockAchievements();
      if (newlyUnlocked.length > 0) {
        setUnlockedAchievement(newlyUnlocked[0]);
      }

      // Record character keystroke performance telemetry
      if (engine.typedWords.length > 0) {
        const events: { expected: string; typed: string; isCorrect: boolean }[] = [];
        engine.typedWords.forEach((typed, wIdx) => {
          const original = engine.words[wIdx] || '';
          for (let i = 0; i < Math.max(typed.length, original.length); i++) {
            const exp = original[i] || '';
            const act = typed[i] || '';
            if (exp) {
              events.push({
                expected: exp,
                typed: act,
                isCorrect: exp === act
              });
            }
          }
        });
        recordKeyEvents(events);
      }
    }
  }, [engine.status, engine.result, engine.typedWords, engine.words]);

  // Global keyboard shortcuts (e.g. Tab + Enter or Esc to restart; Cmd+, / Ctrl+, to open settings)
  useEffect(() => {
    let tabPressed = false;
    let tabTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Open settings on Ctrl+, or Cmd+,
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        openSettings();
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.getAttribute('aria-label') !== 'Typing test input arena') {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        engine.restartTest(true);
        return;
      }

      if (e.key === 'Tab') {
        tabPressed = true;
        if (tabTimeout) clearTimeout(tabTimeout);
        tabTimeout = setTimeout(() => {
          tabPressed = false;
        }, 1000);
      } else if (e.key === 'Enter' && tabPressed) {
        e.preventDefault();
        tabPressed = false;
        engine.restartTest(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      if (tabTimeout) clearTimeout(tabTimeout);
    };
  }, [engine, openSettings]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        soundEnabled={engine.soundEnabled}
        onToggleSound={() => engine.setSoundEnabled(!engine.soundEnabled)}
        user={user}
        onLogout={handleLogout}
        onOpenSettings={openSettings}
      />

      {/* Main Content Area with PageTransition */}
      <main className="flex-grow flex flex-col justify-center">
        <PageTransition key={currentPage}>
          {currentPage === 'test' && <Home engine={engine} onNavigate={handleNavigate} />}
          {currentPage === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} />}
          {currentPage === 'coach' && <CoachPage onNavigate={handleNavigate} />}
          {currentPage === 'practice' && <PracticePage onNavigate={handleNavigate} />}
          {currentPage === 'keyboard' && <KeyboardPage onNavigate={handleNavigate} />}
          {currentPage === 'history' && <HistoryPage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'leaderboard' && <Leaderboard userStats={engine.userStats} />}
          {currentPage === 'daily-challenge' && <DailyChallengePage user={user} onNavigate={handleNavigate} />}
          {currentPage === 'achievements' && <AchievementsPage onNavigate={handleNavigate} />}
          {currentPage === 'certificate' && (
            <CertificatePage
              initialCertificateId={activeCertificateId}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'about' && <About onNavigate={handleNavigate} />}
          {currentPage === 'login' && (
            <LoginPage
              onLoginSuccess={(u) => setUser(u)}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'signup' && (
            <SignupPage
              onSignupSuccess={(u) => setUser(u)}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'profile' && (
            <ProfilePage
              user={user}
              onLogout={handleLogout}
              onUpdateUser={(u) => setUser(u)}
              onNavigate={handleNavigate}
            />
          )}
        </PageTransition>
      </main>

      {/* Settings Modal (Global) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />

      {/* Achievement Unlocked Centered Modal Popup */}
      <AchievementPopup
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
        soundEnabled={engine.soundEnabled}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;
