import { Skeleton, SkeletonCard } from '@/components/ui';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Greeting skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" className="h-7 w-48" />
        <Skeleton variant="text" className="h-4 w-72" />
      </div>

      {/* Dashboard cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
