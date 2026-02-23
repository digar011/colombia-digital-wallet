'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

// ─── Card Root ───────────────────────────────────────────────
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'flat';
  clickable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const cardVariantStyles: Record<string, string> = {
  elevated:
    'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg dark:shadow-gray-900/30',
  outlined:
    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  flat: 'bg-surface dark:bg-surface-dark',
};

const cardPaddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'elevated',
      clickable = false,
      padding = 'none',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        className={cn(
          'rounded-xl transition-all duration-200 overflow-hidden',
          cardVariantStyles[variant],
          cardPaddingStyles[padding],
          clickable &&
            'cursor-pointer active:scale-[0.98] hover:ring-2 hover:ring-colombia-blue/20 dark:hover:ring-colombia-yellow/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// ─── Card Header ─────────────────────────────────────────────
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, noBorder = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-4 py-3 sm:px-6 sm:py-4',
          !noBorder && 'border-b border-gray-100 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

// ─── Card Title ──────────────────────────────────────────────
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-lg font-semibold text-text-primary dark:text-text-primary-dark',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

// ─── Card Description ────────────────────────────────────────
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-text-secondary dark:text-text-secondary-dark mt-1',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

// ─── Card Body ───────────────────────────────────────────────
export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-4 py-4 sm:px-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBody.displayName = 'CardBody';

// ─── Card Footer ─────────────────────────────────────────────
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, noBorder = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-4 py-3 sm:px-6 sm:py-4',
          !noBorder && 'border-t border-gray-100 dark:border-gray-700',
          'flex items-center gap-3',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
