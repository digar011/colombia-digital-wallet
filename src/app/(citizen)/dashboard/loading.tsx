import { Skeleton } from '@/components/ui/Skeleton';

// ─── Citizen Dashboard Loading ───────────────────────────────────────────────
// Skeleton matching the dashboard layout: greeting header, stat cards,
// document carousel, quick actions grid, appointments, and programs.

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="min-h-screen bg-surface dark:bg-surface-dark pb-20 animate-pulse"
    >
      {/* ── Header / Greeting skeleton ── */}
      <div className="bg-gray-300 dark:bg-gray-700 px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="w-12 h-12 !bg-gray-400 dark:!bg-gray-600" />
            <div className="space-y-2">
              <Skeleton variant="text" className="h-3 w-20 !bg-gray-400 dark:!bg-gray-600" />
              <Skeleton variant="text" className="h-5 w-40 !bg-gray-400 dark:!bg-gray-600" />
            </div>
          </div>
          <Skeleton variant="circular" className="w-10 h-10 !bg-gray-400 dark:!bg-gray-600" />
        </div>
        {/* Verification badge skeleton */}
        <Skeleton variant="rectangular" className="h-8 w-56 rounded-lg !bg-gray-400 dark:!bg-gray-600 mt-2" />
      </div>

      {/* ── Quick Stats skeleton ── */}
      <div className="px-4 -mt-4">
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`stat-${i}`} className="flex flex-col items-center gap-1">
                <Skeleton variant="circular" className="w-10 h-10" />
                <Skeleton variant="text" className="h-5 w-8" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Document Carousel skeleton ── */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
        <div className="flex gap-3 overflow-hidden px-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`doc-${i}`}
              className="flex-shrink-0 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden"
            >
              <Skeleton variant="rectangular" className="h-24 w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton variant="text" className="h-3 w-24" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions Grid skeleton ── */}
      <div className="mt-6 px-4">
        <Skeleton variant="text" className="h-5 w-36 mb-3" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`action-${i}`} className="flex flex-col items-center gap-2 py-3">
              <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl" />
              <Skeleton variant="text" className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Appointments skeleton ── */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton variant="text" className="h-5 w-32" />
          <Skeleton variant="text" className="h-4 w-20" />
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-3 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`apt-${i}`} className="flex items-center gap-3">
              <Skeleton variant="rectangular" className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" className="h-4 w-40" />
                <Skeleton variant="text" className="h-3 w-28" />
              </div>
              <div className="space-y-1">
                <Skeleton variant="text" className="h-3 w-12" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Social Programs skeleton ── */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton variant="text" className="h-5 w-40" />
          <Skeleton variant="text" className="h-4 w-20" />
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-3 space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`prog-${i}`} className="flex items-center gap-3">
              <Skeleton variant="rectangular" className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" className="h-4 w-36" />
                <Skeleton variant="text" className="h-3 w-48" />
              </div>
              <Skeleton variant="text" className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Emergency button skeleton ── */}
      <div className="mt-6 px-4 mb-6">
        <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando panel principal...</span>
    </div>
  );
}
