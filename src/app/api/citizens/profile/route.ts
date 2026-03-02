import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateProfileSchema } from '@/lib/validations';
import {
  createApiResponse,
  ApiErrors,
  withAuth,
} from '@/lib/utils/apiHelpers';
import { csrfProtect } from '@/lib/utils/csrf';
import { citizenApiLimiter } from '@/lib/middleware/rateLimit';
import { mockCitizen } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/profile
 *
 * Returns the authenticated citizen's profile.
 * Protected by auth token and rate limited.
 */
export const GET = withAuth(async (request: NextRequest) => {
  const identifier =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit check
  const rateLimitResult = citizenApiLimiter.checkRateLimit(identifier);
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

  return createApiResponse(mockCitizen);
});

/**
 * PUT /api/citizens/profile
 *
 * Updates the authenticated citizen's profile.
 * Protected by auth token, CSRF validation, and Zod schema.
 */
export const PUT = withAuth(async (request: NextRequest) => {
  // CSRF protection
  const csrf = csrfProtect(request);
  if (!csrf.valid) {
    return ApiErrors.forbidden(csrf.error ?? 'Token CSRF invalido');
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return ApiErrors.badRequest('El cuerpo de la solicitud no es JSON valido');
  }

  // Validate with Zod schema
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    return ApiErrors.validationError(details);
  }

  // Merge updates into the mock profile
  const updatedProfile = {
    ...mockCitizen,
    ...parsed.data,
    lastVerified: new Date().toISOString(),
  };

  return createApiResponse(updatedProfile);
});
