import { Skeleton } from '@/components/ui/Skeleton';

// ─── Auth Route Group Loading ────────────────────────────────────────────────
// Displayed while any auth page (login, register, verify) is loading.

export default function AuthLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="min-h-screen flex flex-col bg-white dark:bg-gray-900"
    >
      {/* Top accent bar skeleton */}
      <Skeleton variant="rectangular" className="h-2 w-full rounded-none" />

      {/* Centered form skeleton */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 animate-pulse">
        {/* Logo placeholder */}
        <Skeleton variant="circular" className="w-16 h-16 mb-4" />

        {/* Title */}
        <Skeleton variant="text" className="h-7 w-48 mb-2" />
        <Skeleton variant="text" className="h-4 w-36 mb-8" />

        {/* Form fields */}
        <div className="w-full max-w-sm space-y-4">
          {/* Toggle tabs */}
          <Skeleton variant="rectangular" className="h-10 w-full rounded-lg" />

          {/* Input field 1 */}
          <div className="space-y-1.5">
            <Skeleton variant="text" className="h-4 w-32" />
            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />
          </div>

          {/* Input field 2 */}
          <div className="space-y-1.5">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />
          </div>

          {/* Forgot password link */}
          <div className="flex justify-end">
            <Skeleton variant="text" className="h-4 w-40" />
          </div>

          {/* Submit button */}
          <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <Skeleton variant="text" className="h-px flex-1" />
            <Skeleton variant="text" className="h-4 w-6" />
            <Skeleton variant="text" className="h-px flex-1" />
          </div>

          {/* Biometric button */}
          <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />

          {/* Register link */}
          <Skeleton variant="text" className="h-4 w-48 mx-auto" />
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Cargando formulario de autenticacion...</span>
    </div>
  );
}
