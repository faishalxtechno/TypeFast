export type TestDuration = 15 | 30 | 60 | 120;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Page =
  | 'test'
  | 'dashboard'
  | 'history'
  | 'analytics'
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
  wpmImprovementRate: number; // percentage
  currentAccuracy: number;
  averageAccuracy: number;
  bestAccuracy: number;
  consistencyScore: number; // percentage (100 - standard deviation metric)
  weeklyImprovementPercent: number;
  monthlyImprovementPercent: number;
  allTimeImprovementPercent: number;
  totalTimeTypedSeconds: number;
  totalKeystrokes: number;
}
