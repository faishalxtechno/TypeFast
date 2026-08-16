/**
 * TypeFast REST API Route Definitions
 */

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  authRequired: boolean;
  handler: string;
}

export const API_ROUTES: RouteDefinition[] = [
  // Auth Routes
  { method: 'POST', path: '/api/auth/register', authRequired: false, handler: 'authController.register' },
  { method: 'POST', path: '/api/auth/login', authRequired: false, handler: 'authController.login' },
  { method: 'GET', path: '/api/auth/me', authRequired: true, handler: 'authController.getMe' },
  { method: 'PUT', path: '/api/auth/profile', authRequired: true, handler: 'authController.updateProfile' },

  // Typing Tests & History
  { method: 'POST', path: '/api/tests', authRequired: false, handler: 'testController.saveTest' },
  { method: 'GET', path: '/api/tests/history', authRequired: false, handler: 'testController.getHistory' },
  { method: 'GET', path: '/api/tests/analytics', authRequired: false, handler: 'testController.getAnalytics' },

  // Certificates
  { method: 'POST', path: '/api/certificates', authRequired: false, handler: 'certificateController.create' },
  { method: 'GET', path: '/api/certificates/:id', authRequired: false, handler: 'certificateController.getById' },

  // Daily Challenge & Streaks
  { method: 'GET', path: '/api/challenges/today', authRequired: false, handler: 'challengeController.getToday' },
  { method: 'POST', path: '/api/challenges/submit', authRequired: false, handler: 'challengeController.submit' },
  { method: 'GET', path: '/api/challenges/streak', authRequired: false, handler: 'challengeController.getStreak' },

  // Achievements
  { method: 'GET', path: '/api/achievements', authRequired: false, handler: 'achievementController.getAll' },
  { method: 'POST', path: '/api/achievements/evaluate', authRequired: true, handler: 'achievementController.evaluate' },

  // Leaderboard
  { method: 'GET', path: '/api/leaderboard', authRequired: false, handler: 'leaderboardController.getLeaderboard' }
];
