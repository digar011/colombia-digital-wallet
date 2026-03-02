'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to track online/offline status.
 * Returns true when the user is offline.
 *
 * Uses the browser's `navigator.onLine` property and listens
 * for `online`/`offline` events to reactively update state.
 */
export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}
