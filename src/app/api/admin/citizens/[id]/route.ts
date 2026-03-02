import type { NextRequest } from 'next/server';
import { createApiResponse, ApiErrors, withAuth } from '@/lib/utils/apiHelpers';
import { mockCitizens } from '@/lib/mock/adminData';

/**
 * GET /api/admin/citizens/[id]
 *
 * Returns a specific citizen's details by ID for the admin dashboard.
 * Protected by auth token.
 */
export const GET = withAuth(async (request: NextRequest) => {
  // Extract citizen ID from the URL pathname
  // Path format: /api/admin/citizens/{id}
  const segments = request.nextUrl.pathname.split('/');
  const citizenId = segments[segments.length - 1];

  if (!citizenId) {
    return ApiErrors.badRequest('El ID del ciudadano es requerido');
  }

  const citizen = mockCitizens.find((c) => c.id === citizenId);

  if (!citizen) {
    return ApiErrors.notFound('Ciudadano');
  }

  return createApiResponse(citizen);
});
