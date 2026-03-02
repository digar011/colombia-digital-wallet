import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { mockWork } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/work
 *
 * Returns the employment and tax record for the authenticated citizen.
 * Includes RUT, employment details, pension, ARL, cesantias, and caja info.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  return createApiResponse(mockWork);
});
