import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { RotateCcw, MousePointerClick, Sparkles } from 'lucide-react';
import { TestStatus } from '../hooks/useTypingEngine';
import { useSettings } from '../context/SettingsContext';
import { CaretStyle } from '../types/settings';

interface TypingTestProps {
  status: TestStatus;
  words: string[];
  wordIndex: number;
  userInput: string;
  typedWords: string[];
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onInput: (val: string) => void;
  onRestart: () => void;
}

interface CaretCoordinates {
  left: number;
  top: number;
  width: number;
  height: number;
  className: string;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  status,
  words,
  wordIndex,
  userInput,
  typedWords,
  onKeyDown,
  onInput,
  onRestart,
}) => {
  const { settings } = useSettings();
  const caretStyle: CaretStyle = settings.caretStyle || 'line';

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<Record<string, HTMLElement | null>>({});

  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [caretCoords, setCaretCoords] = useState<CaretCoordinates | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Listen to prefers-reduced-motion OS changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mql.matches);
    try {
      mql.addEventListener('change', onChange);
    } catch {
      mql.addListener(onChange);
    }
    return () => {
      try {
        mql.removeEventListener('change', onChange);
      } catch {
        mql.removeListener(onChange);
      }
    };
  }, []);

  // Focus input automatically on mount and status reset
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  // Keep input focused when clicking on the container
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Scroll active line into smooth view if multi-line
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeWord = activeWordRef.current;

      const containerTop = container.offsetTop;
      const wordTop = activeWord.offsetTop;
      const offset = wordTop - containerTop;

      // When the user reaches line 2+, scroll smoothly
      if (offset > 50) {
        container.scrollTo({
          top: offset - 24,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [wordIndex]);

  // Dedicated caret position calculator based on rendered character bounding rect
  const updateCaretPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentWord = words[wordIndex] || '';
    const currentInputLength = userInput.length;
    let targetEl: HTMLElement | null = null;
    let isAtEndOfWord = false;
    let isOvertyped = false;

    if (currentInputLength < currentWord.length) {
      // Current active character in word
      targetEl = charRefs.current[`${wordIndex}-${currentInputLength}`] || null;
    } else if (currentInputLength === currentWord.length) {
      // At the end of the word, target is the trailing space element of this word
      targetEl = charRefs.current[`${wordIndex}-space`] || null;
      isAtEndOfWord = true;
    } else {
      // Overtyped extra characters
      const extraIdx = currentInputLength - currentWord.length - 1;
      targetEl = charRefs.current[`${wordIndex}-extra-${extraIdx}`] || null;
      isOvertyped = true;
    }

    // Fallback: first char of current word or active word container
    if (!targetEl) {
      targetEl = charRefs.current[`${wordIndex}-0`] || activeWordRef.current;
    }

    if (!targetEl) return;

    const targetRect = targetEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Position relative to container taking container scroll into account
    const scrollLeft = container.scrollLeft || 0;
    const scrollTop = container.scrollTop || 0;

    const rawLeft = targetRect.left - containerRect.left + scrollLeft;
    const rawTop = targetRect.top - containerRect.top + scrollTop;
    const rawWidth = targetRect.width || 14;
    const rawHeight = targetRect.height || 28;

    let left = rawLeft;
    let top = rawTop;
    let width = rawWidth;
    let height = rawHeight;
    let className = '';

    if (caretStyle === 'block') {
      className = 'caret-block';
      if (isOvertyped) {
        left = rawLeft + rawWidth;
        width = 12;
      } else if (isAtEndOfWord) {
        width = Math.max(rawWidth, 12);
      } else {
        width = rawWidth;
      }
    } else if (caretStyle === 'underline') {
      className = 'caret-underline';
      height = 3;
      top = rawTop + rawHeight - 3;
      if (isOvertyped) {
        left = rawLeft + rawWidth;
        width = 12;
      } else if (isAtEndOfWord) {
        width = Math.max(rawWidth, 12);
      } else {
        width = rawWidth;
      }
    } else {
      // Line Caret (Default)
      className = 'caret-line';
      width = 2.5;
      if (isOvertyped) {
        left = rawLeft + rawWidth;
      } else {
        left = rawLeft;
      }
    }

    setCaretCoords({
      left,
      top,
      width,
      height,
      className
    });
  }, [words, wordIndex, userInput, caretStyle]);

  // Recalculate caret on state changes
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      updateCaretPosition();
    });
    return () => cancelAnimationFrame(frame);
  }, [updateCaretPosition, wordIndex, userInput, words, caretStyle]);

  // Handle ResizeObserver, window resize, and container scroll events
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(updateCaretPosition);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateCaretPosition);
      });
      resizeObserver.observe(containerRef.current);
    }

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('scroll', handleResize, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (containerEl) {
        containerEl.removeEventListener('scroll', handleResize);
      }
    };
  }, [updateCaretPosition]);

  const shouldAnimate = settings.animationsEnabled && !prefersReducedMotion;
  const shouldBlink = settings.animationsEnabled && !prefersReducedMotion;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Hidden input to capture keystrokes reliably on desktop & mobile */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => onInput(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => {
          setIsFocused(true);
          requestAnimationFrame(updateCaretPosition);
        }}
        onBlur={() => setIsFocused(false)}
        className="opacity-0 absolute w-px h-px -top-96 left-0 text-transparent bg-transparent border-0 outline-none select-none"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Typing test input arena"
      />

      {/* Main Typing Container */}
      <div
        onClick={handleContainerClick}
        className="relative w-full rounded-3xl p-6 sm:p-10 bg-white/90 dark:bg-slate-900/85 border-2 border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-xl transition-all duration-300 cursor-text group select-none min-h-[230px] flex flex-col justify-between hover:border-brand-500/50 dark:hover:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/30"
      >
        {/* Unfocused Overlay Notice */}
        {!isFocused && status !== 'completed' && (
          <div className="absolute inset-0 z-20 backdrop-blur-[3px] bg-slate-900/35 rounded-3xl flex items-center justify-center transition-all animate-fade-in">
            <div className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm shadow-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
              <MousePointerClick className="w-4 h-4 text-brand-500" />
              <span>Click or tap anywhere to focus typing arena</span>
            </div>
          </div>
        )}

        {/* Typing Words Area */}
        <div
          ref={containerRef}
          className="relative w-full h-36 overflow-hidden flex flex-wrap gap-y-2 sm:gap-y-3.5 font-mono text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide transition-all"
        >
          {/* Real Animated Overlay Caret */}
          {caretCoords && isFocused && status !== 'completed' && (
            <span
              className={`typing-caret ${caretCoords.className} ${
                shouldAnimate ? 'typing-caret-animated' : ''
              } ${shouldBlink ? 'caret-blinking' : ''}`}
              style={{
                left: `${caretCoords.left}px`,
                top: `${caretCoords.top}px`,
                width: `${caretCoords.width}px`,
                height: `${caretCoords.height}px`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Words and Characters Matrix */}
          {words.slice(0, Math.max(80, wordIndex + 40)).map((word, wIdx) => {
            const isCurrentWord = wIdx === wordIndex;
            const isPastWord = wIdx < wordIndex;
            const pastInput = isPastWord ? typedWords[wIdx] || '' : '';

            return (
              <div
                key={wIdx}
                ref={isCurrentWord ? activeWordRef : undefined}
                className={`relative inline-flex items-center rounded-lg px-1 py-0.5 transition-colors duration-150 mr-2 sm:mr-3 ${
                  isCurrentWord
                    ? 'bg-slate-100/90 dark:bg-slate-800/80 ring-1 ring-slate-300 dark:ring-slate-700/80 shadow-sm'
                    : ''
                }`}
              >
                {/* Render expected word characters */}
                {word.split('').map((char, cIdx) => {
                  let charClass = 'text-slate-400 dark:text-slate-500'; // untyped

                  if (isPastWord) {
                    if (cIdx < pastInput.length) {
                      charClass =
                        pastInput[cIdx] === char
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-rose-600 dark:text-rose-400 bg-rose-500/15 underline decoration-rose-500 font-semibold';
                    } else {
                      // Missed characters in past word
                      charClass = 'text-rose-400/70 dark:text-rose-500/70 opacity-60';
                    }
                  } else if (isCurrentWord) {
                    if (cIdx < userInput.length) {
                      charClass =
                        userInput[cIdx] === char
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-rose-600 dark:text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-bold';
                    } else if (cIdx === userInput.length) {
                      charClass = 'text-slate-900 dark:text-white font-medium';
                    }
                  }

                  return (
                    <span
                      key={cIdx}
                      ref={(el) => {
                        if (el) charRefs.current[`${wIdx}-${cIdx}`] = el;
                        else delete charRefs.current[`${wIdx}-${cIdx}`];
                      }}
                      className={`relative transition-colors duration-100 ${charClass}`}
                    >
                      {char}
                    </span>
                  );
                })}

                {/* Extra incorrect characters typed beyond original word length */}
                {isCurrentWord && userInput.length > word.length && (
                  userInput.slice(word.length).split('').map((extraChar, extraIdx) => (
                    <span
                      key={`extra-${extraIdx}`}
                      ref={(el) => {
                        if (el) charRefs.current[`${wIdx}-extra-${extraIdx}`] = el;
                        else delete charRefs.current[`${wIdx}-extra-${extraIdx}`];
                      }}
                      className="text-rose-600 dark:text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-bold opacity-80"
                    >
                      {extraChar}
                    </span>
                  ))
                )}

                {/* Past word extra characters */}
                {isPastWord && pastInput.length > word.length && (
                  <span className="text-rose-500/70 line-through text-sm self-center ml-0.5">
                    {pastInput.slice(word.length)}
                  </span>
                )}

                {/* Space character element for precise measurement & space caret position */}
                <span
                  ref={(el) => {
                    if (el) charRefs.current[`${wIdx}-space`] = el;
                    else delete charRefs.current[`${wIdx}-space`];
                  }}
                  className="inline-block opacity-0 pointer-events-none select-none"
                  style={{ width: '0.45em', minWidth: '8px' }}
                  aria-hidden="true"
                >
                  {'\u00A0'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Typing Instructions and Quick Restart Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {status === 'idle' ? (
              <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start typing to begin test</span>
              </span>
            ) : (
              <span className="flex items-center gap-2 font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Test in progress...</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestart();
                inputRef.current?.focus();
              }}
              className="btn-interactive flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold transition-all duration-150 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Restart test (Esc or click)"
              aria-label="Restart typing test"
            >
              <RotateCcw className="w-3.5 h-3.5 text-brand-500" />
              <span>Restart Test</span>
            </button>

            <span className="hidden sm:flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono text-[10px] border border-slate-300 dark:border-slate-700">Esc</kbd>
              <span>to reset</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
