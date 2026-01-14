/**
 * Generates schema.org structured data from collection items
 * Useful for automatic SEO optimization of collection-based pages
 */

type LocalizedContent = {
  title?: string;
  name?: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
};

type CollectionItemContent = {
  en?: LocalizedContent;
  ar?: LocalizedContent;
};

type CollectionItem = {
  id: string;
  content: CollectionItemContent;
  createdAt: Date | string;
  updatedAt: Date | string;
  collection?: {
    slug?: string;
  };
};

/**
 * Generate structured data for a project/portfolio item
 */
export function generateProjectStructuredData(
  item: CollectionItem,
  locale: string = "en",
  siteUrl: string = "https://esnaad.com"
) {
  const content = item.content[locale as keyof CollectionItemContent] || item.content.en;
  const altLocale = locale === "en" ? "ar" : "en";
  const altContent = item.content[altLocale as keyof CollectionItemContent];

  if (!content) return null;

  const title = content.title || content.name || "Untitled Project";
  const altTitle = altContent?.title || altContent?.name;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": title,
    ...(altTitle && { "alternateName": altTitle }),
    ...(content.description && { "description": content.description }),
    ...(content.image && {
      "image": {
        "@type": "ImageObject",
        "url": content.image,
      }
    }),
    "creator": {
      "@type": "Organization",
      "name": "Esnaad",
      "url": siteUrl
    },
    "dateCreated": new Date(item.createdAt).toISOString(),
    "dateModified": new Date(item.updatedAt).toISOString(),
    "inLanguage": [locale, ...(altContent ? [altLocale] : [])]
  };
}

/**
 * Generate structured data for a media/gallery item
 */
export function generateMediaStructuredData(
  item: CollectionItem,
  locale: string = "en"
) {
  const content = item.content[locale as keyof CollectionItemContent] || item.content.en;

  if (!content || !content.image) return null;

  const title = content.title || content.name || "Media Item";

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": title,
    "contentUrl": content.image,
    ...(content.description && { "description": content.description }),
    "datePublished": new Date(item.createdAt).toISOString(),
    "uploadDate": new Date(item.createdAt).toISOString(),
    "inLanguage": locale,
    "author": {
      "@type": "Organization",
      "name": "Esnaad"
    }
  };
}

/**
 * Generate structured data for a team member
 */
export function generatePersonStructuredData(
  item: CollectionItem,
  locale: string = "en",
  siteUrl: string = "https://esnaad.com"
) {
  const content = item.content[locale as keyof CollectionItemContent] || item.content.en;

  if (!content) return null;

  const name = content.name || content.title || "Team Member";

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    ...(content.description && { "description": content.description }),
    ...(content.image && { "image": content.image }),
    "worksFor": {
      "@type": "Organization",
      "name": "Esnaad",
      "url": siteUrl
    }
  };
}

/**
 * Auto-detect collection type and generate appropriate structured data
 */
export function generateStructuredData(
  item: CollectionItem,
  locale: string = "en"
) {
  const collectionSlug = item.collection?.slug;

  // Auto-detect based on collection slug
  switch (collectionSlug) {
    case "media":
      return generateMediaStructuredData(item, locale);
    case "team":
      return generatePersonStructuredData(item, locale);
    case "projects":
    case "portfolio":
      return generateProjectStructuredData(item, locale);
    default:
      // Default to CreativeWork for unknown collections
      return generateProjectStructuredData(item, locale);
  }
}
