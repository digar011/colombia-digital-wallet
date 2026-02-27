import { Skeleton, SkeletonTable } from '@/components/ui';

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Search bar skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" className="h-10 flex-1 max-w-md" />
        <Skeleton variant="rectangular" className="h-10 w-28" />
      </div>

      {/* Table skeleton */}
      <SkeletonTable rows={5} columns={4} />
    </div>
  );
}
