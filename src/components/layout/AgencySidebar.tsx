'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Users,
  Inbox,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Building2,
  IdCard,
  Car,
  Receipt,
  HeartPulse,
  HandHeart,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCountry } from '@/lib/contexts/CountryContext';

// ─── Agency icon map ────────────────────────────────────────────────────────

const agencyIcons: Record<string, LucideIcon> = {
  identity: IdCard,
  vehicles: Car,
  tax: Receipt,
  health: HeartPulse,
  socialServices: HandHeart,
  technology: Wifi,
};

// ─── Navigation items ───────────────────────────────────────────────────────

interface NavItem {
  label: string;
  segment: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: 'Panel de Control',
    segment: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Documentos',
    segment: 'documents',
    icon: FileText,
  },
  {
    label: 'Ciudadanos',
    segment: 'citizens',
    icon: Users,
  },
  {
    label: 'Solicitudes',
    segment: 'requests',
    icon: Inbox,
  },
  {
    label: 'Analitica',
    segment: 'analytics',
    icon: BarChart3,
  },
  {
    label: 'Configuracion',
    segment: 'settings',
    icon: Settings,
  },
];

// ─── Agency key list ────────────────────────────────────────────────────────

const AGENCY_KEYS = [
  'identity',
  'vehicles',
  'tax',
  'health',
  'socialServices',
  'technology',
] as const;

type AgencyKey = (typeof AGENCY_KEYS)[number];

// ─── Helper: extract agencyKey from pathname ────────────────────────────────

function extractAgencyKey(pathname: string): AgencyKey {
  // Expect pattern: /agency/[agencyKey]/...
  const segments = pathname.split('/').filter(Boolean);
  const agencyIndex = segments.indexOf('agency');
  if (agencyIndex >= 0 && agencyIndex + 1 < segments.length) {
    const key = segments[agencyIndex + 1];
    if (AGENCY_KEYS.includes(key as AgencyKey)) {
      return key as AgencyKey;
    }
  }
  return 'identity'; // default fallback
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AgencySidebarProps {
  className?: string;
}

// ─── Agency Sidebar Component ───────────────────────────────────────────────

export function AgencySidebar({ className }: AgencySidebarProps) {
  const pathname = usePathname();
  const { country } = useCountry();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const agencyKey = extractAgencyKey(pathname);
  const agencies = country.agencies;
  const currentAgency = agencies[agencyKey];

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
    setIsSelectorOpen(false);
  }, []);

  // Close agency selector on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsSelectorOpen(false);
      }
    }

    if (isSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSelectorOpen]);

  // Close selector on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSelectorOpen(false);
      }
    }
    if (isSelectorOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isSelectorOpen]);

  const AgencyIcon = agencyIcons[agencyKey] || Building2;

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen',
        'bg-white dark:bg-gray-900',
        'border-r border-gray-200 dark:border-gray-800',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      {/* Agency logo / name area */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 h-16 mt-1',
          'border-b border-gray-100 dark:border-gray-800',
          isCollapsed && 'justify-center px-0'
        )}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${country.colors.secondary}15` }}
        >
          <AgencyIcon
            size={22}
            style={{ color: country.colors.secondary }}
          />
        </div>
        {!isCollapsed && currentAgency && (
          <div className="min-w-0 animate-fade-in">
            <h2
              className="text-sm font-bold truncate"
              style={{ color: country.colors.secondary }}
            >
              {currentAgency.shortName}
            </h2>
            <p className="text-[10px] text-gray-400 truncate leading-tight">
              {currentAgency.name}
            </p>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto no-scrollbar">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const href = `/agency/${agencyKey}/${item.segment}`;
            const matchPrefix = `/agency/${agencyKey}/${item.segment}`;
            const isActive =
              pathname === href ||
              pathname.startsWith(matchPrefix + '/');
            const Icon = item.icon;

            return (
              <li key={item.segment}>
                <Link
                  href={href}
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

      {/* Agency selector dropdown */}
      <div
        ref={selectorRef}
        className={cn(
          'relative px-3 py-3',
          'border-t border-gray-100 dark:border-gray-800'
        )}
      >
        {!isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2',
              'bg-colombia-blue/5 dark:bg-colombia-yellow/5',
              'rounded-lg',
              'hover:bg-colombia-blue/10 dark:hover:bg-colombia-yellow/10',
              'transition-colors duration-200'
            )}
            aria-expanded={isSelectorOpen}
            aria-haspopup="listbox"
            aria-label="Cambiar agencia"
          >
            <Building2
              size={16}
              className="text-colombia-blue dark:text-colombia-yellow flex-shrink-0"
            />
            <div className="min-w-0 flex-1 text-left animate-fade-in">
              <p className="text-xs font-medium text-colombia-blue dark:text-colombia-yellow truncate">
                {currentAgency?.shortName || 'Agencia'}
              </p>
              <p className="text-[10px] text-gray-400">Cambiar Agencia</p>
            </div>
            <ChevronDown
              size={14}
              className={cn(
                'text-gray-400 transition-transform duration-200 flex-shrink-0',
                isSelectorOpen && 'rotate-180'
              )}
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex justify-center w-full"
            aria-label="Cambiar agencia"
          >
            <Building2
              size={18}
              className="text-colombia-blue dark:text-colombia-yellow"
            />
          </button>
        )}

        {/* Agency dropdown list */}
        {isSelectorOpen && (
          <div
            className={cn(
              'absolute bottom-full mb-2 z-50',
              isCollapsed ? 'left-full ml-2' : 'left-3 right-3',
              'py-1',
              'bg-white dark:bg-gray-900',
              'rounded-xl shadow-xl',
              'border border-gray-200 dark:border-gray-700',
              'animate-fade-in',
              isCollapsed && 'w-56'
            )}
            role="listbox"
            aria-label="Agencias disponibles"
          >
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Seleccionar Agencia
              </p>
            </div>

            {AGENCY_KEYS.map((key) => {
              const agency = agencies[key];
              if (!agency) return null;

              const isSelected = key === agencyKey;
              const AgIcon = agencyIcons[key] || Building2;

              return (
                <Link
                  key={key}
                  href={`/agency/${key}/dashboard`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setIsSelectorOpen(false)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5',
                    'transition-colors duration-150',
                    'text-left',
                    isSelected
                      ? 'bg-colombia-blue/5 dark:bg-colombia-yellow/5'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  <AgIcon
                    size={18}
                    className={cn(
                      'flex-shrink-0',
                      isSelected
                        ? 'text-colombia-blue dark:text-colombia-yellow'
                        : 'text-gray-400'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        isSelected
                          ? 'text-colombia-blue dark:text-colombia-yellow'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      {agency.shortName}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {agency.name}
                    </p>
                  </div>
                  {isSelected && (
                    <Check
                      size={14}
                      className="text-colombia-blue dark:text-colombia-yellow flex-shrink-0"
                    />
                  )}
                </Link>
              );
            })}
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
          aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
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

export default AgencySidebar;
