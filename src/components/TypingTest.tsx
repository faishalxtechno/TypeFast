import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, MousePointerClick } from 'lucide-react';
import { TestStatus } from '../hooks/useTypingEngine';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);

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

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Hidden input to capture keystrokes on desktop & mobile */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => onInput(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="opacity-0 absolute w-px h-px -top-96 left-0 text-transparent bg-transparent border-0 outline-none select-none"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Typing test input"
      />

      {/* Main Typing Container */}
      <div
        onClick={handleContainerClick}
        className="relative w-full rounded-3xl p-6 sm:p-10 bg-white/90 dark:bg-slate-900/80 border-2 border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xl transition-all duration-200 cursor-text group select-none min-h-[220px] flex flex-col justify-between hover:border-brand-500/40 dark:hover:border-brand-500/40"
      >
        {/* Unfocused Overlay Notice */}
        {!isFocused && status !== 'completed' && (
          <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-slate-900/30 rounded-3xl flex items-center justify-center transition-all animate-fade-in">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm shadow-xl border border-slate-200 dark:border-slate-700 animate-pulse">
              <MousePointerClick className="w-4 h-4 text-brand-500" />
              <span>Click or tap to focus typing area</span>
            </div>
          </div>
        )}

        {/* Typing Words Area */}
        <div
          ref={containerRef}
          className="w-full h-36 overflow-hidden flex flex-wrap gap-x-3 gap-y-2 sm:gap-x-4 sm:gap-y-3 font-mono text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide transition-all"
        >
          {words.slice(0, Math.max(80, wordIndex + 40)).map((word, wIdx) => {
            const isCurrentWord = wIdx === wordIndex;
            const isPastWord = wIdx < wordIndex;
            const pastInput = isPastWord ? typedWords[wIdx] || '' : '';

            return (
              <div
                key={wIdx}
                ref={isCurrentWord ? activeWordRef : undefined}
                className={`relative flex items-center rounded-lg px-1 py-0.5 transition-colors ${
                  isCurrentWord
                    ? 'bg-slate-100/80 dark:bg-slate-800/60 ring-1 ring-slate-300 dark:ring-slate-700'
                    : ''
                }`}
              >
                {/* Render expected word characters */}
                {word.split('').map((char, cIdx) => {
                  let charClass = 'text-slate-400 dark:text-slate-500'; // untyped
                  let isCurrentCaret = false;

                  if (isPastWord) {
                    if (cIdx < pastInput.length) {
                      charClass =
                        pastInput[cIdx] === char
                          ? 'text-brand-600 dark:text-brand-400 font-semibold'
                          : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 underline decoration-rose-500';
                    } else {
                      // Missed characters in past word
                      charClass = 'text-rose-400 dark:text-rose-500 opacity-60';
                    }
                  } else if (isCurrentWord) {
                    if (cIdx < userInput.length) {
                      charClass =
                        userInput[cIdx] === char
                          ? 'text-brand-600 dark:text-brand-400 font-semibold'
                          : 'text-rose-600 dark:text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-bold';
                    } else if (cIdx === userInput.length) {
                      isCurrentCaret = true;
                      charClass = 'text-slate-800 dark:text-slate-200 font-medium';
                    }
                  }

                  return (
                    <span key={cIdx} className={`relative transition-colors duration-100 ${charClass}`}>
                      {/* Active Cursor Caret */}
                      {isCurrentWord && isCurrentCaret && (
                        <span className="absolute -left-0.5 top-0 bottom-0 w-[2px] bg-brand-500 dark:bg-brand-400 animate-caret-blink shadow-[0_0_8px_#10b981]" />
                      )}
                      {char}
                    </span>
                  );
                })}

                {/* Extra incorrect characters typed beyond original word length */}
                {isCurrentWord && userInput.length > word.length && (
                  <>
                    {userInput.slice(word.length).split('').map((extraChar, extraIdx) => (
                      <span
                        key={`extra-${extraIdx}`}
                        className="text-rose-600 dark:text-rose-400 bg-rose-500/20 underline decoration-rose-500 font-bold opacity-80"
                      >
                        {extraChar}
                      </span>
                    ))}
                    <span className="relative">
                      <span className="absolute -left-0.5 top-0 bottom-0 w-[2px] bg-brand-500 dark:bg-brand-400 animate-caret-blink shadow-[0_0_8px_#10b981]" />
                    </span>
                  </>
                )}

                {/* Past word extra characters */}
                {isPastWord && pastInput.length > word.length && (
                  <span className="text-rose-500/70 line-through text-sm self-center ml-0.5">
                    {pastInput.slice(word.length)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Typing Instructions and Quick Restart Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/70 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {status === 'idle' ? (
              <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-medium animate-pulse">
                <span>Start typing to begin</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm"
              title="Restart test (Esc or click)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            <span className="hidden sm:flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 font-mono text-[10px]">Esc</kbd>
              <span>to reset</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
