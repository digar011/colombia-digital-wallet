import type { MetadataRoute } from 'next';

/**
 * Generates robots.txt via the Next.js Metadata API.
 *
 * Allows search engines to crawl public-facing pages (landing, auth, verify)
 * while blocking authenticated and internal routes.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register', '/verify/*'],
        disallow: ['/admin/*', '/agency/*', '/api/*', '/dashboard/*', '/citizen/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
