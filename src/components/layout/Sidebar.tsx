'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Ticket,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCountry } from '@/lib/contexts/CountryContext';

// ─── Navigation items ───────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPrefix: string;
}

const navItems: NavItem[] = [
  {
    label: 'Panel de Control',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    matchPrefix: '/admin/dashboard',
  },
  {
    label: 'Ciudadanos',
    href: '/admin/users',
    icon: Users,
    matchPrefix: '/admin/users',
  },
  {
    label: 'Documentos',
    href: '/admin/documents',
    icon: FileText,
    matchPrefix: '/admin/documents',
  },
  {
    label: 'Tickets',
    href: '/admin/tickets',
    icon: Ticket,
    matchPrefix: '/admin/tickets',
  },
  {
    label: 'Analítica',
    href: '/admin/analytics',
    icon: BarChart3,
    matchPrefix: '/admin/analytics',
  },
  {
    label: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
    matchPrefix: '/admin/settings',
  },
];

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SidebarProps {
  /** The role of the current admin user. */
  role?: string;
  className?: string;
}

// ─── Sidebar Component ──────────────────────────────────────────────────────

export function Sidebar({ role = 'admin', className }: SidebarProps) {
  const pathname = usePathname();
  const { country } = useCountry();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen',
        'bg-white dark:bg-gray-900',
        'border-r border-gray-200 dark:border-gray-800',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      {/* Logo / Brand */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 h-16',
          'border-b border-gray-100 dark:border-gray-800',
          isCollapsed && 'justify-center px-0'
        )}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${country.colors.primary}20` }}
        >
          {country.flag}
        </div>
        {!isCollapsed && (
          <div className="min-w-0 animate-fade-in">
            <h2
              className="text-sm font-bold truncate"
              style={{ color: country.colors.secondary }}
            >
              Panel Administrativo
            </h2>
            <p className="text-[10px] text-gray-400 truncate">
              {country.name} Digital
            </p>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <nav aria-label="Menu de administracion" className="flex-1 py-4 px-3 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.matchPrefix + '/');
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg',
                    'transition-all duration-200',
                    'group relative',
                    isCollapsed
                      ? 'justify-center p-3'
                      : 'px-3 py-2.5',
                    isActive
                      ? 'bg-colombia-blue/10 dark:bg-colombia-yellow/10 text-colombia-blue dark:text-colombia-yellow font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className={cn(
                        'absolute left-0 top-1/2 -translate-y-1/2',
                        'w-1 h-6 rounded-r-full',
                        isCollapsed ? '-left-3' : '-left-3'
                      )}
                      style={{ backgroundColor: country.colors.secondary }}
                    />
                  )}

                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="flex-shrink-0"
                  />

                  {!isCollapsed && (
                    <span className="text-sm truncate animate-fade-in">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <span
                      className={cn(
                        'absolute left-full ml-3 px-2 py-1',
                        'rounded-md bg-gray-900 dark:bg-gray-100',
                        'text-white dark:text-gray-900',
                        'text-xs font-medium whitespace-nowrap',
                        'opacity-0 invisible',
                        'group-hover:opacity-100 group-hover:visible',
                        'transition-all duration-200',
                        'pointer-events-none z-50',
                        'shadow-lg'
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Role indicator */}
      <div
        className={cn(
          'px-3 py-3',
          'border-t border-gray-100 dark:border-gray-800'
        )}
      >
        {!isCollapsed ? (
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2',
              'bg-colombia-blue/5 dark:bg-colombia-yellow/5',
              'rounded-lg'
            )}
          >
            <Shield
              size={16}
              className="text-colombia-blue dark:text-colombia-yellow flex-shrink-0"
            />
            <div className="min-w-0 animate-fade-in">
              <p className="text-xs font-medium text-colombia-blue dark:text-colombia-yellow capitalize truncate">
                {role.replace('_', ' ')}
              </p>
              <p className="text-[10px] text-gray-400">Panel Administrativo</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Shield
              size={18}
              className="text-colombia-blue dark:text-colombia-yellow"
            />
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={toggleCollapse}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'p-2 rounded-lg',
            'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            'transition-all duration-200'
          )}
          aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span className="text-xs font-medium">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
