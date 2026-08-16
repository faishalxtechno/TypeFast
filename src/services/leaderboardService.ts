import { LeaderboardEntry, Difficulty, TestDuration } from '../types';
import { getStoredStats } from '../utils/storage';
import { getCurrentUser } from './authService';
import { INITIAL_LEADERBOARD } from '../data/leaderboardData';

export type LeaderboardTimeframe = 'daily' | 'weekly' | 'monthly' | 'allTime';

export function getLeaderboardEntries(options: {
  timeframe?: LeaderboardTimeframe;
  duration?: TestDuration | 'all';
  difficulty?: Difficulty | 'all';
}): { entries: LeaderboardEntry[]; userRank?: LeaderboardEntry | null } {
  const { timeframe = 'allTime', duration = 'all', difficulty = 'all' } = options;

  const stats = getStoredStats();
  const currentUser = getCurrentUser();

  // Baseline top global players
  const baseEntries: LeaderboardEntry[] = INITIAL_LEADERBOARD.map(e => ({
    ...e,
    movement: e.rank % 3 === 0 ? 'up' : e.rank % 3 === 1 ? 'same' : 'down',
    movementValue: e.rank % 3 === 0 ? (e.rank * 2) % 7 + 1 : e.rank % 3 === 2 ? 1 : 0
  }));

  // Filter duration and difficulty
  let filtered = baseEntries.filter(entry => {
    if (duration !== 'all' && entry.duration !== Number(duration)) return false;
    if (difficulty !== 'all' && entry.difficulty !== difficulty) return false;
    return true;
  });

  // If timeframe is daily/weekly, apply slight cadence variations
  if (timeframe === 'daily') {
    filtered = filtered.map(e => ({ ...e, wpm: Math.max(40, e.wpm - (e.rank % 5)) }));
  }

  // Insert user's real score if user has completed tests
  let userEntry: LeaderboardEntry | null = null;

  if (stats.bestWpm > 0) {
    const playerName = currentUser ? currentUser.name : 'You (Local Record)';
    const username = currentUser ? currentUser.username : 'you';

    userEntry = {
      rank: 0, // Computed below
      player: playerName,
      username,
      wpm: stats.bestWpm,
      accuracy: stats.bestAccuracy || 98.2,
      duration: 60,
      difficulty: 'medium',
      date: 'Today',
      badge: stats.bestWpm >= 100 ? 'diamond' : stats.bestWpm >= 80 ? 'master' : 'pro',
      movement: 'up',
      movementValue: 3,
      isCurrentUser: true
    };

    filtered.push(userEntry);
  }

  // Sort by WPM descending, then accuracy
  filtered.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);

  // Assign accurate 1-indexed ranks
  filtered.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  if (userEntry) {
    userEntry = filtered.find(e => e.isCurrentUser) || null;
  }

  return {
    entries: filtered,
    userRank: userEntry
  };
}
