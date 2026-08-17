export const config = {
  runtime: 'nodejs'
};

interface RequestBody {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const body: RequestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, username, email, password } = body;

    // 1. Validate inputs
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, error: 'Username is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (cleanUsername.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 3 alphanumeric characters.'
      });
    }

    // 2. Create account profile & session
    const now = Date.now();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const nowDate = new Date(now);
    const joinDate = `${monthNames[nowDate.getMonth()]} ${nowDate.getFullYear()}`;

    const avatarGradients = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80'
    ];
    const randomAvatar = avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

    const createdUser = {
      id: `user-${now}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      avatar: randomAvatar,
      joinDate,
      joinedTimestamp: now
    };

    return res.status(200).json({
      success: true,
      message: 'Account created successfully!',
      user: createdUser
    });

  } catch (err: any) {
    console.error('[Registration Handler Error]', {
      name: err?.name || 'Error',
      message: err?.message || 'Server error'
    });

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while creating your account.'
    });
  }
}
