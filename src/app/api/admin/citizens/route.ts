import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { adminLimiter } from '@/lib/middleware/rateLimit';
import { mockCitizens } from '@/lib/mock/adminData';

/**
 * GET /api/admin/citizens
 *
 * Returns a paginated list of citizens for the admin dashboard.
 * Supports search via ?query=, pagination via ?page= and ?limit=.
 * Protected by auth token. Rate limited with adminLimiter.
 */
export const GET = withAuth(async (request: NextRequest) => {
  const identifier =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit check
  const rateLimitResult = adminLimiter.checkRateLimit(identifier);
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

  // Extract query parameters
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query')?.toLowerCase() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10))
  );

  // Filter citizens by search query (name, email, document number)
  let filtered = mockCitizens;
  if (query) {
    filtered = mockCitizens.filter(
      (citizen) =>
        citizen.firstName.toLowerCase().includes(query) ||
        citizen.lastName.toLowerCase().includes(query) ||
        citizen.email.toLowerCase().includes(query) ||
        citizen.documentNumber.includes(query)
    );
  }

  // Paginate results
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  return createApiResponse(paginated, 200, {
    page,
    limit,
    total,
    totalPages,
  });
});
