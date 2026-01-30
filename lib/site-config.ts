/**
 * Site configuration utilities
 * Centralizes site URL and other configuration values
 */

/**
 * Get the site URL from environment or default
 * This should always return the production URL, not localhost
 */
export function getSiteUrl(): string {
  // Priority: NEXT_PUBLIC_SITE_URL > VERCEL_URL > localhost
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // On Vercel, use the deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local development
  return 'http://localhost:3000';
}

/**
 * Get the canonical site URL (always the production domain)
 * Use this for canonical URLs and structured data
 */
export function getCanonicalUrl(): string {
  // Always return the production URL for canonical references
  return process.env.NEXT_PUBLIC_CANONICAL_URL || getSiteUrl();
}

/**
 * Build a full URL from a path
 */
export function buildFullUrl(path: string): string {
  const siteUrl = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

/**
 * Build hreflang alternate URLs for a given path
 */
export function buildHreflangAlternates(slug: string = ''): Record<string, string> {
  const siteUrl = getSiteUrl();
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  const pathSuffix = cleanSlug ? `/${cleanSlug}` : '';

  return {
    'en': `${siteUrl}/en${pathSuffix}`,
    'ar': `${siteUrl}/ar${pathSuffix}`,
    'x-default': `${siteUrl}/en${pathSuffix}`,
  };
}

/**
 * Site configuration object
 */
export const siteConfig = {
  name: 'Esnaad',
  nameAr: 'اسناد',
  description: 'Esnaad Real Estate Development: Over 20 years of experience building luxury residential communities in Dubai.',
  descriptionAr: 'اسناد للتطوير العقاري: خبرة أكثر من 20 عاماً في بناء مجتمعات سكنية فاخرة في دبي.',
  defaultLocale: 'en',
  locales: ['en', 'ar'] as const,
  twitter: '@esnaad',
} as const;
