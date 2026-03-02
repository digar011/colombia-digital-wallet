import { Skeleton } from '@/components/ui/Skeleton';

// ─── Admin Documents Page Loading ────────────────────────────────────────────
// Skeleton matching the documents management page: header, stat cards,
// tab navigation, and table content.

export default function AdminDocumentsLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="space-y-6 animate-pulse"
    >
      {/* ── Header skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-56" />
          <Skeleton variant="text" className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" className="h-10 w-28 rounded-lg" />
          <Skeleton variant="rectangular" className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      {/* ── Stats Cards skeleton ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton variant="rectangular" className="w-10 h-10 rounded-lg" />
              <div className="space-y-1">
                <Skeleton variant="text" className="h-3 w-20" />
                <Skeleton variant="text" className="h-6 w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Navigation skeleton ── */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-0 -mb-px">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`tab-${i}`} className="flex items-center gap-2 px-5 py-3">
              <Skeleton variant="text" className="h-4 w-28" />
              <Skeleton variant="text" className="h-5 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Table Content skeleton ── */}
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Skeleton variant="rectangular" className="w-4 h-4 rounded" />
          <Skeleton variant="text" className="h-3 w-20" />
          <Skeleton variant="text" className="h-3 w-20" />
          <Skeleton variant="text" className="h-3 w-16" />
          <Skeleton variant="text" className="h-3 w-16 hidden md:block" />
          <Skeleton variant="text" className="h-3 w-16 hidden lg:block" />
          <Skeleton variant="text" className="h-3 w-20 hidden lg:block" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`row-${i}`}
            className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700/50"
          >
            {/* Checkbox */}
            <Skeleton variant="rectangular" className="w-4 h-4 rounded flex-shrink-0" />

            {/* Document type + icon */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Skeleton variant="rectangular" className="w-9 h-9 rounded-lg flex-shrink-0" />
              <div className="space-y-1 min-w-0">
                <Skeleton variant="text" className="h-4 w-36" />
                <Skeleton variant="text" className="h-3 w-28" />
              </div>
            </div>

            {/* Citizen name */}
            <Skeleton variant="text" className="h-4 w-28" />

            {/* Status badge */}
            <Skeleton variant="text" className="h-6 w-20 rounded-full" />

            {/* Issued date */}
            <Skeleton variant="text" className="h-4 w-20 hidden md:block" />

            {/* Expiry date */}
            <Skeleton variant="text" className="h-4 w-20 hidden lg:block" />

            {/* Issued by */}
            <Skeleton variant="text" className="h-3 w-24 hidden lg:block" />

            {/* Actions */}
            <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Skeleton variant="text" className="h-4 w-40" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`page-${i}`} variant="rectangular" className="w-8 h-8 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando gestion de documentos...</span>
    </div>
  );
}
