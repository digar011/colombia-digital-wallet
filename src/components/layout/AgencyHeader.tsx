'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ChevronRight,
  LogOut,
  User,
  Building2,
  Bell,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCountry } from '@/lib/contexts/CountryContext';
import { CountrySwitcher } from './CountrySwitcher';

// ─── Agency keys for breadcrumb resolution ──────────────────────────────────

const AGENCY_KEYS = [
  'identity',
  'vehicles',
  'tax',
  'health',
  'socialServices',
  'technology',
] as const;

type AgencyKey = (typeof AGENCY_KEYS)[number];

// ─── Breadcrumb label map ───────────────────────────────────────────────────

const labelMap: Record<string, string> = {
  agency: 'Agencia',
  dashboard: 'Panel de Control',
  documents: 'Documentos',
  citizens: 'Ciudadanos',
  requests: 'Solicitudes',
  analytics: 'Analitica',
  settings: 'Configuracion',
};

// ─── Breadcrumb generation ──────────────────────────────────────────────────

interface BreadcrumbItem {
  label: string;
  href: string;
}

function generateAgencyBreadcrumbs(
  pathname: string,
  agencies: Record<string, { name: string; shortName: string; website: string }>
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [];

  let href = '';
  for (const segment of segments) {
    href += `/${segment}`;

    // Check if this segment is an agency key - show shortName instead
    if (AGENCY_KEYS.includes(segment as AgencyKey) && agencies[segment]) {
      crumbs.push({
        label: agencies[segment].shortName,
        href,
      });
    } else {
      crumbs.push({
        label:
          labelMap[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1),
        href,
      });
    }
  }

  return crumbs;
}

// ─── Agency User Menu ───────────────────────────────────────────────────────

interface AgencyUserMenuProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  agencyKey?: string;
}

function AgencyUserMenu({
  userName = 'Funcionario',
  userEmail = 'funcionario@agency.gov.co',
  avatarUrl,
  agencyKey = 'identity',
}: AgencyUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { country } = useCountry();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg',
          'transition-colors duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={userName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: country.colors.secondary }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
            {userName}
          </p>
        </div>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 z-50',
            'w-64 py-2',
            'bg-white dark:bg-gray-900',
            'rounded-xl shadow-xl',
            'border border-gray-200 dark:border-gray-700',
            'animate-fade-in'
          )}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {userName}
            </p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href={`/agency/${agencyKey}/settings`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <User size={16} />
              Mi Perfil
            </Link>
            <Link
              href={`/agency/${agencyKey}/dashboard`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Building2 size={16} />
              Cambiar Agencia
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-colombia-red hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut size={16} />
              Cerrar Sesion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Menu Button ─────────────────────────────────────────────────────

interface MobileMenuButtonProps {
  onToggle?: () => void;
}

function MobileMenuButton({ onToggle }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'md:hidden p-2 rounded-lg',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'transition-colors duration-200'
      )}
      aria-label="Abrir menu de navegacion"
    >
      <Menu size={20} className="text-gray-600 dark:text-gray-400" />
    </button>
  );
}

// ─── Agency Header Component ────────────────────────────────────────────────

export interface AgencyHeaderProps {
  /** Agency user display name. */
  userName?: string;
  /** Agency user email. */
  userEmail?: string;
  /** Agency user avatar URL. */
  avatarUrl?: string;
  /** Number of unread notifications. */
  notificationCount?: number;
  /** Callback to toggle mobile sidebar. */
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function AgencyHeader({
  userName,
  userEmail,
  avatarUrl,
  notificationCount = 0,
  onMobileMenuToggle,
  className,
}: AgencyHeaderProps) {
  const pathname = usePathname();
  const { country } = useCountry();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const breadcrumbs = generateAgencyBreadcrumbs(pathname, country.agencies);

  // Extract current agency key from path for user menu
  const segments = pathname.split('/').filter(Boolean);
  const agencyIndex = segments.indexOf('agency');
  const agencyKey =
    agencyIndex >= 0 && agencyIndex + 1 < segments.length
      ? segments[agencyIndex + 1]
      : 'identity';

  return (
    <header
      className={cn(
        'sticky top-1 z-30',
        'bg-white/95 dark:bg-gray-900/95',
        'backdrop-blur-lg',
        'border-b border-gray-200 dark:border-gray-800',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Mobile menu + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <MobileMenuButton onToggle={onMobileMenuToggle} />

          <nav className="hidden sm:flex items-center min-w-0" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <Fragment key={crumb.href}>
                    {index > 0 && (
                      <ChevronRight
                        size={14}
                        className="text-gray-400 flex-shrink-0 mx-1"
                      />
                    )}
                    <li>
                      {isLast ? (
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  </Fragment>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Right: Search + Country Switcher + Notifications + User */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={cn(
              'hidden md:flex items-center gap-2',
              'px-3 py-2 rounded-lg',
              'bg-gray-100 dark:bg-gray-800',
              'transition-all duration-200',
              isSearchFocused
                ? 'ring-2 bg-white dark:bg-gray-900 w-72'
                : 'w-56'
            )}
            style={
              isSearchFocused
                ? { '--tw-ring-color': `${country.colors.secondary}50` } as React.CSSProperties
                : undefined
            }
          >
            <Search
              size={16}
              className="text-gray-400 flex-shrink-0"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                'bg-transparent text-sm text-gray-700 dark:text-gray-300',
                'placeholder:text-gray-400',
                'outline-none w-full'
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="text-xs">ESC</span>
              </button>
            )}
          </div>

          {/* Country switcher (for demo mode) */}
          <CountrySwitcher variant="compact" />

          {/* Notifications */}
          <button
            type="button"
            className={cn(
              'relative p-2 rounded-lg',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors duration-200'
            )}
            aria-label="Notificaciones"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            {notificationCount > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full text-white text-[9px] font-bold"
                style={{ backgroundColor: country.colors.accent }}
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Agency user menu */}
          <AgencyUserMenu
            userName={userName}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
            agencyKey={agencyKey}
          />
        </div>
      </div>
    </header>
  );
}

export default AgencyHeader;
