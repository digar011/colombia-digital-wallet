'use client';

import React from 'react';
import { type LucideIcon, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button, type ButtonProps } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
    icon?: LucideIcon;
  };
  className?: string;
  compact?: boolean;
}

function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8 px-4' : 'py-16 px-6',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800',
          compact ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-4'
        )}
      >
        <Icon
          size={compact ? 24 : 32}
          className="text-text-secondary dark:text-text-secondary-dark"
        />
      </div>

      <h3
        className={cn(
          'font-semibold text-text-primary dark:text-text-primary-dark',
          compact ? 'text-base' : 'text-lg'
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'text-text-secondary dark:text-text-secondary-dark mt-1.5 max-w-sm',
            compact ? 'text-xs' : 'text-sm'
          )}
        >
          {description}
        </p>
      )}

      {action && (
        <div className={cn(compact ? 'mt-4' : 'mt-6')}>
          <Button
            variant={action.variant || 'primary'}
            size={compact ? 'sm' : 'md'}
            leftIcon={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export { EmptyState };
