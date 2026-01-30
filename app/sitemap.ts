import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { getSiteUrl, siteConfig } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const locales = siteConfig.locales;

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

  // Generate entries for each page in each locale
  const pageEntries: MetadataRoute.Sitemap = pages.flatMap((page) => {
    const slug = page.slug === '/' ? '' : page.slug;

    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}${slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: page.slug === '/' ? 1.0 : 0.8,
      alternates: {
        languages: locales.reduce((acc, loc) => {
          acc[loc] = `${baseUrl}/${loc}${slug}`;
          return acc;
        }, {} as Record<string, string>),
      },
    }));
  });

  // Add locale root pages
  const localeRoots: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
    alternates: {
      languages: locales.reduce((acc, loc) => {
        acc[loc] = `${baseUrl}/${loc}`;
        return acc;
      }, {} as Record<string, string>),
    },
  }));

  return [...localeRoots, ...pageEntries];
}
