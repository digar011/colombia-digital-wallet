import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { registerSchema } from '@/lib/validations';
import { createApiResponse, ApiErrors } from '@/lib/utils/apiHelpers';
import { logAuthEvent } from '@/lib/utils/logger';
import { authLimiter } from '@/lib/middleware/rateLimit';

/**
 * POST /api/auth/register
 *
 * Registers a new citizen account.
 * Validates the full registration form with Zod, rate-limits by IP,
 * logs the registration event, and returns mock user data.
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
    logAuthEvent('register', undefined, undefined, {
      reason: 'invalid_json',
      ip: identifier,
      success: false,
    });
    return ApiErrors.badRequest('El cuerpo de la solicitud no es JSON valido');
  }

  // Validate with Zod schema
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    logAuthEvent('register', undefined, undefined, {
      reason: 'validation_error',
      ip: identifier,
      success: false,
    });
    return ApiErrors.validationError(details);
  }

  const { email, first_name, last_name, document_type, document_number, date_of_birth } =
    parsed.data;

  // Mock registration — in production this would create a Supabase Auth user
  const mockUserId = `usr-${Date.now()}`;

  logAuthEvent('register', mockUserId, email, { ip: identifier });

  return createApiResponse(
    {
      user: {
        id: mockUserId,
        email,
        firstName: first_name,
        lastName: last_name,
        documentType: document_type,
        documentNumber: document_number,
        dateOfBirth: date_of_birth,
        role: 'citizen',
        verified: false,
        createdAt: new Date().toISOString(),
      },
    },
    201
  );
}
