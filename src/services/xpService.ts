import { LevelInfo } from '../types';

const XP_STORAGE_KEY = 'typefast_user_xp';

export function getUserTotalXp(): number {
  try {
    const raw = localStorage.getItem(XP_STORAGE_KEY);
    if (!raw) return 1240; // Default starter XP (Level 12 Typing Apprentice as in prompt example)
    const val = parseInt(raw, 10);
    return isNaN(val) ? 1240 : val;
  } catch {
    return 1240;
  }
}

export function saveUserXp(xp: number): void {
  try {
    localStorage.setItem(XP_STORAGE_KEY, xp.toString());
  } catch (e) {
    console.warn('Failed to save XP:', e);
  }
}

export function getLevelTitle(level: number): string {
  if (level <= 4) return 'Beginner';
  if (level <= 9) return 'Learner';
  if (level <= 19) return 'Typing Apprentice';
  if (level <= 29) return 'Speed Typist';
  if (level <= 49) return 'Typing Expert';
  return 'TypeFast Master';
}

/**
 * Returns the cumulative XP required to reach a specific level.
 */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Cumulative threshold calculation
  let total = 0;
  for (let lvl = 1; lvl < level; lvl++) {
    total += Math.round(75 + Math.pow(lvl, 1.45) * 45);
  }
  return total;
}

export function getLevelInfo(totalXp?: number): LevelInfo {
  const xp = totalXp !== undefined ? totalXp : getUserTotalXp();

  let level = 1;
  while (getXpForLevel(level + 1) <= xp) {
    level++;
  }

  const currentLevelFloorXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);

  const levelSpan = Math.max(1, nextLevelXp - currentLevelFloorXp);
  const xpInCurrentLevel = xp - currentLevelFloorXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelSpan) * 100)));

  return {
    level,
    title: getLevelTitle(level),
    currentXp: xp,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: levelSpan,
    progressPercent
  };
}

/**
 * Awards XP to the user and returns level info + level up indicator
 */
export function awardXp(amount: number): { prevLevel: number; newLevelInfo: LevelInfo; didLevelUp: boolean } {
  const currentXp = getUserTotalXp();
  const prevInfo = getLevelInfo(currentXp);

  const updatedXp = currentXp + amount;
  saveUserXp(updatedXp);

  const newInfo = getLevelInfo(updatedXp);
  const didLevelUp = newInfo.level > prevInfo.level;

  return {
    prevLevel: prevInfo.level,
    newLevelInfo: newInfo,
    didLevelUp
  };
}
