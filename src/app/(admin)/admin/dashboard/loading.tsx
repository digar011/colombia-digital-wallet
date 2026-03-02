import { Skeleton } from '@/components/ui/Skeleton';

// ─── Admin Dashboard Loading ─────────────────────────────────────────────────
// Skeleton matching the admin dashboard: header, stat cards, charts, activity.

export default function AdminDashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="space-y-6 animate-pulse"
    >
      {/* ── Header skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-64" />
          <Skeleton variant="text" className="h-4 w-80" />
        </div>
        <Skeleton variant="rectangular" className="h-10 w-32 rounded-lg" />
      </div>

      {/* ── Stats Cards skeleton ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden"
          >
            <Skeleton variant="rectangular" className="h-1 w-full rounded-none" />
            <div className="p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-4 w-28" />
                  <Skeleton variant="text" className="h-8 w-20" />
                  <Skeleton variant="text" className="h-3 w-36" />
                </div>
                <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row skeleton ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Trend Chart */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" className="h-5 w-56" />
              <Skeleton variant="text" className="h-6 w-28 rounded-full" />
            </div>
          </div>
          <div className="p-6">
            {/* Bar chart skeleton */}
            <div className="flex items-end gap-2 h-48">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={`bar-${i}`} className="flex-1 flex flex-col items-center gap-1">
                  <Skeleton variant="text" className="h-3 w-6" />
                  <Skeleton
                    variant="rectangular"
                    className="w-full rounded-t-md"
                    style={{ height: `${40 + ((i * 23) % 80)}px` }}
                  />
                  <Skeleton variant="text" className="h-3 w-8" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
              <Skeleton variant="text" className="h-3 w-24" />
              <Skeleton variant="text" className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Document Type Distribution */}
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <Skeleton variant="text" className="h-5 w-36" />
          </div>
          <div className="p-6">
            {/* Pie chart skeleton */}
            <Skeleton variant="circular" className="w-40 h-40 mx-auto mb-4" />
            {/* Legend */}
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`legend-${i}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" className="w-2.5 h-2.5" />
                    <Skeleton variant="text" className="h-3 w-24" />
                  </div>
                  <Skeleton variant="text" className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity Feed + Quick Actions skeleton ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <Skeleton variant="text" className="h-5 w-36" />
            <Skeleton variant="text" className="h-4 w-20" />
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`feed-${i}`} className="flex items-start gap-3 px-6 py-3">
                <Skeleton variant="rectangular" className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton variant="text" className="h-4 w-40" />
                  <Skeleton variant="text" className="h-3 w-56" />
                </div>
                <div className="space-y-1">
                  <Skeleton variant="text" className="h-3 w-16" />
                  <Skeleton variant="text" className="h-5 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <Skeleton variant="text" className="h-5 w-36" />
            </div>
            <div className="p-6 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`qaction-${i}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <Skeleton variant="rectangular" className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton variant="text" className="h-4 w-32" />
                    <Skeleton variant="text" className="h-3 w-44" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <Skeleton variant="text" className="h-5 w-36" />
              <Skeleton variant="text" className="h-4 w-24" />
            </div>
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`health-${i}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" className="w-2.5 h-2.5" />
                    <Skeleton variant="text" className="h-3 w-28" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton variant="text" className="h-3 w-10" />
                    <Skeleton variant="text" className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Stats Row skeleton ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`bottom-${i}`}
            className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="w-5 h-5" />
              <div className="space-y-1">
                <Skeleton variant="text" className="h-3 w-32" />
                <Skeleton variant="text" className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando panel administrativo...</span>
    </div>
  );
}
