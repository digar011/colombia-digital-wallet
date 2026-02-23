'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';

export interface StatCardProps {
  label: string;
  count: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: LucideIcon;
  color?: 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'gray';
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const colorStyles: Record<
  string,
  { bg: string; iconBg: string; iconColor: string; accent: string }
> = {
  blue: {
    bg: 'bg-colombia-blue/5 dark:bg-colombia-blue/10',
    iconBg: 'bg-colombia-blue/10 dark:bg-colombia-blue/20',
    iconColor: 'text-colombia-blue dark:text-colombia-blue-light',
    accent: 'text-colombia-blue',
  },
  yellow: {
    bg: 'bg-colombia-yellow/10 dark:bg-colombia-yellow/5',
    iconBg: 'bg-colombia-yellow/20 dark:bg-colombia-yellow/10',
    iconColor: 'text-colombia-yellow-dark dark:text-colombia-yellow',
    accent: 'text-colombia-yellow-dark',
  },
  red: {
    bg: 'bg-colombia-red/5 dark:bg-colombia-red/10',
    iconBg: 'bg-colombia-red/10 dark:bg-colombia-red/20',
    iconColor: 'text-colombia-red dark:text-colombia-red-light',
    accent: 'text-colombia-red',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/10',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    accent: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    accent: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    accent: 'text-orange-600',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-400',
    accent: 'text-gray-600',
  },
};

function StatCard({
  label,
  count,
  trend,
  icon: Icon,
  color = 'blue',
  loading = false,
  className,
  onClick,
}: StatCardProps) {
  const colors = colorStyles[color];

  const TrendIcon =
    trend?.direction === 'up'
      ? TrendingUp
      : trend?.direction === 'down'
      ? TrendingDown
      : Minus;

  const trendColor =
    trend?.direction === 'up'
      ? 'text-green-600 dark:text-green-400'
      : trend?.direction === 'down'
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-500 dark:text-gray-400';

  return (
    <Card
      variant="elevated"
      clickable={!!onClick}
      onClick={onClick}
      className={cn('overflow-hidden', className)}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1">
              {label}
            </p>
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark">
                {typeof count === 'number' ? count.toLocaleString('es-CO') : count}
              </p>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'shrink-0 p-2.5 rounded-xl',
                colors.iconBg
              )}
            >
              <Icon size={22} className={colors.iconColor} />
            </div>
          )}
        </div>

        {trend && !loading && (
          <div className="flex items-center gap-1.5 mt-3">
            <div className={cn('flex items-center gap-0.5', trendColor)}>
              <TrendIcon size={14} />
              <span className="text-xs font-semibold">
                {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '' : ''}
                {trend.value}%
              </span>
            </div>
            {trend.label && (
              <span className="text-[10px] text-text-secondary dark:text-text-secondary-dark">
                {trend.label}
              </span>
            )}
          </div>
        )}

        {loading && (
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-3" />
        )}
      </div>

      {/* Bottom color accent bar */}
      <div className={cn('h-1', colors.bg.replace('/5', '').replace('/10', ''))}>
        <div
          className={cn(
            'h-full',
            color === 'blue' ? 'bg-colombia-blue' :
            color === 'yellow' ? 'bg-colombia-yellow' :
            color === 'red' ? 'bg-colombia-red' :
            color === 'green' ? 'bg-green-500' :
            color === 'purple' ? 'bg-purple-500' :
            color === 'orange' ? 'bg-orange-500' :
            'bg-gray-400'
          )}
        />
      </div>
    </Card>
  );
}

export { StatCard };
