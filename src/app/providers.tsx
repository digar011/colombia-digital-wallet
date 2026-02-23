'use client';

import { CountryProvider } from '@/lib/contexts/CountryContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { QueryProvider } from '@/lib/providers/QueryProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper.
 *
 * Composes all context providers needed at the root level:
 * - CountryProvider: dynamic country configuration (CO, EC, GT)
 * - AuthProvider: authentication state and redirects
 * - QueryProvider: TanStack React Query for data fetching
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <CountryProvider>
      <AuthProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </AuthProvider>
    </CountryProvider>
  );
}
