/**
 * Robots.txt Configuration
 * Controls search engine crawler access
 */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/ingredients/',
        '/recipes/',
        '/production/',
        '/reports/',
        '/settings/',
        '/onboarding/',
        '/api/',
      ],
    },
    sitemap: '/sitemap.xml',
  };
}
