import { Skeleton } from '@/components/ui/Skeleton';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

// ─── Citizen Route Group Loading ─────────────────────────────────────────────
// Displayed while any citizen page is loading within the (citizen) route group.

export default function CitizenLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="space-y-6 animate-pulse"
    >
      {/* Page title skeleton */}
      <Skeleton variant="text" className="h-7 w-48" />
      <Skeleton variant="text" className="h-4 w-64" />

      {/* Stat cards row */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col items-center gap-2"
          >
            <Skeleton variant="circular" className="w-10 h-10" />
            <Skeleton variant="text" className="h-5 w-10" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Document cards */}
      <div className="space-y-4">
        <Skeleton variant="text" className="h-5 w-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`card-${i}`} />
          ))}
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando contenido...</span>
    </div>
  );
}
