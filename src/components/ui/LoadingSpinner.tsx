'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap: Record<string, { container: string; ring: string; dotSize: string }> = {
  sm: { container: 'w-5 h-5', ring: 'w-5 h-5', dotSize: 'w-1 h-1' },
  md: { container: 'w-8 h-8', ring: 'w-8 h-8', dotSize: 'w-1.5 h-1.5' },
  lg: { container: 'w-12 h-12', ring: 'w-12 h-12', dotSize: 'w-2 h-2' },
  xl: { container: 'w-16 h-16', ring: 'w-16 h-16', dotSize: 'w-2.5 h-2.5' },
};

function LoadingSpinner({
  size = 'md',
  label,
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { container, ring } = sizeMap[size];

  const spinner = (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className={cn('relative', container)}>
        {/* Outer ring - Colombia yellow */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-transparent animate-spin',
            ring
          )}
          style={{
            borderTopColor: '#FCD116',
            borderRightColor: '#FCD116',
            animationDuration: '1s',
          }}
        />
        {/* Middle ring - Colombia blue */}
        <div
          className={cn(
            'absolute rounded-full border-2 border-transparent animate-spin',
            ring
          )}
          style={{
            borderBottomColor: '#003893',
            borderLeftColor: '#003893',
            animationDuration: '1.5s',
            animationDirection: 'reverse',
            inset: '2px',
          }}
        />
        {/* Center dot - Colombia red */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse-gentle"
          style={{
            backgroundColor: '#CE1126',
            width: size === 'sm' ? 4 : size === 'md' ? 6 : size === 'lg' ? 8 : 10,
            height: size === 'sm' ? 4 : size === 'md' ? 6 : size === 'lg' ? 8 : 10,
          }}
        />
      </div>
      {label && (
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark animate-pulse-gentle">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export { LoadingSpinner };
