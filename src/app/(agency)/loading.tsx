import { Skeleton } from '@/components/ui/Skeleton';

// ─── Agency Route Group Loading ──────────────────────────────────────────────
// Displayed while any agency page is loading within the (agency) route group.

export default function AgencyLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="space-y-6 animate-pulse"
    >
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-64" />
          <Skeleton variant="text" className="h-4 w-48" />
        </div>
        <Skeleton variant="rectangular" className="h-10 w-32" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-6 space-y-3"
          >
            <Skeleton variant="text" className="h-4 w-28" />
            <Skeleton variant="text" className="h-8 w-20" />
            <Skeleton variant="text" className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Two-column layout: activity feed + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed skeleton */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-gray-800 shadow-md p-6 space-y-4">
          <Skeleton variant="text" className="h-5 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`activity-${i}`} className="flex items-center gap-3">
              <Skeleton variant="circular" className="w-8 h-8" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" className="h-4 w-3/4" />
                <Skeleton variant="text" className="h-3 w-1/2" />
              </div>
              <Skeleton variant="text" className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Quick actions skeleton */}
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-6 space-y-4">
          <Skeleton variant="text" className="h-5 w-36" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`action-${i}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
            >
              <Skeleton variant="rectangular" className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" className="h-4 w-32" />
                <Skeleton variant="text" className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando portal de agencia...</span>
    </div>
  );
}
