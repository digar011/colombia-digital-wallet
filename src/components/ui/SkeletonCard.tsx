import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from './Skeleton';

export interface SkeletonCardProps {
  className?: string;
}

function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden',
        className
      )}
    >
      {/* Image area */}
      <Skeleton variant="rectangular" className="w-full h-36" />

      {/* Content area */}
      <div className="px-4 py-4 sm:px-6 space-y-3">
        {/* Title line */}
        <Skeleton variant="text" className="h-5 w-3/4" />

        {/* Description line */}
        <Skeleton variant="text" className="h-4 w-full" />

        {/* Badge placeholder */}
        <Skeleton variant="text" className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export { SkeletonCard };
