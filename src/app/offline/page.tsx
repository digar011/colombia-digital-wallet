'use client';

/**
 * Offline fallback page displayed when the user has no network connection
 * and the requested page is not cached.
 *
 * UI text is in Spanish as this is a citizen-facing page.
 */
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 text-gray-400 dark:text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sin conexion a internet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          No se pudo conectar al servidor. Sus documentos guardados estan
          disponibles sin conexion.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Volver
          </button>
        </div>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Mi Colombia Digital funciona sin conexion para documentos previamente
          consultados.
        </p>
      </div>
    </div>
  );
}
