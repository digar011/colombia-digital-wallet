import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { mockVehicles } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/vehicles
 *
 * Returns all vehicles registered to the authenticated citizen.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  return createApiResponse(mockVehicles, 200, {
    total: mockVehicles.length,
  });
});
