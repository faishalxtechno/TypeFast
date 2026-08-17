import React, { useState, useEffect, useCallback } from 'react';

interface KeyConfig {
  key: string;
  code: string;
  display: string;
  shiftDisplay?: string;
  width?: string;
  isSpecial?: boolean;
}

const KEYBOARD_LAYOUT: KeyConfig[][] = [
  // Row 1: Numbers & Symbols
  [
    { key: '`', code: 'Backquote', display: '`', shiftDisplay: '~' },
    { key: '1', code: 'Digit1', display: '1', shiftDisplay: '!' },
    { key: '2', code: 'Digit2', display: '2', shiftDisplay: '@' },
    { key: '3', code: 'Digit3', display: '3', shiftDisplay: '#' },
    { key: '4', code: 'Digit4', display: '4', shiftDisplay: '$' },
    { key: '5', code: 'Digit5', display: '5', shiftDisplay: '%' },
    { key: '6', code: 'Digit6', display: '6', shiftDisplay: '^' },
    { key: '7', code: 'Digit7', display: '7', shiftDisplay: '&' },
    { key: '8', code: 'Digit8', display: '8', shiftDisplay: '*' },
    { key: '9', code: 'Digit9', display: '9', shiftDisplay: '(' },
    { key: '0', code: 'Digit0', display: '0', shiftDisplay: ')' },
    { key: '-', code: 'Minus', display: '-', shiftDisplay: '_' },
    { key: '=', code: 'Equal', display: '=', shiftDisplay: '+' },
    { key: 'Backspace', code: 'Backspace', display: '⌫ Backspace', width: 'w-14 sm:w-20', isSpecial: true }
  ],
  // Row 2: QWERTY
  [
    { key: 'Tab', code: 'Tab', display: 'Tab', width: 'w-10 sm:w-14', isSpecial: true },
    { key: 'q', code: 'KeyQ', display: 'Q' },
    { key: 'w', code: 'KeyW', display: 'W' },
    { key: 'e', code: 'KeyE', display: 'E' },
    { key: 'r', code: 'KeyR', display: 'R' },
    { key: 't', code: 'KeyT', display: 'T' },
    { key: 'y', code: 'KeyY', display: 'Y' },
    { key: 'u', code: 'KeyU', display: 'U' },
    { key: 'i', code: 'KeyI', display: 'I' },
    { key: 'o', code: 'KeyO', display: 'O' },
    { key: 'p', code: 'KeyP', display: 'P' },
    { key: '[', code: 'BracketLeft', display: '[', shiftDisplay: '{' },
    { key: ']', code: 'BracketRight', display: ']', shiftDisplay: '}' },
    { key: '\\', code: 'Backslash', display: '\\', shiftDisplay: '|' }
  ],
  // Row 3: ASDF
  [
    { key: 'CapsLock', code: 'CapsLock', display: 'Caps', width: 'w-12 sm:w-16', isSpecial: true },
    { key: 'a', code: 'KeyA', display: 'A' },
    { key: 's', code: 'KeyS', display: 'S' },
    { key: 'd', code: 'KeyD', display: 'D' },
    { key: 'f', code: 'KeyF', display: 'F' },
    { key: 'g', code: 'KeyG', display: 'G' },
    { key: 'h', code: 'KeyH', display: 'H' },
    { key: 'j', code: 'KeyJ', display: 'J' },
    { key: 'k', code: 'KeyK', display: 'K' },
    { key: 'l', code: 'KeyL', display: 'L' },
    { key: ';', code: 'Semicolon', display: ';', shiftDisplay: ':' },
    { key: "'", code: 'Quote', display: "'", shiftDisplay: '"' },
    { key: 'Enter', code: 'Enter', display: '↵ Enter', width: 'w-14 sm:w-20', isSpecial: true }
  ],
  // Row 4: ZXCV
  [
    { key: 'Shift', code: 'ShiftLeft', display: '⇧ Shift', width: 'w-14 sm:w-20', isSpecial: true },
    { key: 'z', code: 'KeyZ', display: 'Z' },
    { key: 'x', code: 'KeyX', display: 'X' },
    { key: 'c', code: 'KeyC', display: 'C' },
    { key: 'v', code: 'KeyV', display: 'V' },
    { key: 'b', code: 'KeyB', display: 'B' },
    { key: 'n', code: 'KeyN', display: 'N' },
    { key: 'm', code: 'KeyM', display: 'M' },
    { key: ',', code: 'Comma', display: ',', shiftDisplay: '<' },
    { key: '.', code: 'Period', display: '.', shiftDisplay: '>' },
    { key: '/', code: 'Slash', display: '/', shiftDisplay: '?' },
    { key: 'Shift', code: 'ShiftRight', display: '⇧ Shift', width: 'w-14 sm:w-20', isSpecial: true }
  ],
  // Row 5: Spacebar
  [
    { key: ' ', code: 'Space', display: 'Space', width: 'w-48 sm:w-72 md:w-80', isSpecial: true }
  ]
];

