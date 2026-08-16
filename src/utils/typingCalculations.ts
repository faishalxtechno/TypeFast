/**
 * Accurately calculates character statistics from words and user typed history.
 * Prevents artificial inflation from backspacing.
 */
export function countCharacterStats(
  words: string[],
  typedWords: string[],
  userInput: string,
  wordIndex: number
): { correct: number; incorrect: number; total: number; errors: number } {
  let correct = 0;
  let incorrect = 0;
  let errors = 0;

  // Process completed words
  for (let i = 0; i < typedWords.length; i++) {
    const expected = words[i] || '';
    const typed = typedWords[i] || '';
    let wordHasError = false;

    const minLen = Math.min(typed.length, expected.length);
    for (let k = 0; k < minLen; k++) {
      if (typed[k] === expected[k]) {
        correct++;
      } else {
        incorrect++;
        errors++;
        wordHasError = true;
      }
    }

    // Extra chars typed
    if (typed.length > expected.length) {
      const extra = typed.length - expected.length;
      incorrect += extra;
      errors += extra;
      wordHasError = true;
    } else if (typed.length < expected.length) {
      // Missing characters in word
      const missing = expected.length - typed.length;
      incorrect += missing;
      errors += missing;
      wordHasError = true;
    }

    // Space counted as +1 character
    if (!wordHasError && typed === expected) {
      correct++; // space was typed correctly
    } else {
      incorrect++;
    }
  }

  // Process current active word
  const currentExpected = words[wordIndex] || '';
  const currentMin = Math.min(userInput.length, currentExpected.length);
  for (let k = 0; k < currentMin; k++) {
    if (userInput[k] === currentExpected[k]) {
      correct++;
    } else {
      incorrect++;
      errors++;
    }
  }
  if (userInput.length > currentExpected.length) {
    const extra = userInput.length - currentExpected.length;
    incorrect += extra;
    errors += extra;
  }

  const total = correct + incorrect;
  return { correct, incorrect, total, errors };
}

/**
 * Calculates Words Per Minute (WPM).
 * Formula: WPM = (correct characters / 5) / elapsed minutes
 *
 * @param correctChars Number of correctly typed characters
 * @param elapsedSeconds Elapsed time in seconds
 */
export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const wpm = (correctChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(wpm));
}

/**
 * Calculates Raw WPM (including errors).
 * Formula: Raw WPM = (total typed characters / 5) / elapsed minutes
 *
 * @param totalTypedChars Total keystrokes typed
 * @param elapsedSeconds Elapsed time in seconds
 */
export function calculateRawWPM(totalTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || totalTypedChars <= 0) return 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const rawWpm = (totalTypedChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(rawWpm));
}

/**
 * Calculates typing Accuracy as a percentage rounded to 1 decimal place.
 * Formula: Accuracy = (correct characters / total typed characters) * 100
 *
 * @param correctChars Number of correctly typed characters
 * @param totalTypedChars Total characters typed
 */
export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars === 0) return 100.0;
  const accuracy = (correctChars / totalTypedChars) * 100;
  return Math.max(0, Math.min(100, Math.round(accuracy * 10) / 10));
}

export interface SpeedFeedback {
  tier: string;
  badgeColor: string;
  message: string;
  percentile: string;
}

/**
 * Returns user-friendly qualitative feedback and tier based on WPM.
 */
export function getSpeedFeedback(wpm: number, _accuracy?: number): SpeedFeedback {
  if (wpm >= 120) {
    return {
      tier: 'Grandmaster Typist',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      message: 'Phenomenal speed! You are in the top 1% of typists worldwide.',
      percentile: 'Top 1%'
    };
  }
  if (wpm >= 90) {
    return {
      tier: 'Master Typist',
      badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
      message: 'Lightning fast! You have reached competitive typing speeds.',
      percentile: 'Top 5%'
    };
  }
  if (wpm >= 70) {
    return {
      tier: 'Pro Typist',
      badgeColor: 'text-brand-400 bg-brand-400/10 border-brand-400/30',
      message: 'Excellent typing speed! Above average and very efficient.',
      percentile: 'Top 15%'
    };
  }
  if (wpm >= 50) {
    return {
      tier: 'Fluent Typist',
      badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      message: 'Solid typing speed! Good pace, well above average everyday typists.',
      percentile: 'Top 35%'
    };
  }
  if (wpm >= 35) {
    return {
      tier: 'Intermediate Typist',
      badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      message: 'Average everyday typing speed. Keep practicing touch-typing!',
      percentile: 'Top 55%'
    };
  }
  return {
    tier: 'Novice Typist',
    badgeColor: 'text-slate-400 bg-slate-400/10 border-slate-400/30',
    message: 'Good foundation. Focus on accuracy first, speed will naturally follow!',
    percentile: 'Beginner'
  };
}
