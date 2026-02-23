'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away' | null;
  className?: string;
  onClick?: () => void;
}

const sizeStyles: Record<string, { container: string; text: string; image: number; statusDot: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', image: 24, statusDot: 'w-2 h-2 border' },
  sm: { container: 'w-8 h-8', text: 'text-xs', image: 32, statusDot: 'w-2.5 h-2.5 border' },
  md: { container: 'w-10 h-10', text: 'text-sm', image: 40, statusDot: 'w-3 h-3 border-2' },
  lg: { container: 'w-14 h-14', text: 'text-lg', image: 56, statusDot: 'w-3.5 h-3.5 border-2' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', image: 80, statusDot: 'w-4 h-4 border-2' },
};

const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
  // Generate a consistent color based on the name string
  const colors = [
    'bg-colombia-blue',
    'bg-colombia-red',
    'bg-indigo-500',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-teal-600',
    'bg-orange-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
  onClick,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const { container, text, image, statusDot } = sizeStyles[size];
  const showImage = src && !imageError;
  const initials = name ? getInitials(name) : '?';
  const bgColor = name ? getColorFromName(name) : 'bg-gray-400';

  return (
    <div
      className={cn('relative inline-flex shrink-0', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center',
          container,
          onClick && 'cursor-pointer hover:ring-2 hover:ring-colombia-blue/30 dark:hover:ring-colombia-yellow/30 transition-all',
          !showImage && bgColor
        )}
      >
        {showImage ? (
          <Image
            src={src}
            alt={alt || name || 'Avatar'}
            width={image}
            height={image}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={cn('font-semibold text-white select-none', text)}>
            {initials}
          </span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white dark:border-gray-800',
            statusDot,
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

export { Avatar };
