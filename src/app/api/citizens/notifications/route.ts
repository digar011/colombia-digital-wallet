import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { mockNotifications } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/notifications
 *
 * Returns all notifications for the authenticated citizen.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return createApiResponse(mockNotifications, 200, {
    total: mockNotifications.length,
    unread: unreadCount,
  });
});
