import type { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/utils/apiHelpers';
import { logAuthEvent } from '@/lib/utils/logger';

/**
 * POST /api/auth/logout
 *
 * Logs the user out by clearing the auth-token cookie.
 * Logs the logout event for audit trail.
 */
export async function POST(request: NextRequest) {
  // Extract user info from cookie before clearing it
  const authToken = request.cookies.get('auth-token')?.value;
  const userId = authToken ? 'mock-user' : undefined;

  const identifier =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  logAuthEvent('logout', userId, undefined, { ip: identifier });

  // Clear the auth-token cookie
  const response = createApiResponse({ message: 'Sesion cerrada exitosamente' });

  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Expire immediately
  });

  return response;
}
