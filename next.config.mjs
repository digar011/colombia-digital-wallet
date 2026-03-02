import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // API routes for citizen data — Network First with offline fallback
    {
      urlPattern: /^https?:\/\/.*\/api\/citizens\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-citizen-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    // API routes for admin data — Network First with shorter cache
    {
      urlPattern: /^https?:\/\/.*\/api\/admin\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-admin-cache",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 12 * 60 * 60, // 12 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    // Static image assets — Cache First (long-lived)
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Web fonts — Cache First (very long-lived)
    {
      urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-font-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // JS and CSS bundles — Stale While Revalidate
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-js-css-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    // Next.js page data — Network First
    {
      urlPattern: /\/_next\/data\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-data-cache",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    // HTML pages — Network First with offline fallback
    {
      urlPattern: /^https?:\/\/.*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "page-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
  fallbacks: {
    document: "/offline",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          // Enable DNS prefetching for faster external resource resolution
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Enforce HTTPS for 2 years with subdomains and preload list inclusion
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Prevent the page from being embedded in iframes (clickjacking protection)
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Control how much referrer information is sent with requests
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          // Restrict access to browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          // Content Security Policy — restrict resource loading origins
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default pwaConfig(nextConfig);
