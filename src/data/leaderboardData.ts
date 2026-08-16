import { LeaderboardEntry } from '../types';

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    player: 'SpeedKing',
    wpm: 132,
    accuracy: 99.0,
    duration: 60,
    difficulty: 'medium',
    date: 'Just now',
    badge: 'diamond'
  },
  {
    rank: 2,
    player: 'TypeMaster',
    wpm: 127,
    accuracy: 98.4,
    duration: 60,
    difficulty: 'medium',
    date: '10m ago',
    badge: 'diamond'
  },
  {
    rank: 3,
    player: 'FastHands',
    wpm: 119,
    accuracy: 97.2,
    duration: 60,
    difficulty: 'hard',
    date: '1h ago',
    badge: 'master'
  },
  {
    rank: 4,
    player: 'HyperTypist',
    wpm: 115,
    accuracy: 98.8,
    duration: 30,
    difficulty: 'medium',
    date: '2h ago',
    badge: 'master'
  },
  {
    rank: 5,
    player: 'CodeNinja',
    wpm: 108,
    accuracy: 96.5,
    duration: 60,
    difficulty: 'hard',
    date: '3h ago',
    badge: 'pro'
  },
  {
    rank: 6,
    player: 'SwiftFingers',
    wpm: 104,
    accuracy: 99.2,
    duration: 15,
    difficulty: 'easy',
    date: '5h ago',
    badge: 'pro'
  },
  {
    rank: 7,
    player: 'QuantumKey',
    wpm: 99,
    accuracy: 95.7,
    duration: 60,
    difficulty: 'medium',
    date: '6h ago',
    badge: 'rising'
  },
  {
    rank: 8,
    player: 'PixelPusher',
    wpm: 94,
    accuracy: 97.0,
    duration: 120,
    difficulty: 'hard',
    date: '12h ago',
    badge: 'rising'
  },
  {
    rank: 9,
    player: 'DevFlow',
    wpm: 88,
    accuracy: 96.1,
    duration: 60,
    difficulty: 'easy',
    date: '1d ago',
    badge: 'rising'
  },
  {
    rank: 10,
    player: 'CyberTouch',
    wpm: 82,
    accuracy: 98.0,
    duration: 30,
    difficulty: 'medium',
    date: '1d ago',
    badge: 'rising'
  }
];
