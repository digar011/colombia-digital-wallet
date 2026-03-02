import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { mockFamily } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/family
 *
 * Returns the family members linked to the authenticated citizen.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  return createApiResponse(mockFamily, 200, {
    total: mockFamily.length,
  });
});
