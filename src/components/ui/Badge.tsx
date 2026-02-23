'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeStatus =
  | 'active'
  | 'valid'
  | 'pending'
  | 'expiring'
  | 'expired'
  | 'revoked'
  | 'info'
  | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}

const statusStyles: Record<BadgeStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  valid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  pending:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  expiring:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  revoked: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const dotColorStyles: Record<BadgeStatus, string> = {
  active: 'bg-green-500',
  valid: 'bg-green-500',
  pending: 'bg-yellow-500',
  expiring: 'bg-yellow-500',
  expired: 'bg-red-500',
  revoked: 'bg-red-500',
  info: 'bg-blue-500',
  default: 'bg-gray-500',
};

const sizeStyles: Record<string, string> = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

function Badge({
  className,
  status = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap',
        statusStyles[status],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'rounded-full shrink-0',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotColorStyles[status]
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge };
