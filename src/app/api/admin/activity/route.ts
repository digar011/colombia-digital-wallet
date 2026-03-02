import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { mockActivityLog } from '@/lib/mock/adminData';

/**
 * GET /api/admin/activity
 *
 * Returns the activity log for the admin dashboard.
 * Includes recent registrations, verifications, document issuances,
 * profile updates, and suspensions.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  return createApiResponse(mockActivityLog, 200, {
    total: mockActivityLog.length,
  });
});
