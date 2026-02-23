'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCountry } from '@/lib/contexts/CountryContext';
import type { CountryId } from '@/config';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CountrySwitcherProps {
  /** Compact mode shows only the flag. Full mode shows flag + name. */
  variant?: 'compact' | 'full';
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function CountrySwitcher({
  variant = 'full',
  className,
}: CountrySwitcherProps) {
  const { country, countryId, setCountry, allCountries } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (id: CountryId) => {
      setCountry(id);
      setIsOpen(false);
    },
    [setCountry]
  );

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg',
          'transition-all duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue',
          variant === 'compact'
            ? 'p-2'
            : 'px-3 py-2 border border-gray-200 dark:border-gray-700'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Seleccionar pais"
      >
        <span className="text-xl leading-none">{country.flag}</span>
        {variant === 'full' && (
          <>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {country.name}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                'text-gray-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-1 z-50',
            'w-56 py-1',
            'bg-white dark:bg-gray-900',
            'rounded-xl shadow-lg',
            'border border-gray-200 dark:border-gray-700',
            'animate-fade-in'
          )}
          role="listbox"
          aria-label="Paises disponibles"
        >
          {allCountries.map((c) => {
            const isSelected = c.id === countryId;

            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(c.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3',
                  'transition-colors duration-150',
                  'text-left',
                  isSelected
                    ? 'bg-colombia-blue/5 dark:bg-colombia-yellow/5'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <span className="text-2xl leading-none">{c.flag}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isSelected
                        ? 'text-colombia-blue dark:text-colombia-yellow'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {c.fullName}
                  </p>
                </div>
                {isSelected && (
                  <Check
                    size={16}
                    className="text-colombia-blue dark:text-colombia-yellow flex-shrink-0"
                  />
                )}
              </button>
            );
          })}

          {/* Demo indicator */}
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] text-gray-400 text-center">
              Modo demo - Cambiar configuracion del pais
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountrySwitcher;
