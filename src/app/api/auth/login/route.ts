import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { createApiResponse, ApiErrors } from '@/lib/utils/apiHelpers';
import { logAuthEvent } from '@/lib/utils/logger';
import { authLimiter } from '@/lib/middleware/rateLimit';

/**
 * POST /api/auth/login
 *
 * Authenticates a user with email and password credentials.
 * Validates input with Zod, rate-limits by IP, logs auth events,
 * and returns a mock auth token on success.
 */
export async function POST(request: NextRequest) {
  const identifier =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit check
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
          'Retry-After': String(
            Math.ceil(
              (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
            )
          ),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
        },
      }
    );
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logAuthEvent('failed_login', undefined, undefined, {
      reason: 'invalid_json',
      ip: identifier,
    });
    return ApiErrors.badRequest('El cuerpo de la solicitud no es JSON valido');
  }

  // Validate with Zod schema
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    logAuthEvent('failed_login', undefined, undefined, {
      reason: 'validation_error',
      ip: identifier,
    });
    return ApiErrors.validationError(details);
  }

  const { email } = parsed.data;

  // Mock authentication — in production this would verify against Supabase Auth
  const mockToken = `demo-token-${Date.now()}`;

  logAuthEvent('login', 'mock-user', email, { ip: identifier });

  // Set auth-token cookie and return response
  const response = createApiResponse(
    {
      user: {
        id: 'mock-user',
        email,
        name: 'Juan Carlos Rodriguez Martinez',
        role: 'citizen',
      },
      token: mockToken,
    },
    200
  );

  response.cookies.set('auth-token', mockToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
