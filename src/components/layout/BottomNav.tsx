'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  FileText,
  LayoutGrid,
  Phone,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCountry } from '@/lib/contexts/CountryContext';

// ─── Tab configuration ──────────────────────────────────────────────────────

interface TabConfig {
  label: string;
  labelEs: string;
  href: string;
  icon: LucideIcon;
  /** Match any path that starts with this prefix for active state. */
  matchPrefix: string;
}

const tabs: TabConfig[] = [
  {
    label: 'Home',
    labelEs: 'Inicio',
    href: '/dashboard',
    icon: Home,
    matchPrefix: '/dashboard',
  },
  {
    label: 'Documents',
    labelEs: 'Documentos',
    href: '/documents',
    icon: FileText,
    matchPrefix: '/documents',
  },
  {
    label: 'Services',
    labelEs: 'Servicios',
    href: '/services',
    icon: LayoutGrid,
    matchPrefix: '/services',
  },
  {
    label: 'Emergency',
    labelEs: 'Emergencia',
    href: '/emergency',
    icon: Phone,
    matchPrefix: '/emergency',
  },
  {
    label: 'Profile',
    labelEs: 'Perfil',
    href: '/profile',
    icon: User,
    matchPrefix: '/profile',
  },
];

// ─── Badge component ────────────────────────────────────────────────────────

interface BadgeCountProps {
  count?: number;
}

function BadgeCount({ count }: BadgeCountProps) {
  if (!count || count <= 0) return null;

  const display = count > 99 ? '99+' : String(count);

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 min-w-[18px] h-[18px]',
        'flex items-center justify-center',
        'rounded-full bg-colombia-red text-white',
        'text-[10px] font-bold leading-none px-1',
        'animate-fade-in'
      )}
    >
      {display}
    </span>
  );
}

// ─── Bottom Nav ─────────────────────────────────────────────────────────────

export interface BottomNavProps {
  /** Optional badge counts keyed by tab href (e.g. { '/documents': 3 }). */
  badges?: Record<string, number>;
  className?: string;
}

export function BottomNav({ badges = {}, className }: BottomNavProps) {
  const pathname = usePathname();
  const { country } = useCountry();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white/95 dark:bg-gray-900/95',
        'backdrop-blur-lg',
        'border-t border-gray-200 dark:border-gray-800',
        'bottom-nav-safe',
        className
      )}
      role="navigation"
      aria-label="Navegacion principal"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.matchPrefix + '/');
          const Icon = tab.icon;
          const badgeCount = badges[tab.href];

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'min-w-[56px] py-1 px-2 rounded-lg',
                'transition-all duration-200 ease-out',
                'active:scale-95',
                isActive
                  ? 'text-colombia-blue dark:text-colombia-yellow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full animate-fade-in"
                  style={{ backgroundColor: country.colors.primary }}
                />
              )}

              {/* Icon with badge */}
              <span className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all duration-200"
                />
                <BadgeCount count={badgeCount} />
              </span>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] mt-0.5 leading-tight',
                  'transition-all duration-200',
                  isActive ? 'font-semibold' : 'font-medium'
                )}
              >
                {tab.labelEs}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
