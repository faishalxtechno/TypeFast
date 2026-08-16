export type TestDuration = 15 | 30 | 60 | 120;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Page =
  | 'test'
  | 'dashboard'
  | 'history'
  | 'analytics'
  | 'coach'
  | 'practice'
  | 'keyboard'
  | 'leaderboard'
  | 'daily-challenge'
  | 'achievements'
  | 'certificate'
  | 'about'
  | 'login'
  | 'signup'
  | 'profile';

export type Theme = 'dark' | 'light';

export type CharStatus = 'untyped' | 'correct' | 'incorrect' | 'current';

export interface LetterState {
  char: string;
  status: CharStatus;
}

export interface WordState {
  original: string;
  letters: LetterState[];
  isCompleted: boolean;
  hasErrors: boolean;
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  duration: TestDuration;
  difficulty: Difficulty;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  isNewBest?: boolean;
  userId?: string;
  xpEarned?: number;
}

export interface UserStats {
  bestWpm: number;
  bestAccuracy: number;
  testsCompleted: number;
  totalTimeTypedSeconds: number;
  history: TestResult[];
}

export interface LeaderboardEntry {
  rank: number;
  player: string;
  username?: string;
  wpm: number;
  accuracy: number;
  duration: number;
  difficulty: Difficulty;
  date: string;
  badge?: 'diamond' | 'master' | 'pro' | 'rising';
  movement?: 'up' | 'down' | 'same';
  movementValue?: number;
  isCurrentUser?: boolean;
  level?: number;
}

export interface CertificateData {
  id: string; // e.g. "TF-2026-8A72F4"
  name: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  duration: TestDuration;
  difficulty: Difficulty;
  date: string;
  timestamp: number;
  testResultId: string;
  userId?: string;
}

// -------------------------------------------------------------
// User Authentication & Profile Types
// -------------------------------------------------------------

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  joinedTimestamp: number;
  bio?: string;
  level?: number;
  xp?: number;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

// -------------------------------------------------------------
// Achievements Types
// -------------------------------------------------------------

export type AchievementCategory = 'speed' | 'accuracy' | 'volume' | 'streak' | 'special';

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: number;
  requirementType: 'wpm' | 'accuracy' | 'tests' | 'streak' | 'certificates' | 'special';
  unlockedAt?: number;
  progress?: number;
}

// -------------------------------------------------------------
// Daily Challenge Types
// -------------------------------------------------------------

export interface DailyChallenge {
  id: string;
  dateKey: string; // YYYY-MM-DD
  title: string;
  promptText: string;
  duration: TestDuration;
  difficulty: Difficulty;
  participantsCount: number;
}

export interface DailyChallengeResult {
  id: string;
  userId?: string;
  challengeId: string;
  dateKey: string;
  wpm: number;
  accuracy: number;
  errors: number;
  completedAt: number;
  rank?: number;
  topPercentile?: string;
  xpEarned?: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDateKey: string | null;
  historyMap: Record<string, boolean>; // 'YYYY-MM-DD': true
}

// -------------------------------------------------------------
// Analytics Types
// -------------------------------------------------------------

export interface PerformancePoint {
  id: string;
  timestamp: number;
  dateStr: string;
  wpm: number;
  accuracy: number;
  duration: number;
  difficulty: Difficulty;
}

export interface AnalyticsSummary {
  currentWpm: number;
  averageWpm: number;
  bestWpm: number;
  wpmImprovementRate: number;
  currentAccuracy: number;
  averageAccuracy: number;
  bestAccuracy: number;
  consistencyScore: number;
  weeklyImprovementPercent: number;
  monthlyImprovementPercent: number;
  allTimeImprovementPercent: number;
  totalTimeTypedSeconds: number;
  totalKeystrokes: number;
}

// -------------------------------------------------------------
// V5 Types: Weak Keys, AI Coach, Heatmap, XP & Practice
// -------------------------------------------------------------

export interface KeyStat {
  key: string;
  attempts: number;
  correct: number;
  incorrect: number;
  accuracy: number; // percentage (0-100)
  mistakesAgainst: Record<string, number>; // typedKey -> count
}

export type KeyPerformanceMap = Record<string, KeyStat>;

export type PracticeMode = 'weak-keys' | 'combinations' | 'accuracy' | 'speed' | 'endurance';

export interface PracticeSession {
  id: string;
  mode: PracticeMode;
  targetKeys: string[];
  duration: number;
  text: string;
  baselineWpm: number;
  baselineAccuracy: number;
  completedWpm: number;
  completedAccuracy: number;
  errors: number;
  xpEarned: number;
  timestamp: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export interface AICoachAnalysis {
  speedAnalysis: string;
  accuracyAnalysis: string;
  weakKeys: string[];
  weakCombinations: string[];
  consistencyAnalysis: string;
  progressAnalysis: string;
  mainWeakness: string;
  recommendation: string;
  recommendedMode: PracticeMode;
  recommendedDuration: number;
}
