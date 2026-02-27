'use client';

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const inputSizeStyles: Record<string, string> = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
};

const labelSizeStyles: Record<string, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconSizeMap: Record<string, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      inputSize = 'md',
      fullWidth = true,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperTextId = inputId ? `${inputId}-helper` : undefined;
    const iconSize = iconSizeMap[inputSize];

    const resolvedType = isPassword
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'font-medium text-text-primary dark:text-text-primary-dark',
              labelSizeStyles[inputSize]
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark pointer-events-none">
              <LeftIcon size={iconSize} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            className={cn(
              'w-full rounded-lg border bg-white dark:bg-gray-800 transition-all duration-200',
              'text-text-primary dark:text-text-primary-dark',
              'placeholder:text-text-secondary/50 dark:placeholder:text-text-secondary-dark/50',
              'focus:outline-none focus:ring-2 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-colombia-red focus:ring-colombia-red/30 focus:border-colombia-red'
                : 'border-gray-200 dark:border-gray-600 focus:ring-colombia-blue/30 focus:border-colombia-blue dark:focus:ring-colombia-yellow/30 dark:focus:border-colombia-yellow',
              inputSizeStyles[inputSize],
              LeftIcon && 'pl-10',
              (isPassword || RightIcon) && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff size={iconSize} />
              ) : (
                <Eye size={iconSize} />
              )}
            </button>
          )}
          {!isPassword && RightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark',
                onRightIconClick
                  ? 'cursor-pointer hover:text-text-primary dark:hover:text-text-primary-dark transition-colors'
                  : 'pointer-events-none'
              )}
              onClick={onRightIconClick}
              role={onRightIconClick ? 'button' : undefined}
              tabIndex={onRightIconClick ? -1 : undefined}
            >
              <RightIcon size={iconSize} />
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-colombia-red font-medium" role="alert">{error}</p>
        )}
        {!error && helperText && (
          <p id={helperTextId} className="text-xs text-text-secondary dark:text-text-secondary-dark">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
