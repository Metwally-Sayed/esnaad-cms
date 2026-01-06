import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Fetch all published pages
  const pages = await prisma.page.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Map pages to sitemap entries
  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: page.slug === '/' ? 1.0 : 0.8,
  }));

  // Add static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  return [...staticRoutes, ...pageEntries];
}
