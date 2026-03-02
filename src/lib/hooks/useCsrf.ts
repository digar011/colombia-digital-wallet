'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Client-side hook for CSRF token management.
 *
 * Fetches a CSRF token from the /api/csrf endpoint and provides it for use
 * in state-changing requests. The token is automatically fetched on mount
 * and can be refreshed on demand.
 *
 * Usage:
 *   const { csrfToken, refreshToken } = useCsrf();
 *
 *   const handleSubmit = async () => {
 *     await fetch('/api/documents', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'X-CSRF-Token': csrfToken ?? '',
 *       },
 *       body: JSON.stringify(data),
 *     });
 *   };
 */
export function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/csrf');
      if (!response.ok) {
        throw new Error(`CSRF fetch failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data?.csrfToken) {
        setCsrfToken(data.data.csrfToken);
      } else {
        throw new Error('Invalid CSRF response format');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch CSRF token';
      setError(message);
      setCsrfToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return {
    csrfToken,
    isLoading,
    error,
    refreshToken: fetchToken,
  };
}
