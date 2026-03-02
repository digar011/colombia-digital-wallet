import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { mockHealth } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/health
 *
 * Returns the health record for the authenticated citizen.
 * Includes EPS affiliation, SISBEN data, vaccinations, allergies, and conditions.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  return createApiResponse(mockHealth);
});
