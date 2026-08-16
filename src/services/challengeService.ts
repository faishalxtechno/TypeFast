import { DailyChallenge, DailyChallengeResult, StreakInfo } from '../types';

const STREAK_STORAGE_KEY = 'typefast_daily_streak';
const CHALLENGE_RESULTS_KEY = 'typefast_challenge_results';

// Curated passages for daily challenges
const CHALLENGE_PASSAGES: string[] = [
  "Mastery is not a function of genius or talent, but of time, focus, and relentless practice on the keyboard.",
  "Great software is built one clean keystroke at a time. Speed is good, but precision and clarity define real expertise.",
  "The quick brown fox jumps over the lazy dog, while algorithms weave through distributed systems across the globe.",
  "Touch typing creates a frictionless bridge between human cognition and computational logic, unlocking effortless flow.",
  "Discipline and daily consistency compound faster than raw talent. Every keystroke is an investment in muscle memory.",
  "Architecture, performance, and simplicity: the pillars of modern web development and high-efficiency engineering.",
  "Speed without accuracy creates chaos; accuracy with persistence unlocks natural, fluid, and unstoppable velocity."
];

/**
 * Returns today's standard ISO date key in UTC: YYYY-MM-DD
 */
export function getTodayDateKey(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

/**
 * Gets today's deterministic daily challenge.
 */
export function getTodayChallenge(): DailyChallenge {
  const dateKey = getTodayDateKey();
  // Hash the date string to choose a deterministic challenge passage
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  const passageIndex = hash % CHALLENGE_PASSAGES.length;

  return {
    id: `challenge-${dateKey}`,
    dateKey,
    title: `Daily Challenge — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    promptText: CHALLENGE_PASSAGES[passageIndex],
    duration: 60,
    difficulty: 'medium',
    participantsCount: 1420 + (hash % 500)
  };
}

/**
 * Gets user streak information.
 */
export function getStreakInfo(): StreakInfo {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      return {
        currentStreak: 1, // Default starter streak
        longestStreak: 3,
        lastCompletedDateKey: null,
        historyMap: {}
      };
    }
    const parsed = JSON.parse(raw);
    return {
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
      lastCompletedDateKey: parsed.lastCompletedDateKey || null,
      historyMap: parsed.historyMap || {}
    };
  } catch {
    return {
      currentStreak: 1,
      longestStreak: 3,
      lastCompletedDateKey: null,
      historyMap: {}
    };
  }
}

/**
 * Submits a daily challenge completion and updates the streak safely.
 */
export function submitDailyChallenge(params: {
  wpm: number;
  accuracy: number;
  errors: number;
  userId?: string;
}): { result: DailyChallengeResult; streak: StreakInfo; isNewDay: boolean } {
  const todayKey = getTodayDateKey();
  const challenge = getTodayChallenge();

  const streak = getStreakInfo();
  let isNewDay = false;

  if (streak.lastCompletedDateKey !== todayKey) {
    isNewDay = true;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (streak.lastCompletedDateKey === yesterday) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }

    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.lastCompletedDateKey = todayKey;
    streak.historyMap[todayKey] = true;

    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
    } catch (e) {
      console.warn('Failed to save streak:', e);
    }
  }

  // Calculate dynamic ranking
  const estimatedRank = Math.max(12, Math.floor(challenge.participantsCount * (1 - (params.wpm / 150))));
  const topPercent = Math.max(1, Math.round((estimatedRank / challenge.participantsCount) * 100));

  const result: DailyChallengeResult = {
    id: `dc-res-${Date.now()}`,
    userId: params.userId,
    challengeId: challenge.id,
    dateKey: todayKey,
    wpm: params.wpm,
    accuracy: params.accuracy,
    errors: params.errors,
    completedAt: Date.now(),
    rank: estimatedRank,
    topPercentile: `Top ${topPercent}%`
  };

  try {
    const raw = localStorage.getItem(CHALLENGE_RESULTS_KEY);
    const list: DailyChallengeResult[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(CHALLENGE_RESULTS_KEY, JSON.stringify([result, ...list]));
  } catch (e) {
    console.warn('Failed to save challenge result:', e);
  }

  return { result, streak, isNewDay };
}

/**
 * Returns past 7 days status for the streak calendar widget.
 */
export function getPast7DaysStatus(): { dayName: string; dateKey: string; completed: boolean; isToday: boolean }[] {
  const streak = getStreakInfo();
  const todayKey = getTodayDateKey();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateKey = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    const completed = !!streak.historyMap[dateKey] || (i === 0 && streak.lastCompletedDateKey === todayKey);

    result.push({
      dayName,
      dateKey,
      completed,
      isToday: dateKey === todayKey
    });
  }

  return result;
}
