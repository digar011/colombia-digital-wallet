'use client';

import React, { forwardRef } from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-colombia-blue text-white hover:bg-colombia-blue-light active:bg-colombia-blue-dark shadow-sm hover:shadow-md focus-visible:ring-colombia-blue',
  secondary:
    'bg-colombia-yellow text-colombia-blue hover:bg-colombia-yellow-light active:bg-colombia-yellow-dark shadow-sm hover:shadow-md focus-visible:ring-colombia-yellow',
  outline:
    'border-2 border-colombia-blue text-colombia-blue hover:bg-colombia-blue hover:text-white dark:border-colombia-yellow dark:text-colombia-yellow dark:hover:bg-colombia-yellow dark:hover:text-colombia-blue focus-visible:ring-colombia-blue',
  ghost:
    'text-colombia-blue hover:bg-colombia-blue/10 dark:text-colombia-yellow dark:hover:bg-colombia-yellow/10 focus-visible:ring-colombia-blue',
  danger:
    'bg-colombia-red text-white hover:bg-colombia-red-light active:bg-colombia-red-dark shadow-sm hover:shadow-md focus-visible:ring-colombia-red',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
};

const iconSizeMap: Record<string, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      disabled,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = iconSizeMap[size];
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />
        ) : LeftIcon ? (
          <LeftIcon size={iconSize} aria-hidden="true" />
        ) : null}
        {children}
        {!isLoading && RightIcon && <RightIcon size={iconSize} aria-hidden="true" />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
