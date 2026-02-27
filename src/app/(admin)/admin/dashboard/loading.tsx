import { Skeleton, SkeletonTable } from '@/components/ui';

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-4 sm:p-6 space-y-3"
          >
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-8 w-16" />
            <Skeleton variant="text" className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <SkeletonTable rows={5} columns={4} />
    </div>
  );
}
