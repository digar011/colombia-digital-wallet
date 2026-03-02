'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Building2 } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AgencyErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// ─── Agency Error Boundary ──────────────────────────────────────────────────

export default function AgencyError({ error, reset }: AgencyErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error('[AgencyError]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
      {/* Error icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-colombia-red/10 dark:bg-colombia-red/20 mb-6">
        <AlertTriangle className="w-8 h-8 text-colombia-red" aria-hidden="true" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
        Error en el portal de agencia
      </h2>

      {/* Description */}
      <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-1 max-w-sm">
        Ha ocurrido un error al cargar esta sección del portal.
        El equipo técnico ha sido notificado automáticamente.
      </p>

      {/* Error digest for support */}
      {error.digest && (
        <p className="text-xs text-text-secondary/60 dark:text-text-secondary-dark/60 mb-6 font-mono">
          Código: {error.digest}
        </p>
      )}

      {!error.digest && <div className="mb-6" />}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-lg bg-colombia-blue text-white hover:bg-colombia-blue-light active:bg-colombia-blue-dark shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue focus-visible:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Intentar de nuevo
        </button>

        <Link
          href="/agency"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-lg border-2 border-colombia-blue text-colombia-blue hover:bg-colombia-blue hover:text-white dark:border-colombia-yellow dark:text-colombia-yellow dark:hover:bg-colombia-yellow dark:hover:text-colombia-blue transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colombia-blue focus-visible:ring-offset-2"
        >
          <Building2 className="w-4 h-4" aria-hidden="true" />
          Volver al portal
        </Link>
      </div>
    </div>
  );
}
