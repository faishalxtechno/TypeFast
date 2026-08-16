import { UserProfile, AuthState, TestResult } from '../types';
import { getStoredStats } from '../utils/storage';

const AUTH_USER_KEY = 'typefast_auth_user';
const USERS_DB_KEY = 'typefast_registered_users';

interface RegisteredAccount {
  profile: UserProfile;
  passwordHash: string;
}

function hashPassword(password: string): string {
  // One-way non-reversible client hash for mock credentials storage
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) + password.charCodeAt(i);
  }
  return 'h_' + (hash >>> 0).toString(16);
}

function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRegisteredAccounts(accounts: RegisteredAccount[]) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Failed to save accounts database:', e);
  }
}

/**
 * Gets currently logged-in user or null if in guest mode
 */
export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Gets initial auth state
 */
export function getInitialAuthState(): AuthState {
  const user = getCurrentUser();
  return {
    user,
    isAuthenticated: !!user
  };
}

/**
 * Registers a new user account with validation
 */
export function registerUser(params: {
  name: string;
  username: string;
  email: string;
  password: string;
}): { success: boolean; error?: string; user?: UserProfile } {
  const { name, username, email, password } = params;

  if (!name.trim() || !username.trim() || !email.trim() || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (cleanUsername.length < 3) {
    return { success: false, error: 'Username must be at least 3 alphanumeric characters.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const accounts = getRegisteredAccounts();
  const existing = accounts.find(
    a => a.profile.email.toLowerCase() === email.trim().toLowerCase() ||
         a.profile.username.toLowerCase() === cleanUsername
  );

  if (existing) {
    return { success: false, error: 'An account with that email or username already exists.' };
  }

  const avatarGradients = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80'
  ];
  const randomAvatar = avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

  const now = Date.now();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const nowDate = new Date(now);
  const joinDate = `${monthNames[nowDate.getMonth()]} ${nowDate.getFullYear()}`;

  const newProfile: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    username: cleanUsername,
    email: email.trim().toLowerCase(),
    avatar: randomAvatar,
    joinDate,
    joinedTimestamp: now
  };

  accounts.push({
    profile: newProfile,
    passwordHash: hashPassword(password)
  });
  saveRegisteredAccounts(accounts);

  // Set as current logged in
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newProfile));

  // Sync any guest stats to user
  syncGuestDataToUser(newProfile.id);

  return { success: true, user: newProfile };
}

/**
 * Logs in with email or username and password
 */
export function loginUser(identifier: string, password: string): { success: boolean; error?: string; user?: UserProfile } {
  if (!identifier.trim() || !password) {
    return { success: false, error: 'Please provide your email/username and password.' };
  }

  const accounts = getRegisteredAccounts();
  const target = accounts.find(
    a => a.profile.email.toLowerCase() === identifier.trim().toLowerCase() ||
         a.profile.username.toLowerCase() === identifier.trim().toLowerCase()
  );

  if (!target) {
    return { success: false, error: 'No account found with those credentials.' };
  }

  const validPassword = target.passwordHash === hashPassword(password) || target.passwordHash === btoa(password);
  if (!validPassword) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(target.profile));
  syncGuestDataToUser(target.profile.id);

  return { success: true, user: target.profile };
}

/**
 * Logs out the active user session
 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (e) {
    console.warn('Failed to logout:', e);
  }
}

/**
 * Updates profile details
 */
export function updateProfile(updated: Partial<UserProfile>): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const newProfile: UserProfile = {
    ...current,
    ...updated
  };

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newProfile));

  // Update in accounts DB
  const accounts = getRegisteredAccounts();
  const idx = accounts.findIndex(a => a.profile.id === current.id);
  if (idx !== -1) {
    accounts[idx].profile = newProfile;
    saveRegisteredAccounts(accounts);
  }

  return newProfile;
}

/**
 * Migrates local guest history safely to the user's account
 */
export function syncGuestDataToUser(userId: string): void {
  try {
    const stats = getStoredStats();
    if (stats && stats.history && stats.history.length > 0) {
      const updatedHistory: TestResult[] = stats.history.map(h => ({
        ...h,
        userId: h.userId || userId
      }));
      localStorage.setItem('typefast_stats', JSON.stringify({ ...stats, history: updatedHistory }));
    }
  } catch (e) {
    console.warn('Guest data sync warning:', e);
  }
}
