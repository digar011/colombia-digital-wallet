import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from './Skeleton';

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden',
        className
      )}
    >
      {/* Header row */}
      <div className="grid gap-4 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 dark:border-gray-700"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" className="h-4 w-3/4" />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`row-${rowIdx}`}
          className="grid gap-4 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={`cell-${rowIdx}-${colIdx}`}
              variant="text"
              className={cn(
                'h-4',
                colIdx === 0 ? 'w-full' : 'w-2/3'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export { SkeletonTable };
