import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

// ─── Documents Page Loading ──────────────────────────────────────────────────
// Skeleton matching the documents hub: search bar, filter chips, document grid.

export default function DocumentsLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="min-h-screen bg-surface dark:bg-surface-dark pb-20 animate-pulse"
    >
      {/* ── Header with search + filters ── */}
      <div className="bg-white dark:bg-gray-800 px-4 pt-12 pb-4 shadow-sm">
        {/* Title */}
        <Skeleton variant="text" className="h-7 w-40 mb-4" />

        {/* Search bar skeleton */}
        <Skeleton variant="rectangular" className="h-10 w-full rounded-lg" />

        {/* Filter chips skeleton */}
        <div className="flex gap-2 mt-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={`filter-${i}`}
              variant="text"
              className="h-8 rounded-full flex-shrink-0"
              style={{ width: `${60 + i * 8}px` }}
            />
          ))}
        </div>
      </div>

      {/* ── Document Grid skeleton ── */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`doc-${i}`} />
          ))}
        </div>
      </div>

      {/* ── Document count skeleton ── */}
      <div className="px-4 mt-4 flex justify-center">
        <Skeleton variant="text" className="h-4 w-32" />
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando documentos...</span>
    </div>
  );
}
