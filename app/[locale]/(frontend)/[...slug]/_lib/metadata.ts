import type { Metadata } from "next";
import { getGlobalSeoDefaults } from "@/server/actions/global-settings";
import { getPageBySlugCached } from "@/lib/data/page";
import {
  safeString,
  safeArray,
  buildAlternateLanguages,
  getSlug,
} from "./helpers";
import type { Props, PageData, GlobalDefaults } from "./types";

/**
 * Build comprehensive metadata from page and global defaults
 */
async function buildMetadata(
  page: PageData,
  globals: GlobalDefaults,
  isArabic: boolean = false
): Promise<Metadata> {
  const authorName = safeString(page.author || globals.defaultAuthor);

  // For Arabic locale, use Arabic fields if available, otherwise fall back to English
  const title = isArabic
    ? (safeString(page.seoTitleAr) || safeString(page.titleAr) || safeString(page.seoTitle) || page.title)
    : (safeString(page.seoTitle) || page.title);
  const description = isArabic
    ? (safeString(page.seoDescriptionAr) || safeString(page.seoDescription || page.description))
    : safeString(page.seoDescription || page.description);
  const canonical = safeString(page.canonicalUrl);

  // Keywords - use Arabic if available
  const keywords = isArabic
    ? (safeArray(page.seoKeywordsAr) || safeArray(page.seoKeywords))
    : safeArray(page.seoKeywords);

  // Open Graph with locale awareness
  const ogTitle = isArabic
    ? (safeString(page.ogTitleAr) || safeString(page.seoTitleAr) || safeString(page.ogTitle || page.seoTitle) || page.title)
    : (safeString(page.ogTitle || page.seoTitle) || page.title);
  const ogDesc = isArabic
    ? (safeString(page.ogDescriptionAr) || safeString(page.seoDescriptionAr) || safeString(page.ogDescription || page.seoDescription || page.description))
    : safeString(page.ogDescription || page.seoDescription || page.description);
  const ogUrl = safeString(page.ogUrl);
  const ogSiteName = safeString(page.ogSiteName || globals.defaultOgSiteName) || (isArabic ? 'اسناد' : 'Esnaad');
  const ogLocale = isArabic ? 'ar_AE' : (page.ogLocale || globals.defaultOgLocale || "en_US");
  const ogLocaleAlternate = safeArray(page.ogLocaleAlternate) || [isArabic ? 'en_US' : 'ar_AE'];

  // OG Image - use Arabic version if available
  const defaultOgImage = globals.defaultOgImage;
  const arabicDefaultOgImage = defaultOgImage?.replace('/og-image.png', '/og-image-ar.png');
  const ogImage = isArabic
    ? (safeString(page.ogImageAr) || safeString(page.ogImage) || arabicDefaultOgImage || defaultOgImage)
    : (safeString(page.ogImage) || defaultOgImage);
  const ogImages = ogImage ? [{ url: ogImage }] : undefined;

  // Type safe OG Type
  const rawOgType = page.ogType;
  const ogType = rawOgType === "article" ? "article" : "website";

  // Twitter with locale awareness
  const twTitle = isArabic
    ? (safeString(page.twitterTitleAr) || safeString(page.twitterTitle) || ogTitle)
    : (safeString(page.twitterTitle) || ogTitle);
  const twDesc = isArabic
    ? (safeString(page.twitterDescriptionAr) || safeString(page.twitterDescription) || ogDesc)
    : (safeString(page.twitterDescription) || ogDesc);
  const twImage = safeString(page.twitterImage) || ogImage;
  const twImageAlt = safeString(page.twitterImageAlt);
  const twImages = twImage ? [{ url: twImage, alt: twImageAlt }] : undefined;
  const twSite = safeString(page.twitterSite || globals.defaultTwitterSite);
  const twCreator = safeString(page.twitterCreator || globals.defaultTwitterCreator);

  // Type safe Twitter Card
  const rawTwCard = page.twitterCard;
  const validCards = ["summary", "summary_large_image", "app", "player"] as const;
  type ValidCard = typeof validCards[number];
  const twitterCard = (rawTwCard && validCards.includes(rawTwCard as ValidCard))
    ? (rawTwCard as ValidCard)
    : "summary_large_image";

  // Dates - use page dates as fallback for article times
  const publishedTime = page.ogArticlePublishedTime?.toISOString()
    || page.publishedDate?.toISOString();
  const modifiedTime = page.ogArticleModifiedTime?.toISOString()
    || page.modifiedDate?.toISOString();

  // Tags - merge ogArticleTags and general tags
  const articleTags = safeArray(page.ogArticleTags) || safeArray(page.tags);

  // Build robots directive
  const robotsDirective = safeString(page.robots || globals.defaultRobots);

  return {
    title,
    description,
    keywords,
    authors: authorName ? [{ name: authorName }] : undefined,
    category: safeString(page.category),

    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: ogUrl,
      siteName: ogSiteName,
      locale: ogLocale,
      alternateLocale: ogLocaleAlternate,
      type: ogType,
      images: ogImages,
      ...(ogType === "article" && {
        article: {
          publishedTime,
          modifiedTime,
          authors: page.ogArticleAuthor ? [page.ogArticleAuthor] : undefined,
          section: safeString(page.ogArticleSection),
          tags: articleTags,
        },
      }),
    },

    twitter: {
      card: twitterCard,
      title: twTitle,
      description: twDesc,
      images: twImages,
      site: twSite,
      creator: twCreator,
    },

    robots: {
      index: !page.noindex,
      follow: !page.nofollow,
      ...(robotsDirective && !page.noindex && !page.nofollow && {
        // Parse robots directive string like "index,follow,max-snippet:-1"
        ...parseRobotsDirective(robotsDirective),
      }),
      ...(page.metaRobots && { googleBot: page.metaRobots }),
    },

    alternates: {
      canonical,
      languages: buildAlternateLanguages(page.alternateLanguages),
    },

    // Other metadata
    ...(page.publishedDate && {
      other: {
        'article:published_time': page.publishedDate.toISOString(),
        ...(page.modifiedDate && { 'article:modified_time': page.modifiedDate.toISOString() }),
      }
    }),
  };
}

/**
 * Parse robots directive string into object
 */
function parseRobotsDirective(directive: string): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  const parts = directive.split(',').map(p => p.trim());

  for (const part of parts) {
    if (part.includes(':')) {
      const [key, value] = part.split(':');
      const numValue = parseInt(value, 10);
      result[key.trim()] = isNaN(numValue) ? value.trim() : numValue;
    }
  }

  return result;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = getSlug(resolvedParams);
  const locale = resolvedParams.locale || 'en';
  const isArabic = locale === 'ar';

  // Use cached fetching - React cache() deduplicates with the page render
  const page = await getPageBySlugCached(slug);

  if (!page) {
    return {
      title: isArabic ? "الصفحة غير موجودة" : "Page Not Found",
      description: isArabic
        ? "لم يتم العثور على الصفحة المطلوبة."
        : "The requested page could not be found.",
    };
  }

  const { defaults } = await getGlobalSeoDefaults();
  return buildMetadata(page, defaults, isArabic);
}
