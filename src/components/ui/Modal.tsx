'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-[95vw] sm:max-w-2xl',
};

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus the content on open for accessibility
      contentRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Content */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-slide-up',
          'max-h-[90vh] flex flex-col',
          'focus:outline-none',
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-5 pt-5 pb-0">
            <div className="flex-1 min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-text-primary dark:text-text-primary-dark truncate pr-2"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'shrink-0 p-1.5 rounded-lg transition-colors',
                  'text-text-secondary hover:text-text-primary hover:bg-gray-100',
                  'dark:text-text-secondary-dark dark:hover:text-text-primary-dark dark:hover:bg-gray-700'
                )}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center justify-end gap-3 px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export { Modal };
