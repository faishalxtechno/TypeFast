import { useState, useEffect, useRef, useCallback } from 'react';
import { TestDuration, Difficulty, TestResult, UserStats } from '../types';
import { generateWords } from '../data/words';
import { calculateWPM, calculateRawWPM, calculateAccuracy, countCharacterStats } from '../utils/typingCalculations';
import { getStoredStats, saveTestResult } from '../utils/storage';
import { getStoredSettings, saveStoredSettings } from '../utils/settingsStorage';
import { playKeyClickSound, playCompletionSound, initAudio, setAudioVolume } from '../utils/sound';

export type TestStatus = 'idle' | 'running' | 'completed';

export interface KeystrokeFeedback {
  key: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface UseTypingEngineReturn {
  status: TestStatus;
  duration: TestDuration;
  difficulty: Difficulty;
  timeLeft: number;
  words: string[];
  wordIndex: number;
  userInput: string;
  typedWords: string[];
  liveWpm: number;
  liveRawWpm: number;
  liveAccuracy: number;
  errorsCount: number;
  correctCharsCount: number;
  incorrectCharsCount: number;
  totalTypedCount: number;
  soundEnabled: boolean;
  soundVolume: number;
  lastKeystroke: KeystrokeFeedback | null;
  result: TestResult | null;
  userStats: UserStats;
  isNewBest: boolean;
  setDuration: (d: TestDuration) => void;
  setDifficulty: (d: Difficulty) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (vol: number) => void;
  handleKeyDown: (e: React.KeyboardEvent | KeyboardEvent) => void;
  handleInput: (value: string) => void;
  restartTest: (changeWords?: boolean) => void;
  refreshStats: () => void;
}

export function useTypingEngine(): UseTypingEngineReturn {
  const initialSettings = getStoredSettings();
  const [duration, setDurationState] = useState<TestDuration>(initialSettings.duration);
  const [difficulty, setDifficultyState] = useState<Difficulty>(initialSettings.difficulty);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(initialSettings.soundEnabled);
  const [soundVolume, setSoundVolumeState] = useState<number>(initialSettings.soundVolume);

  const [status, setStatus] = useState<TestStatus>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(initialSettings.duration);
  const [words, setWords] = useState<string[]>(() => generateWords(initialSettings.difficulty, 100));
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [keystrokesCount, setKeystrokesCount] = useState<number>(0);
  const [lastKeystroke, setLastKeystroke] = useState<KeystrokeFeedback | null>(null);

  const [result, setResult] = useState<TestResult | null>(null);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [userStats, setUserStats] = useState<UserStats>(() => getStoredStats());

  // High precision timer refs
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Synchronize audio volume
  useEffect(() => {
    setAudioVolume(soundVolume);
  }, [soundVolume]);

  // Compute character stats accurately from current state
  const charStats = countCharacterStats(words, typedWords, userInput, wordIndex);
  const correctCharsCount = charStats.correct;
  const incorrectCharsCount = charStats.incorrect;
  const totalTypedCount = Math.max(charStats.total, keystrokesCount);
  const errorsCount = charStats.errors;

  const refreshStats = useCallback(() => {
    setUserStats(getStoredStats());
  }, []);

  const setDuration = (newDuration: TestDuration) => {
    setDurationState(newDuration);
    saveStoredSettings({ ...getStoredSettings(), duration: newDuration });
    restartTestWithConfig(newDuration, difficulty);
  };

  const setDifficulty = (newDifficulty: Difficulty) => {
    setDifficultyState(newDifficulty);
    saveStoredSettings({ ...getStoredSettings(), difficulty: newDifficulty });
    restartTestWithConfig(duration, newDifficulty);
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    saveStoredSettings({ ...getStoredSettings(), soundEnabled: enabled });
    if (enabled) {
      initAudio(soundVolume);
    }
  };

  const setSoundVolume = (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    setSoundVolumeState(clamped);
    saveStoredSettings({ ...getStoredSettings(), soundVolume: clamped });
    setAudioVolume(clamped);
  };

  // Helper to reinitialize with given params
  const restartTestWithConfig = useCallback((targetDuration: TestDuration, targetDifficulty: Difficulty) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    startTimeRef.current = null;
    setStatus('idle');
    setTimeLeft(targetDuration);
    setWords(generateWords(targetDifficulty, 100));
    setWordIndex(0);
    setUserInput('');
    setTypedWords([]);
    setKeystrokesCount(0);
    setLastKeystroke(null);
    setResult(null);
    setIsNewBest(false);
  }, []);

