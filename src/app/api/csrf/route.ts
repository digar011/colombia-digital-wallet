import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCsrfToken, setCsrfCookie } from '@/lib/utils/csrf';
import { authLimiter } from '@/lib/middleware/rateLimit';

/**
 * GET /api/csrf
 *
 * Issues a CSRF token using the double-submit cookie pattern.
 * The token is returned in the JSON body and also set as an httpOnly cookie.
 * Clients must include the token in the X-CSRF-Token header on state-changing requests.
 *
 * Rate limited by the authLimiter (10 requests/minute per IP).
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting using client IP
  const identifier = request.headers.get('x-forwarded-for')
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';

  const rateLimitResult = authLimiter.checkRateLimit(identifier);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Demasiadas solicitudes. Intente de nuevo mas tarde.',
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.resetAt.getTime() - Date.now()) / 1000)),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
        },
      }
    );
  }

  // Generate and set CSRF token
  const token = generateCsrfToken();
  const response = NextResponse.json(
    { success: true, data: { csrfToken: token } },
    {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
      },
    }
  );

  setCsrfCookie(response, token);
  return response;
}
