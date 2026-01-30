/**
 * Structured Data (JSON-LD) for SEO
 *
 * Includes:
 * - Organization schema
 * - WebSite schema with SearchAction
 * - LocalBusiness schema (RealEstateAgent)
 * - BreadcrumbList schema
 */

type StructuredDataProps = {
  locale: string;
  siteUrl: string;
  pathname?: string;
  pageTitle?: string;
};

export function StructuredData({ locale, siteUrl, pathname = '/', pageTitle }: StructuredDataProps) {
  const isArabic = locale === 'ar';
  const currentDate = new Date().toISOString().split('T')[0];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "Esnaad",
    "alternateName": isArabic ? "اسناد للتطوير العقاري" : "Esnaad Real Estate Development",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo-en.webp`,
      "width": 665,
      "height": 190,
    },
    "image": `${siteUrl}/og-image.png`,
    "description": isArabic
      ? "اسناد للتطوير العقاري: خبرة أكثر من 20 عاماً في بناء مجتمعات سكنية فاخرة في دبي"
      : "Esnaad Real Estate Development: Over 20 years of experience building luxury residential communities in Dubai",
    "foundingDate": "2004",
    "areaServed": {
      "@type": "City",
      "name": "Dubai",
      "containedInPlace": {
        "@type": "Country",
        "name": "United Arab Emirates",
      },
    },
    "sameAs": [
      // Add social media URLs when available
      // "https://www.facebook.com/esnaad",
      // "https://www.instagram.com/esnaad",
      // "https://www.linkedin.com/company/esnaad",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "Esnaad",
    "description": isArabic
      ? "اسناد للتطوير العقاري"
      : "Esnaad Real Estate Development",
    "publisher": {
      "@id": `${siteUrl}/#organization`,
    },
    "dateCreated": "2004-01-01",
    "dateModified": currentDate,
    "inLanguage": [
      {
        "@type": "Language",
        "name": "English",
        "alternateName": "en",
      },
      {
        "@type": "Language",
        "name": "Arabic",
        "alternateName": "ar",
      },
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/#business`,
    "name": "Esnaad",
    "alternateName": "اسناد للتطوير العقاري",
    "image": `${siteUrl}/og-image.png`,
    "logo": `${siteUrl}/logo-en.webp`,
    "url": siteUrl,
    "description": isArabic
      ? "شركة تطوير عقاري رائدة في دبي متخصصة في بناء مجتمعات سكنية فاخرة"
      : "Leading real estate development company in Dubai specializing in luxury residential communities",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.2048,
      "longitude": 55.2708,
    },
    "areaServed": {
      "@type": "City",
      "name": "Dubai",
    },
    "priceRange": "$$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
        "opens": "09:00",
        "closes": "18:00",
      },
    ],
  };

  // Build breadcrumb based on pathname
  const buildBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isArabic ? "الرئيسية" : "Home",
        "item": `${siteUrl}/${locale}`,
      },
    ];

    let currentPath = `${siteUrl}/${locale}`;
    segments.forEach((segment, index) => {
      if (segment === locale) return; // Skip locale segment
      currentPath += `/${segment}`;
      const name = pageTitle && index === segments.length - 1
        ? pageTitle
        : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": name,
        "item": currentPath,
      });
    });

    return items;
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": buildBreadcrumbs(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}

export default StructuredData;
