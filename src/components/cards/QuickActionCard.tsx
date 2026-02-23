'use client';

import React from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';

export interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  color?: 'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'gray';
  disabled?: boolean;
  badge?: string;
  showArrow?: boolean;
  className?: string;
}

const colorMap: Record<
  string,
  { iconBg: string; iconColor: string; hoverBg: string }
> = {
  blue: {
    iconBg: 'bg-colombia-blue/10 dark:bg-colombia-blue/20',
    iconColor: 'text-colombia-blue dark:text-colombia-blue-light',
    hoverBg: 'hover:bg-colombia-blue/5 dark:hover:bg-colombia-blue/10',
  },
  yellow: {
    iconBg: 'bg-colombia-yellow/20 dark:bg-colombia-yellow/10',
    iconColor: 'text-colombia-yellow-dark dark:text-colombia-yellow',
    hoverBg: 'hover:bg-colombia-yellow/5 dark:hover:bg-colombia-yellow/10',
  },
  red: {
    iconBg: 'bg-colombia-red/10 dark:bg-colombia-red/20',
    iconColor: 'text-colombia-red dark:text-colombia-red-light',
    hoverBg: 'hover:bg-colombia-red/5 dark:hover:bg-colombia-red/10',
  },
  green: {
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/10',
  },
  purple: {
    iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/10',
  },
  orange: {
    iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/10',
  },
  gray: {
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-400',
    hoverBg: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
  },
};

function QuickActionCard({
  icon: Icon,
  label,
  description,
  onClick,
  color = 'blue',
  disabled = false,
  badge,
  showArrow = true,
  className,
}: QuickActionCardProps) {
  const colors = colorMap[color];

  return (
    <Card
      variant="outlined"
      clickable={!disabled}
      onClick={disabled ? undefined : onClick}
      className={cn(
        'transition-all duration-200',
        !disabled && colors.hoverBg,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex items-center gap-3 p-3 sm:p-4">
        {/* Icon container */}
        <div
          className={cn(
            'shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl',
            colors.iconBg
          )}
        >
          <Icon size={20} className={colors.iconColor} />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark truncate">
              {label}
            </p>
            {badge && (
              <span className="shrink-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-colombia-red text-white">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Arrow */}
        {showArrow && !disabled && (
          <ChevronRight
            size={18}
            className="shrink-0 text-text-secondary/40 dark:text-text-secondary-dark/40"
          />
        )}
      </div>
    </Card>
  );
}

export { QuickActionCard };
