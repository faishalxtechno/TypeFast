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

  // Caret coordinate calculator
  const updateCaretPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentWord = words[wordIndex] || '';
    const currentInputLength = userInput.length;
    let targetEl: HTMLElement | null = null;
    let isAtEndOfWord = false;
    let isOvertyped = false;

    if (currentInputLength < currentWord.length) {
      targetEl = charRefs.current[`${wordIndex}-${currentInputLength}`] || null;
    } else if (currentInputLength === currentWord.length) {
      targetEl = charRefs.current[`${wordIndex}-space`] || null;
      isAtEndOfWord = true;
    } else {
      const extraIdx = currentInputLength - currentWord.length - 1;
      targetEl = charRefs.current[`${wordIndex}-extra-${extraIdx}`] || null;
      isOvertyped = true;
    }

    if (!targetEl) {
      targetEl = charRefs.current[`${wordIndex}-0`] || activeWordRef.current;
    }

    if (!targetEl) return;

    const targetRect = targetEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

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
      // Line Caret
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

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      updateCaretPosition();
    });
    return () => cancelAnimationFrame(frame);
  }, [updateCaretPosition, wordIndex, userInput, words, caretStyle]);

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
      {/* Hidden input to capture keystrokes reliably */}
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

      {/* Main Cinematic Typing Arena Container */}
      <div
        onClick={handleContainerClick}
        className="relative w-full rounded-3xl p-6 sm:p-10 bg-[#0a0a0a]/90 border border-[#1f1f1f] backdrop-blur-xl shadow-elevated-dark transition-all duration-300 cursor-text group select-none min-h-[220px] flex flex-col justify-between hover:border-[#333333] focus-within:border-white/40"
      >
        {/* Unfocused Overlay Notice */}
        {!isFocused && status !== 'completed' && (
          <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-black/60 rounded-3xl flex items-center justify-center transition-all animate-fade-in">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] text-[#FAFAFA] font-medium text-xs sm:text-sm shadow-xl border border-[#2a2a2a]">
              <MousePointerClick className="w-4 h-4 text-white" />
              <span>Click anywhere or press any key to focus</span>
            </div>
          </div>
        )}

        {/* Typing Words Area */}
        <div
          ref={containerRef}
          className="relative w-full h-32 sm:h-36 overflow-hidden flex flex-wrap gap-y-2 sm:gap-y-3 font-mono text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide transition-all"
        >
          {/* Animated Overlay Caret */}
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

          {/* Words Matrix */}
          {words.slice(0, Math.max(80, wordIndex + 40)).map((word, wIdx) => {
            const isCurrentWord = wIdx === wordIndex;
            const isPastWord = wIdx < wordIndex;
            const pastInput = isPastWord ? typedWords[wIdx] || '' : '';

            return (
              <div
                key={wIdx}
                ref={isCurrentWord ? activeWordRef : undefined}
                className={`relative inline-flex items-center rounded-lg px-1 py-0.5 transition-colors duration-150 mr-2 sm:mr-3 ${
                  isCurrentWord ? 'bg-white/[0.04] ring-1 ring-white/10' : ''
                }`}
              >
                {word.split('').map((char, cIdx) => {
                  let charClass = 'text-[#444444]'; // untyped muted gray

                  if (isPastWord) {
                    if (cIdx < pastInput.length) {
                      charClass =
                        pastInput[cIdx] === char
                          ? 'text-[#FAFAFA] font-medium'
                          : 'text-rose-400 underline decoration-rose-500 font-medium';
                    } else {
                      charClass = 'text-rose-400/60 opacity-60';
                    }
                  } else if (isCurrentWord) {
                    if (cIdx < userInput.length) {
                      charClass =
                        userInput[cIdx] === char
                          ? 'text-[#FAFAFA] font-medium'
                          : 'text-rose-400 bg-rose-500/15 underline decoration-rose-500 font-bold';
                    } else if (cIdx === userInput.length) {
                      charClass = 'text-[#FAFAFA]';
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

                {/* Overtyped extra characters */}
                {isCurrentWord && userInput.length > word.length && (
                  userInput.slice(word.length).split('').map((extraChar, extraIdx) => (
                    <span
                      key={`extra-${extraIdx}`}
                      ref={(el) => {
                        if (el) charRefs.current[`${wIdx}-extra-${extraIdx}`] = el;
                        else delete charRefs.current[`${wIdx}-extra-${extraIdx}`];
                      }}
                      className="text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-bold opacity-90"
                    >
                      {extraChar}
                    </span>
                  ))
                )}

                {/* Space boundary for precise caret positioning */}
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

        {/* Footer controls: Status and Restart */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1c1c1c] text-xs text-[#A7A6A6]">
          <div className="flex items-center gap-2">
            {status === 'idle' ? (
              <span className="flex items-center gap-1.5 text-[#B6B5B5]">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Start typing to begin test</span>
              </span>
            ) : (
              <span className="flex items-center gap-2 text-[#FAFAFA]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Test in progress</span>
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] text-[#FAFAFA] text-xs font-medium transition-colors border border-[#262626] cursor-pointer"
              title="Restart test (Esc)"
              aria-label="Restart typing test"
            >
              <RotateCcw className="w-3 h-3 text-[#A7A6A6]" />
              <span>Restart</span>
            </button>

            <span className="hidden sm:flex items-center gap-1 text-[#666666] text-xs font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-[#141414] text-[10px] border border-[#242424]">Esc</kbd>
              <span>to reset</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
