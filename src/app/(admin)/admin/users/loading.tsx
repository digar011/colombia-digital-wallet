import { Skeleton } from '@/components/ui/Skeleton';

// ─── Admin Users Page Loading ────────────────────────────────────────────────
// Skeleton matching the users management page: header, search/filters, table.

export default function AdminUsersLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="space-y-6 animate-pulse"
    >
      {/* ── Header skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-52" />
          <Skeleton variant="text" className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" className="h-10 w-28 rounded-lg" />
          <Skeleton variant="rectangular" className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      {/* ── Search & Filters skeleton ── */}
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton variant="rectangular" className="h-10 flex-1 rounded-lg" />
          <Skeleton variant="rectangular" className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* ── Users Table skeleton ── */}
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Skeleton variant="rectangular" className="w-4 h-4 rounded" />
          <Skeleton variant="text" className="h-3 w-20" />
          <Skeleton variant="text" className="h-3 w-24 hidden md:block" />
          <Skeleton variant="text" className="h-3 w-16" />
          <Skeleton variant="text" className="h-3 w-24 hidden lg:block" />
          <Skeleton variant="text" className="h-3 w-28 hidden md:block" />
          <Skeleton variant="text" className="h-3 w-20 hidden xl:block" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`row-${i}`}
            className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700/50"
          >
            {/* Checkbox */}
            <Skeleton variant="rectangular" className="w-4 h-4 rounded flex-shrink-0" />

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 min-w-0 w-48">
              <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
              <div className="flex-1 space-y-1 min-w-0">
                <Skeleton variant="text" className="h-4 w-32" />
                <Skeleton variant="text" className="h-3 w-40" />
              </div>
            </div>

            {/* Document number */}
            <div className="space-y-1 hidden md:block">
              <Skeleton variant="text" className="h-4 w-28" />
              <Skeleton variant="text" className="h-3 w-20" />
            </div>

            {/* Status badge */}
            <Skeleton variant="text" className="h-6 w-20 rounded-full" />

            {/* Department */}
            <div className="space-y-1 hidden lg:block">
              <Skeleton variant="text" className="h-4 w-24" />
              <Skeleton variant="text" className="h-3 w-20" />
            </div>

            {/* Last active */}
            <Skeleton variant="text" className="h-4 w-20 hidden md:block" />

            {/* Documents count */}
            <Skeleton variant="text" className="h-4 w-12 hidden xl:block" />

            {/* Actions */}
            <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Skeleton variant="text" className="h-4 w-48" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`page-${i}`} variant="rectangular" className="w-8 h-8 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando gestion de ciudadanos...</span>
    </div>
  );
}
