/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        theme: {
          primary: 'var(--theme-primary)',
          primaryHover: 'var(--theme-primary-hover)',
          secondary: 'var(--theme-secondary)',
          bg: 'var(--theme-bg)',
          surface: 'var(--theme-surface)',
          card: 'var(--theme-card)',
          border: 'var(--theme-border)',
          borderSubtle: 'var(--theme-border-subtle)',
          textMain: 'var(--theme-text-main)',
          textSub: 'var(--theme-text-sub)',
          textMuted: 'var(--theme-text-muted)',
          caret: 'var(--theme-caret)',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          cyan: '#06b6d4',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          rose: '#f43f5e',
          blue: '#3b82f6',
        },
        dark: {
          bg: '#090d16',
          surface: '#0f172a',
          card: '#131b2e',
          cardHover: '#1a243d',
          border: '#1e293b',
          borderSubtle: '#1e293b80',
          textMuted: '#64748b',
          textSecondary: '#94a3b8',
          textPrimary: '#f8fafc',
        }
      },
      animation: {
        'caret-blink': 'caretBlink 1s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        caretBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.015)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-brand': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-theme': '0 0 25px -5px var(--theme-primary-glow)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
