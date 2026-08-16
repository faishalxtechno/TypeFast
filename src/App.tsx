import React, { useState, useEffect, useCallback } from 'react';
import { Page } from './types';
import { useTheme } from './hooks/useTheme';
import { useTypingEngine } from './hooks/useTypingEngine';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Leaderboard } from './pages/Leaderboard';
import { About } from './pages/About';
import { CertificatePage } from './pages/CertificatePage';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('test');
  const [activeCertificateId, setActiveCertificateId] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const engine = useTypingEngine();

  // Listen to URL hash changes e.g. #/certificate/TF-2026-8A72F4
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#/certificate')) {
        const parts = window.location.hash.split('/');
        if (parts.length >= 3 && parts[2]) {
          setActiveCertificateId(parts[2]);
        }
        setCurrentPage('certificate');
      } else if (hash === '#/leaderboard') {
        setCurrentPage('leaderboard');
      } else if (hash === '#/about') {
        setCurrentPage('about');
      } else if (hash === '#/test' || hash === '' || hash === '#') {
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

  // Global keyboard shortcuts (e.g. Tab + Enter or Esc to restart)
  useEffect(() => {
    let tabPressed = false;
    let tabTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is inside a form input
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
  }, [engine]);

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
      />

      {/* Main Content Area with Smooth Page Transition */}
      <main className="flex-grow flex flex-col justify-center animate-fade-in">
        {currentPage === 'test' && <Home engine={engine} />}
        {currentPage === 'certificate' && (
          <CertificatePage
            initialCertificateId={activeCertificateId}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'leaderboard' && <Leaderboard userStats={engine.userStats} />}
        {currentPage === 'about' && <About />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
