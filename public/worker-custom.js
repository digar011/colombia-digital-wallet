// Custom service worker for Mi Colombia Digital
// Provides offline document caching and fallback strategies
//
// This file is loaded by next-pwa and extends the default Workbox service worker.
// It adds custom message handling for caching citizen documents on demand,
// enabling offline access to previously viewed government documents.

// Import Workbox modules (injected by next-pwa at build time)

// Cache names
const CACHE_DOCUMENT = 'document-cache-v1';
const CACHE_API = 'api-cache-v1';
const CACHE_STATIC = 'static-cache-v1';

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_DOCUMENT') {
    // Cache a specific document for offline access
    const { url, data } = event.data;
    caches.open(CACHE_DOCUMENT).then((cache) => {
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
      cache.put(url, response);
    });
  }

  if (event.data?.type === 'CLEAR_DOCUMENT_CACHE') {
    // Clear all cached documents (e.g., on logout)
    caches.delete(CACHE_DOCUMENT);
  }

  if (event.data?.type === 'GET_CACHE_STATUS') {
    // Report cache status back to the main thread
    Promise.all([
      caches.open(CACHE_DOCUMENT).then((cache) => cache.keys()),
      caches.open(CACHE_API).then((cache) => cache.keys()),
      caches.open(CACHE_STATIC).then((cache) => cache.keys()),
    ]).then(([documentKeys, apiKeys, staticKeys]) => {
      event.source?.postMessage({
        type: 'CACHE_STATUS',
        data: {
          documents: documentKeys.length,
          api: apiKeys.length,
          static: staticKeys.length,
        },
      });
    });
  }
});
