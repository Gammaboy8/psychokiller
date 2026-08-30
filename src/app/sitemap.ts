export const runtime = 'edge';

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/env';
import { getAllPublishedSlugs } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs();
  const staticPages = ['', '/accounts', '/sold', '/reviews', '/about', '/contact'].map(
    (p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: new Date(),
    })
  );
  const listingPages = slugs.map((s) => ({
    url: `${SITE_URL}/accounts/${s.slug}`,
    lastModified: new Date(s.updated_at),
  }));
  return [...staticPages, ...listingPages];
}
