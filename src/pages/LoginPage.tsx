import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { Page, UserProfile } from '../types';
import { loginUser } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (page: Page) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [identifier, setIdentifier] = useState<string>('connectwithfaishal@gmail.com');
  const [password, setPassword] = useState<string>('typefast2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const res = loginUser(identifier, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onNavigate('dashboard');
      } else {
        setError(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    }, 250);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 sm:py-16 animate-fade-in">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to TypeFast
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Access your cloud history, achievements, and personal dashboard
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@domain.com or username"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo account password is: typefast2026')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-interactive w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-5 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center">
          <p className="text-xs text-brand-700 dark:text-brand-300 font-semibold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo credentials pre-filled for instant test</span>
          </p>
        </div>

        {/* Divider & Guest / Signup CTA */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              Create Account
            </button>
          </p>

          <button
            onClick={() => onNavigate('test')}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
