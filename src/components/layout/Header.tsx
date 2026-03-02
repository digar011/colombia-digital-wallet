'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCountry } from '@/lib/contexts/CountryContext';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface HeaderProps {
  /** Number of unread notifications. */
  notificationCount?: number;
  /** User avatar URL. Falls back to initials placeholder. */
  avatarUrl?: string;
  /** User display name for avatar fallback. */
  userName?: string;
  /** Whether the pull-to-refresh is currently active. */
  isRefreshing?: boolean;
  /** Callback when user triggers refresh (via button or pull). */
  onRefresh?: () => void;
  className?: string;
}

// ─── Avatar fallback ────────────────────────────────────────────────────────

function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

// ─── Header Component ───────────────────────────────────────────────────────

export function Header({
  notificationCount = 0,
  avatarUrl,
  userName,
  isRefreshing = false,
  onRefresh,
  className,
}: HeaderProps) {
  const { country } = useCountry();
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const appName =
    country.id === 'CO'
      ? 'Mi Colombia Digital'
      : country.id === 'EC'
        ? 'Mi Ecuador Digital'
        : 'Mi Guatemala Digital';

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'bg-white/95 dark:bg-gray-900/95',
        'backdrop-blur-lg',
        'border-b border-gray-100 dark:border-gray-800',
        'header-safe',
        className
      )}
    >
      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div className="flex items-center justify-center py-2 bg-gray-50 dark:bg-gray-800 animate-slide-down">
          <RefreshCw size={16} className="animate-spin text-colombia-blue mr-2" />
          <span className="text-xs text-gray-500">Actualizando...</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* Left: Flag + App name */}
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl leading-none flex-shrink-0" role="img" aria-label={`Bandera de ${country.name}`}>
            {country.flag}
          </span>
          <div className="min-w-0">
            <h1
              className="text-base font-bold leading-tight truncate"
              style={{ color: country.colors.secondary }}
            >
              {appName}
            </h1>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5 truncate">
              {country.fullName}
            </p>
          </div>
        </Link>

        {/* Right: Notification + Avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notification bell */}
          <button
            type="button"
            className={cn(
              'relative p-2 rounded-full',
              'transition-colors duration-200',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'active:scale-95'
            )}
            aria-label={`Notificaciones${notificationCount > 0 ? ` (${notificationCount} sin leer)` : ''}`}
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            {notificationCount > 0 && (
              <span
                className={cn(
                  'absolute top-1 right-1',
                  'min-w-[16px] h-[16px]',
                  'flex items-center justify-center',
                  'rounded-full text-white',
                  'text-[9px] font-bold leading-none px-1',
                  'animate-fade-in'
                )}
                style={{ backgroundColor: country.colors.accent }}
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* Refresh button (optional) */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className={cn(
                'p-2 rounded-full',
                'transition-colors duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'active:scale-95',
                'disabled:opacity-50'
              )}
              aria-label="Actualizar"
            >
              <RefreshCw
                size={18}
                className={cn(
                  'text-gray-600 dark:text-gray-400',
                  isRefreshing && 'animate-spin'
                )}
              />
            </button>
          )}

          {/* User avatar */}
          <Link
            href="/profile"
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full overflow-hidden',
              'ring-2 ring-offset-1',
              'transition-all duration-200',
              'hover:ring-offset-2 active:scale-95'
            )}
            style={
              { '--tw-ring-color': country.colors.primary } as React.CSSProperties
            }
            aria-label="Ir al perfil"
          >
            {avatarUrl && !imageError ? (
              <Image
                src={avatarUrl}
                alt={userName || 'Avatar'}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                onError={handleImageError}
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: country.colors.secondary }}
              >
                {getInitials(userName)}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
