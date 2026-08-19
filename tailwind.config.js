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
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        cinematic: {
          bg: '#050505',
          card: '#0c0c0c',
          surface: '#111111',
          surfaceHover: '#171717',
          border: '#1a1a1a',
          borderSubtle: '#262626',
          borderFocus: '#404040',
          textPrimary: '#FAFAFA',
          textSecondary: '#A7A6A6',
          textNav: '#B6B5B5',
          textMuted: '#666666',
          accent: '#FAFAFA',
          accentHover: '#E5E5E5',
        },
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
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
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
          bg: '#050505',
          surface: '#0c0c0c',
          card: '#111111',
          cardHover: '#171717',
          border: '#1c1c1c',
          borderSubtle: '#262626',
          textMuted: '#666666',
          textSecondary: '#A7A6A6',
          textPrimary: '#FAFAFA',
        }
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(.22, 1, .36, 1)',
      },
      animation: {
        'caret-blink': 'caretBlink 1s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s cubic-bezier(.22, 1, .36, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(.22, 1, .36, 1) forwards',
        'scale-in': 'scaleIn 0.35s cubic-bezier(.22, 1, .36, 1) forwards',
        'reveal': 'reveal 0.8s cubic-bezier(.22, 1, .36, 1) forwards',
      },
      keyframes: {
        caretBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.94', transform: 'scale(1.008)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'subtle-card': '0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 2px 8px 0 rgba(0, 0, 0, 0.3)',
        'elevated-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'white-pill': '0 2px 10px rgba(255, 255, 255, 0.15)',
        'glow-theme': '0 0 25px -5px var(--theme-primary-glow)',
      }
    },
  },
  plugins: [],
}
