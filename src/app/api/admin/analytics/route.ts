import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import {
  mockAnalytics,
  mockDashboardStats,
  mockDepartmentStats,
} from '@/lib/mock/adminData';

/**
 * GET /api/admin/analytics
 *
 * Returns analytics data for the admin dashboard.
 * Includes daily analytics, dashboard stats, and department-level stats.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  return createApiResponse({
    analytics: mockAnalytics,
    dashboardStats: mockDashboardStats,
    departmentStats: mockDepartmentStats,
  });
});
