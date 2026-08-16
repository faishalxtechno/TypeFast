export type TestDuration = 15 | 30 | 60 | 120;
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Page = 'test' | 'leaderboard' | 'about';
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
  wpm: number;
  accuracy: number;
  duration: number;
  difficulty: Difficulty;
  date: string;
  badge?: 'diamond' | 'master' | 'pro' | 'rising';
}
