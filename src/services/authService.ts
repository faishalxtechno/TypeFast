import { supabase } from '../lib/supabase';
import { UserProfile, AuthState } from '../types';

const AUTH_USER_CACHE_KEY = 'typefast_auth_user';

export function getCachedUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_CACHE_KEY);
    return raw ? JSON.parse(raw) as UserProfile : null;
  } catch {
    return null;
  }
}

function createProfile(user: any): UserProfile {
  const metadata = user.user_metadata || {};

  return {
    id: user.id,
    name: metadata.name || metadata.full_name || '',
    username: metadata.username || '',
    email: user.email || '',
    avatar: metadata.avatar || '',
    joinDate: new Date(user.created_at).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    }),
    joinedTimestamp: new Date(user.created_at).getTime()
  };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const profile = createProfile(data.user);
  localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(profile));
  return profile;
}

export async function getInitialAuthState(): Promise<AuthState> {
  const user = await getCurrentUser();

  return {
    user,
    isAuthenticated: !!user
  };
}

export async function registerUser(params: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  error?: string;
  user?: UserProfile;
}> {
  const { name, username, email, password } = params;

  if (!name.trim() || !username.trim() || !email.trim() || !password) {
    return {
      success: false,
      error: 'All fields are required.'
    };
  }

  const cleanUsername = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');

  if (cleanUsername.length < 3) {
    return {
      success: false,
      error: 'Username must be at least 3 alphanumeric characters.'
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters.'
    };
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.trim(),
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        password
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to create account.'
      };
    }

    if (data.user) {
      localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(data.user));
    }

    return {
      success: true,
      user: data.user
    };
  } catch (err: any) {
    console.error('Registration request error:', err);
    return {
      success: false,
      error: err.message || 'Network error connecting to registration service.'
    };
  }
}

export async function loginUser(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
  if (!identifier.trim() || !password) {
    return {
      success: false,
      error: 'Please provide your email and password.'
    };
  }

  // Supabase Auth logs in with email.
  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier.trim().toLowerCase(),
    password
  });

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  if (!data.user) {
    return {
      success: false,
      error: 'Login failed.'
    };
  }

  const profile = createProfile(data.user);
  localStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(profile));

  return {
    success: true,
    user: profile
  };
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem(AUTH_USER_CACHE_KEY);
}

export async function updateProfile(
  updated: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      name: updated.name,
      username: updated.username,
      avatar: updated.avatar
    }
  });

  if (error || !data.user) {
    console.error('Failed to update profile:', error);
    return null;
  }

  return createProfile(data.user);
}

export function syncGuestDataToUser(_userId: string): void {
  // Guest-data migration will be connected to Supabase
  // after the typing-test database is implemented.
}
export async function resetPassword(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!email.trim()) {
    return {
      success: false,
      error: 'Please enter your email address.'
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    {
      redirectTo: 'https://type-fast-alpha.vercel.app'
    }
  );

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  return {
    success: true
  };
}
