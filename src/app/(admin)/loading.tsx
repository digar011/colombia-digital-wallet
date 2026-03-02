import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonTable } from '@/components/ui/SkeletonTable';

// ─── Admin Route Group Loading ───────────────────────────────────────────────
// Displayed while any admin page is loading within the (admin) route group.

export default function AdminLoading() {
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

      {/* Table skeleton */}
      <SkeletonTable rows={6} columns={5} />

      {/* Screen reader text */}
      <span className="sr-only">Cargando panel administrativo...</span>
    </div>
  );
}
