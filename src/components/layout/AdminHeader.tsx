'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCountry } from '@/lib/contexts/CountryContext';
import { CountrySwitcher } from './CountrySwitcher';

// ─── Breadcrumb generation ──────────────────────────────────────────────────

interface BreadcrumbItem {
  label: string;
  href: string;
}

const labelMap: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  users: 'Ciudadanos',
  documents: 'Documentos',
  analytics: 'Analitica',
  settings: 'Configuracion',
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [];

  let href = '';
  for (const segment of segments) {
    href += `/${segment}`;
    crumbs.push({
      label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
    });
  }

  return crumbs;
}

// ─── Admin User Menu ────────────────────────────────────────────────────────

interface AdminUserMenuProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

function AdminUserMenu({
  userName = 'Administrador',
  userEmail = 'admin@example.com',
  avatarUrl,
}: AdminUserMenuProps) {
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
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
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <User size={16} />
              Mi Perfil
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings size={16} />
              Configuracion
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

// ─── Admin Header Component ─────────────────────────────────────────────────

export interface AdminHeaderProps {
  /** Admin user display name. */
  userName?: string;
  /** Admin user email. */
  userEmail?: string;
  /** Admin user avatar URL. */
  avatarUrl?: string;
  /** Number of unread admin notifications. */
  notificationCount?: number;
  className?: string;
}

export function AdminHeader({
  userName,
  userEmail,
  avatarUrl,
  notificationCount = 0,
  className,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-30',
        'bg-white/95 dark:bg-gray-900/95',
        'backdrop-blur-lg',
        'border-b border-gray-200 dark:border-gray-800',
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Breadcrumbs */}
        <nav className="flex items-center min-w-0" aria-label="Breadcrumb">
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
                ? 'ring-2 ring-colombia-blue/50 bg-white dark:bg-gray-900 w-72'
                : 'w-56'
            )}
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
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-colombia-red text-white text-[9px] font-bold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Admin user menu */}
          <AdminUserMenu
            userName={userName}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
