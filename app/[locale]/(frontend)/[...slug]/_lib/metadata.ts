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
  globals: GlobalDefaults
): Promise<Metadata> {
  const authorName = safeString(page.author || globals.defaultAuthor);

  // Extract and validate SEO fields
  const title = safeString(page.seoTitle) || page.title;
  const description = safeString(page.seoDescription || page.description);
  const canonical = safeString(page.canonicalUrl);

  // Open Graph
  const ogTitle = safeString(page.ogTitle || page.seoTitle) || page.title;
  const ogDesc = safeString(page.ogDescription || page.seoDescription || page.description);
  const ogUrl = safeString(page.ogUrl);
  const ogSiteName = safeString(page.ogSiteName || globals.defaultOgSiteName);
  const ogLocale = page.ogLocale || globals.defaultOgLocale || "en_US";

  const ogImage = safeString(page.ogImage || globals.defaultOgImage);
  const ogImages = ogImage ? [{ url: ogImage }] : undefined;

  // Type safe OG Type
  const rawOgType = page.ogType;
  const ogType = rawOgType === "article" ? "article" : "website";

  // Twitter
  const twTitle = safeString(page.twitterTitle || ogTitle);
  const twDesc = safeString(page.twitterDescription || ogDesc);
  const twImage = safeString(page.twitterImage) || ogImage;
  const twImages = twImage ? [twImage] : undefined;
  const twSite = safeString(page.twitterSite || globals.defaultTwitterSite);
  const twCreator = safeString(page.twitterCreator || globals.defaultTwitterCreator);

  // Type safe Twitter Card
  const rawTwCard = page.twitterCard;
  const validCards = ["summary", "summary_large_image", "app", "player"] as const;
  type ValidCard = typeof validCards[number];
  const twitterCard = (rawTwCard && validCards.includes(rawTwCard as ValidCard))
    ? (rawTwCard as ValidCard)
    : "summary_large_image";

  return {
    title,
    description,
    keywords: safeArray(page.seoKeywords),
    authors: authorName ? [{ name: authorName }] : undefined,
    category: safeString(page.category),

    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: ogUrl,
      siteName: ogSiteName,
      locale: ogLocale,
      type: ogType,
      images: ogImages,
      ...(ogType === "article" && {
        article: {
          publishedTime: page.ogArticlePublishedTime?.toISOString(),
          modifiedTime: page.ogArticleModifiedTime?.toISOString(),
          authors: page.ogArticleAuthor ? [page.ogArticleAuthor] : undefined,
          section: safeString(page.ogArticleSection),
          tags: safeArray(page.ogArticleTags),
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
      ...(page.metaRobots && { googleBot: page.metaRobots }),
    },

    alternates: {
      canonical,
      languages: buildAlternateLanguages(page.alternateLanguages),
    },
  };
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = getSlug(resolvedParams);

  // Use cached fetching - React cache() deduplicates with the page render
  const page = await getPageBySlugCached(slug);

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const { defaults } = await getGlobalSeoDefaults();
  return buildMetadata(page, defaults);
}