  const restartTest = useCallback((changeWords = true) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    startTimeRef.current = null;
    setStatus('idle');
    setTimeLeft(duration);
    if (changeWords) {
      setWords(generateWords(difficulty, 100));
    }
    setWordIndex(0);
    setUserInput('');
    setTypedWords([]);
    setKeystrokesCount(0);
    setLastKeystroke(null);
    setResult(null);
    setIsNewBest(false);
  }, [duration, difficulty]);

  // Finish test
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const elapsedSeconds = duration; // Full duration elapsed
    const finalStats = countCharacterStats(words, typedWords, userInput, wordIndex);
    const finalWpm = calculateWPM(finalStats.correct, elapsedSeconds);
    const finalTotalChars = Math.max(finalStats.total, keystrokesCount);
    const finalRawWpm = calculateRawWPM(finalTotalChars, elapsedSeconds);
    const finalAccuracy = calculateAccuracy(finalStats.correct, finalTotalChars);

    const testRes: TestResult = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `test-${Date.now()}`,
      timestamp: Date.now(),
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      errors: finalStats.errors,
      duration,
      difficulty,
      correctChars: finalStats.correct,
      incorrectChars: finalStats.incorrect,
      totalChars: finalTotalChars,
      isNewBest: false
    };

    const { updatedStats, isNewBest: newBestAchieved } = saveTestResult(testRes);
    testRes.isNewBest = newBestAchieved;

    setResult(testRes);
    setIsNewBest(newBestAchieved);
    setUserStats(updatedStats);
    setStatus('completed');
    setTimeLeft(0);

    if (soundEnabled) {
      playCompletionSound();
    }
  }, [duration, difficulty, words, typedWords, userInput, wordIndex, keystrokesCount, soundEnabled]);

  // Start test on first keypress
  const startTest = useCallback(() => {
    if (status !== 'idle') return;
    initAudio(soundVolume);
    setStatus('running');
    const now = Date.now();
    startTimeRef.current = now;

    timerIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      }
    }, 100);
  }, [status, duration, soundVolume]);

  // Check if time has run out
  useEffect(() => {
    if (status === 'running' && timeLeft <= 0) {
      finishTest();
    }
  }, [status, timeLeft, finishTest]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Ensure more words are added if typist gets close to the end
  useEffect(() => {
    if (wordIndex > words.length - 20) {
      const moreWords = generateWords(difficulty, 50);
      setWords(prev => [...prev, ...moreWords]);
    }
  }, [wordIndex, words.length, difficulty]);

  // Handle keystroke logic with zero latency
  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    // If completed or non-input modifiers pressed (except shift)
    if (status === 'completed' || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    // Quick restart shortcut: Tab + Enter or Escape
    if (e.key === 'Escape' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      restartTest(true);
      return;
    }

    // Start timer on first printable key
    if (status === 'idle') {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        startTest();
      } else {
        return;
      }
    }

    const currentTargetWord = words[wordIndex] || '';

    // Handle Space key
    if (e.key === ' ') {
      e.preventDefault();
      if (userInput.length === 0) return; // ignore leading multiple spaces

      const isSpaceCorrect = userInput === currentTargetWord;
      if (soundEnabled) playKeyClickSound(false);
      setLastKeystroke({ key: ' ', isCorrect: isSpaceCorrect, timestamp: Date.now() });

      setKeystrokesCount(prev => prev + 1);
      setTypedWords(prev => [...prev, userInput]);
      setWordIndex(prev => prev + 1);
      setUserInput('');
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      setLastKeystroke({ key: 'Backspace', isCorrect: true, timestamp: Date.now() });

      if (userInput.length > 0) {
        setUserInput(prev => prev.slice(0, -1));
        if (soundEnabled) playKeyClickSound(false);
      } else if (wordIndex > 0) {
        // Move back to previous word
        const prevWord = typedWords[typedWords.length - 1];
        setWordIndex(prev => prev - 1);
        setUserInput(prevWord);
        setTypedWords(prev => prev.slice(0, -1));
        if (soundEnabled) playKeyClickSound(false);
      }
      return;
    }

    // Handle single character typed
    if (e.key.length === 1) {
      e.preventDefault();
      const nextCharIndex = userInput.length;
      const expectedChar = currentTargetWord[nextCharIndex];
      const isCorrect = e.key === expectedChar;

      if (soundEnabled) playKeyClickSound(!isCorrect);
      setLastKeystroke({ key: e.key, isCorrect, timestamp: Date.now() });
      setKeystrokesCount(prev => prev + 1);

      // Limit typing to max 12 extra characters beyond word length
      if (userInput.length < currentTargetWord.length + 12) {
        setUserInput(prev => prev + e.key);
      }
    }
  }, [status, words, wordIndex, userInput, typedWords, soundEnabled, startTest, restartTest]);

  // Support for mobile or virtual input events
  const handleInput = useCallback((value: string) => {
    if (status === 'completed') return;
    if (status === 'idle' && value.length > 0) {
      startTest();
    }
    // Handle space at end
    if (value.endsWith(' ')) {
      const trimmed = value.slice(0, -1);
      if (trimmed.length > 0) {
        const currentTargetWord = words[wordIndex] || '';
        const isSpaceCorrect = trimmed === currentTargetWord;
        if (soundEnabled) playKeyClickSound(false);
        setLastKeystroke({ key: ' ', isCorrect: isSpaceCorrect, timestamp: Date.now() });

        setKeystrokesCount(prev => prev + 1);
        setTypedWords(prev => [...prev, trimmed]);
        setWordIndex(prev => prev + 1);
        setUserInput('');
        return;
      }
    }

    if (value.length > userInput.length) {
      const currentTargetWord = words[wordIndex] || '';
      const lastChar = value[value.length - 1];
      const isCorrect = lastChar === currentTargetWord[value.length - 1];
      if (soundEnabled) playKeyClickSound(!isCorrect);
      setLastKeystroke({ key: lastChar, isCorrect, timestamp: Date.now() });
    }

    setKeystrokesCount(prev => prev + 1);
    setUserInput(value);
  }, [status, startTest, soundEnabled, userInput.length, words, wordIndex]);

  // Calculate live elapsed seconds
  const elapsedSeconds = status === 'idle' 
    ? 0 
    : status === 'completed' 
    ? duration 
    : Math.max(1, duration - timeLeft);

  const liveWpm = calculateWPM(correctCharsCount, elapsedSeconds);
  const liveRawWpm = calculateRawWPM(totalTypedCount, elapsedSeconds);
  const liveAccuracy = calculateAccuracy(correctCharsCount, totalTypedCount);

  return {
    status,
    duration,
    difficulty,
    timeLeft,
    words,
    wordIndex,
    userInput,
    typedWords,
    liveWpm,
    liveRawWpm,
    liveAccuracy,
    errorsCount,
    correctCharsCount,
    incorrectCharsCount,
    totalTypedCount,
    soundEnabled,
    soundVolume,
    lastKeystroke,
    result,
    userStats,
    isNewBest,
    setDuration,
    setDifficulty,
    setSoundEnabled,
    setSoundVolume,
    handleKeyDown,
    handleInput,
    restartTest,
    refreshStats
  };
}
