import type { MetadataRoute } from 'next';

/**
 * Generates sitemap.xml via the Next.js Metadata API.
 *
 * Lists all public pages that should be indexed by search engines.
 * Auth-protected routes (citizen, admin, agency, dashboard) are excluded.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/offline`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
