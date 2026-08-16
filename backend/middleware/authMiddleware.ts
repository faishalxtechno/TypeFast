/**
 * JWT Authentication Middleware
 */
export interface AuthenticatedRequest {
  user?: {
    id: string;
    email: string;
    username: string;
  };
  headers: Record<string, string | string[] | undefined>;
}

export function authMiddleware(req: AuthenticatedRequest, res: { status: (code: number) => { json: (body: unknown) => void } }, next: () => void) {
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Authentication token is missing.' });
  }

  try {
    // In production: jwt.verify(token, process.env.AUTH_SECRET)
    // Decoded payload simulation
    req.user = {
      id: 'user-decoded-id',
      email: 'user@typefast.dev',
      username: 'typist'
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