interface VirtualKeyboardProps {
  lastKeystroke?: { key: string; isCorrect: boolean; timestamp: number } | null;
  onKeyPress?: (key: string) => void;
  className?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  lastKeystroke,
  onKeyPress,
  className = ''
}) => {
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});
  const [feedbackKeys, setFeedbackKeys] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [isShiftActive, setIsShiftActive] = useState(false);

  // Normalize key lookup
  const normalizeKey = useCallback((k: string): string => {
    if (!k) return '';
    if (k === ' ') return ' ';
    return k.toLowerCase();
  }, []);

  // Handle visual feedback when a character is typed
  useEffect(() => {
    if (!lastKeystroke) return;

    const norm = normalizeKey(lastKeystroke.key);
    const feedbackType = lastKeystroke.isCorrect ? 'correct' : 'incorrect';

    setFeedbackKeys((prev) => ({
      ...prev,
      [norm]: feedbackType
    }));

    const timer = setTimeout(() => {
      setFeedbackKeys((prev) => {
        const next = { ...prev };
        delete next[norm];
        return next;
      });
    }, 280);

    return () => clearTimeout(timer);
  }, [lastKeystroke, normalizeKey]);

  // Physical keyboard keydown/keyup listener for smooth mechanical feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyLower = e.key.toLowerCase();
      if (e.key === 'Shift') {
        setIsShiftActive(true);
      }

      setActiveKeys((prev) => {
        if (prev[keyLower] && prev[e.code]) return prev;
        return {
          ...prev,
          [keyLower]: true,
          [e.code]: true
        };
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyLower = e.key.toLowerCase();
      if (e.key === 'Shift') {
        setIsShiftActive(false);
      }

      setActiveKeys((prev) => {
        const next = { ...prev };
        delete next[keyLower];
        delete next[e.code];
        return next;
      });
    };

    const handleBlur = () => {
      setActiveKeys({});
      setIsShiftActive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-3 sm:p-5 rounded-3xl bg-white/75 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-lg space-y-1.5 transition-all select-none ${className}`}
      aria-label="Virtual Keyboard Visualization"
    >
      {KEYBOARD_LAYOUT.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center justify-center gap-1 sm:gap-1.5 w-full flex-nowrap"
        >
          {row.map((item, keyIdx) => {
            const normKey = normalizeKey(item.key);
            const isPressed = !!activeKeys[normKey] || !!activeKeys[item.code] || !!activeKeys[item.key];
            const feedback = feedbackKeys[normKey];

            let feedbackClass = '';
            if (feedback === 'correct') {
              feedbackClass = 'virtual-key-correct ring-2 ring-emerald-500 bg-emerald-500 text-white';
            } else if (feedback === 'incorrect') {
              feedbackClass = 'virtual-key-incorrect ring-2 ring-rose-500 bg-rose-500 text-white';
            }

            const baseWidth = item.width || 'w-7 sm:w-10 md:w-12';
            const baseHeight = 'h-8 sm:h-10 md:h-11';

            return (
              <button
                key={keyIdx}
                type="button"
                tabIndex={-1}
                onClick={() => onKeyPress && onKeyPress(item.key)}
                className={`virtual-key relative flex flex-col items-center justify-center ${baseWidth} ${baseHeight} rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-tight border shadow-xs ${
                  isPressed ? 'virtual-key-pressed' : ''
                } ${feedbackClass} ${
                  !isPressed && !feedback
                    ? item.isSpecial
                      ? 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-300/70 dark:hover:bg-slate-700/70'
                      : 'bg-slate-100 dark:bg-slate-950/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50'
                    : ''
                }`}
              >
                {/* Dual character indicator for numbers & symbols on larger screens */}
                {item.shiftDisplay && !item.isSpecial && (
                  <span className="hidden sm:block text-[8px] opacity-60 leading-none mb-0.5">
                    {item.shiftDisplay}
                  </span>
                )}
                <span className="leading-none">
                  {isShiftActive && item.shiftDisplay ? item.shiftDisplay : item.display}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
