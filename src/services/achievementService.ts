import { Achievement, UserStats, CertificateData, StreakInfo } from '../types';
import { getStoredStats, getStoredCertificates } from '../utils/storage';
import { getStreakInfo } from './challengeService';

const UNLOCKED_ACHIEVEMENTS_KEY = 'typefast_unlocked_achievements';

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
  {
    id: 'ach-first-step',
    slug: 'first-step',
    name: 'First Step',
    description: 'Complete your first typing test.',
    icon: '🌱',
    category: 'volume',
    requirement: 1,
    requirementType: 'tests'
  },
  {
    id: 'ach-getting-faster',
    slug: 'getting-faster',
    name: 'Getting Faster',
    description: 'Reach 40 WPM on any test.',
    icon: '⚡',
    category: 'speed',
    requirement: 40,
    requirementType: 'wpm'
  },
  {
    id: 'ach-speed-typist',
    slug: 'speed-typist',
    name: 'Speed Typist',
    description: 'Reach 60 WPM on any test.',
    icon: '🚀',
    category: 'speed',
    requirement: 60,
    requirementType: 'wpm'
  },
  {
    id: 'ach-fast-fingers',
    slug: 'fast-fingers',
    name: 'Fast Fingers',
    description: 'Reach 80 WPM on any test.',
    icon: '🔥',
    category: 'speed',
    requirement: 80,
    requirementType: 'wpm'
  },
  {
    id: 'ach-lightning',
    slug: 'lightning',
    name: 'Lightning',
    description: 'Reach 100 WPM on any test.',
    icon: '⚡️',
    category: 'speed',
    requirement: 100,
    requirementType: 'wpm'
  },
  {
    id: 'ach-accuracy-master',
    slug: 'accuracy-master',
    name: 'Accuracy Master',
    description: 'Reach 99% accuracy on a completed test.',
    icon: '🎯',
    category: 'accuracy',
    requirement: 99,
    requirementType: 'accuracy'
  },
  {
    id: 'ach-perfect',
    slug: 'perfect',
    name: 'Perfect',
    description: 'Complete a test with 100% accuracy.',
    icon: '💎',
    category: 'accuracy',
    requirement: 100,
    requirementType: 'accuracy'
  },
  {
    id: 'ach-dedicated',
    slug: 'dedicated',
    name: 'Dedicated',
    description: 'Complete 10 typing practice sessions.',
    icon: '📚',
    category: 'volume',
    requirement: 10,
    requirementType: 'tests'
  },
  {
    id: 'ach-typing-pro',
    slug: 'typing-pro',
    name: 'Typing Pro',
    description: 'Complete 50 typing practice sessions.',
    icon: '🎖️',
    category: 'volume',
    requirement: 50,
    requirementType: 'tests'
  },
  {
    id: 'ach-typing-master',
    slug: 'typing-master',
    name: 'Typing Master',
    description: 'Complete 100 typing practice sessions.',
    icon: '👑',
    category: 'volume',
    requirement: 100,
    requirementType: 'tests'
  },
  {
    id: 'ach-daily-warrior',
    slug: 'daily-warrior',
    name: 'Daily Warrior',
    description: 'Complete 7 daily challenges.',
    icon: '⚔️',
    category: 'streak',
    requirement: 7,
    requirementType: 'streak'
  },
  {
    id: 'ach-consistency',
    slug: 'consistency',
    name: 'Consistency',
    description: 'Maintain a 7-day daily challenge streak.',
    icon: '🔥',
    category: 'streak',
    requirement: 7,
    requirementType: 'streak'
  },
  {
    id: 'ach-certificate-collector',
    slug: 'certificate-collector',
    name: 'Certificate Collector',
    description: 'Earn and generate 5 official typing certificates.',
    icon: '📜',
    category: 'special',
    requirement: 5,
    requirementType: 'certificates'
  }
];

function getUnlockedMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(UNLOCKED_ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Returns all achievements with user unlock status and progress values.
 */
export function getUserAchievements(): Achievement[] {
  const stats: UserStats = getStoredStats();
  const certs: CertificateData[] = getStoredCertificates();
  const streak: StreakInfo = getStreakInfo();
  const unlockedMap = getUnlockedMap();

  return ALL_ACHIEVEMENTS.map(ach => {
    let currentVal = 0;

    switch (ach.requirementType) {
      case 'wpm':
        currentVal = stats.bestWpm;
        break;
      case 'accuracy':
        currentVal = stats.bestAccuracy;
        break;
      case 'tests':
        currentVal = stats.testsCompleted;
        break;
      case 'streak':
        currentVal = Math.max(streak.currentStreak, streak.longestStreak);
        break;
      case 'certificates':
        currentVal = certs.length;
        break;
      default:
        currentVal = 0;
    }

    const isUnlocked = currentVal >= ach.requirement || !!unlockedMap[ach.id];
    const unlockedAt = unlockedMap[ach.id] || (isUnlocked ? Date.now() - 3600000 : undefined);
    const progress = Math.min(ach.requirement, currentVal);

    return {
      ...ach,
      unlockedAt,
      progress
    };
  });
}

/**
 * Evaluates newly completed test or event to check if any new achievements unlocked.
 * Returns array of newly unlocked achievements.
 */
export function checkAndUnlockAchievements(): Achievement[] {
  const stats: UserStats = getStoredStats();
  const certs: CertificateData[] = getStoredCertificates();
  const streak: StreakInfo = getStreakInfo();
  const unlockedMap = getUnlockedMap();

  const newlyUnlocked: Achievement[] = [];

  ALL_ACHIEVEMENTS.forEach(ach => {
    if (unlockedMap[ach.id]) return; // Already unlocked

    let currentVal = 0;
    switch (ach.requirementType) {
      case 'wpm':
        currentVal = stats.bestWpm;
        break;
      case 'accuracy':
        currentVal = stats.bestAccuracy;
        break;
      case 'tests':
        currentVal = stats.testsCompleted;
        break;
      case 'streak':
        currentVal = Math.max(streak.currentStreak, streak.longestStreak);
        break;
      case 'certificates':
        currentVal = certs.length;
        break;
      default:
        currentVal = 0;
    }

    if (currentVal >= ach.requirement) {
      const now = Date.now();
      unlockedMap[ach.id] = now;
      newlyUnlocked.push({
        ...ach,
        unlockedAt: now,
        progress: ach.requirement
      });
    }
  });

  if (newlyUnlocked.length > 0) {
    try {
      localStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(unlockedMap));
    } catch (e) {
      console.warn('Failed to save unlocked achievements:', e);
    }
  }

  return newlyUnlocked;
}
