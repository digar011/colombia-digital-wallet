'use client';

import { useOfflineStatus } from '@/lib/hooks/useOfflineStatus';

/**
 * Banner that appears when the user is offline.
 * Shows at the top of the screen with a warning message in Spanish.
 *
 * Automatically hides when the connection is restored.
 */
export function OfflineBanner() {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium"
    >
      Sin conexion — Los datos mostrados pueden no estar actualizados
    </div>
  );
}
