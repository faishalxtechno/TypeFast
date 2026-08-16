import { KeyPerformanceMap, KeyStat } from '../types';

const KEY_STATS_STORAGE_KEY = 'typefast_key_stats';

const ALL_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Baseline default stats so heatmap and coach have rich starting data for new users
function generateDefaultKeyStats(): KeyPerformanceMap {
  const map: KeyPerformanceMap = {};
  ALL_ALPHABET.forEach(k => {
    // Introduce natural variations: R, T, G, H, B, Y commonly have slightly more mistakes
    const isChallenging = ['R', 'T', 'G', 'H', 'B', 'P'].includes(k);
    const attempts = isChallenging ? 45 : 60;
    const incorrect = isChallenging ? 8 : 2;
    const correct = attempts - incorrect;
    const accuracy = Math.round((correct / attempts) * 1000) / 10;

    map[k] = {
      key: k,
      attempts,
      correct,
      incorrect,
      accuracy,
      mistakesAgainst: isChallenging ? { [k === 'R' ? 'T' : 'F']: 5 } : {}
    };
  });
  return map;
}

export function getKeyStats(): KeyPerformanceMap {
  try {
    const raw = localStorage.getItem(KEY_STATS_STORAGE_KEY);
    if (!raw) {
      const def = generateDefaultKeyStats();
      localStorage.setItem(KEY_STATS_STORAGE_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return generateDefaultKeyStats();
  }
}

export function saveKeyStats(stats: KeyPerformanceMap): void {
  try {
    localStorage.setItem(KEY_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save key stats:', e);
  }
}

/**
 * Record a batch of character attempts from a completed test or practice session
 */
export function recordKeyEvents(events: { expected: string; typed: string; isCorrect: boolean }[]): void {
  const current = getKeyStats();

  events.forEach(evt => {
    const key = evt.expected.toUpperCase();
    if (!key || key.length !== 1 || key < 'A' || key > 'Z') return;

    if (!current[key]) {
      current[key] = {
        key,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 100,
        mistakesAgainst: {}
      };
    }

    const stat = current[key];
    stat.attempts += 1;

    if (evt.isCorrect) {
      stat.correct += 1;
    } else {
      stat.incorrect += 1;
      const typedUpper = (evt.typed || '').toUpperCase();
      if (typedUpper) {
        stat.mistakesAgainst[typedUpper] = (stat.mistakesAgainst[typedUpper] || 0) + 1;
      }
    }

    stat.accuracy = Math.round((stat.correct / Math.max(1, stat.attempts)) * 1000) / 10;
  });

  saveKeyStats(current);
}

/**
 * Identifies the user's weakest keys using a threshold of at least 4 attempts
 */
export function getWeakestKeys(limit: number = 5): KeyStat[] {
  const stats = getKeyStats();
  const list = Object.values(stats);

  // Filter keys with at least 4 attempts
  const tested = list.filter(k => k.attempts >= 4);

  // Sort ascending by accuracy (lowest first), then descending by mistakes
  tested.sort((a, b) => a.accuracy - b.accuracy || b.incorrect - a.incorrect);

  return tested.slice(0, limit);
}

/**
 * Identifies the user's strongest keys
 */
export function getStrongestKeys(limit: number = 5): KeyStat[] {
  const stats = getKeyStats();
  const list = Object.values(stats);
  const tested = list.filter(k => k.attempts >= 4);
  tested.sort((a, b) => b.accuracy - a.accuracy || b.correct - a.correct);
  return tested.slice(0, limit);
}
