import { BlockType } from "@prisma/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageBlockRenderer, {
  type PageBlockWithBlock,
} from "@/components/frontend/blocks/PageBlockRenderer";
import { normalizeSlug } from "@/components/frontend/blocks/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getGlobalSeoDefaults } from "@/server/actions/global-settings";
import { getPageBySlug } from "@/server/actions/page";

// ============================================================================
// Types & Interfaces
// ============================================================================

type PageParams = {
  slug: string[];
  locale: string;
};

type PageSearchParams = {
  [key: string]: string | string[] | undefined;
};

type Props = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

// Data types derived from server actions
type PageData = NonNullable<Awaited<ReturnType<typeof getPageBySlug>>>;
type GlobalDefaults = Awaited<ReturnType<typeof getGlobalSeoDefaults>>["defaults"];

type AlternateLanguage = {
  lang: string;
  url: string;
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Extract locale from resolved params
 */
function getLocale(params: PageParams): string {
  return params.locale;
}

/**
 * Extract and normalize slug from resolved params
 */
function getSlug(params: PageParams): string {
  // If slug is undefined (shouldn't be in [...slug] but for safety), default to empty array
  return normalizeSlug(params.slug || []);
}

/**
 * Fetch page data safely, handling 404s
 */
async function fetchPage(slug: string): Promise<PageData> {
  const page = await getPageBySlug({ slug });
  if (!page) {
    notFound();
  }
  return page;
}

/**
 * Sanitize string values for metadata
 * Returns undefined for empty strings or nulls to avoid empty meta tags
 */
function safeString(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Sanitize array values for metadata
 */
function safeArray<T>(arr: T[] | null | undefined): T[] | undefined {
  return arr && arr.length > 0 ? arr : undefined;
}

/**
 * Type guard for alternate languages structure
 */
function isAlternateLanguagesArray(value: unknown): value is AlternateLanguage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "lang" in item &&
        "url" in item &&
        typeof (item as AlternateLanguage).lang === "string" &&
        typeof (item as AlternateLanguage).url === "string"
    )
  );
}

/**
 * Build alternates.languages record
 */
function buildAlternateLanguages(
  alternateLanguages: unknown
): Record<string, string> | undefined {
  if (!isAlternateLanguagesArray(alternateLanguages)) {
    return undefined;
  }
  
  return alternateLanguages.reduce((acc, curr) => {
    acc[curr.lang] = curr.url;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Determine if we should inject an auto-generated details block
 */
function shouldInjectAutoBlock(page: PageData): boolean {
  return Boolean(page.collectionItem && page.blocks.length === 0);
}

/**
 * Create a synthetic block for collection item details
 */
function buildAutoDetailsBlock(page: PageData): PageBlockWithBlock {
  if (!page.collectionItem) {
    throw new Error("Cannot build auto block without collectionItem");
  }

  const collectionSlug = page.collectionItem.collection.slug;
  const isMediaCollection = collectionSlug === "media";

  return {
    id: `auto-${page.id}`,
    pageId: page.id,
    blockId: `auto-block-${page.id}`,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    block: {
      id: `auto-block-${page.id}`,
      name: isMediaCollection
        ? "Auto-generated Media Details"
        : "Auto-generated Project Details",
      type: isMediaCollection ? BlockType.MEDIA_DETAILS : BlockType.PROJECT_DETAILS,
      variant: "default",
      content: page.collectionItem.content,
      isGlobal: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

/**
 * Filter and sort blocks for rendering
 */
function getRenderableBlocks(blocks: PageData["blocks"]): PageBlockWithBlock[] {
  if (!blocks) return [];
  // Ensure we sort by order safely
  return [...blocks]
    .sort((a, b) => a.order - b.order)
    .filter((b): b is PageBlockWithBlock => Boolean(b.block));
}

/**
 * Parse JSON-LD data safely
 */
function parseJsonLd(structuredData: unknown): unknown | null {
  if (!structuredData) return null;
  
  // If it's already an object, return it. If it's a string, parse it.
  if (typeof structuredData === "object") return structuredData;
  if (typeof structuredData !== "string") return null;

  try {
    return JSON.parse(structuredData);
  } catch (error) {
    console.error("Failed to parse structured data:", error);
    return null;
  }
}

// ============================================================================
// Components
// ============================================================================

function StructuredData({ data }: { data: unknown }) {
  const jsonLd = parseJsonLd(data);
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BlockWrapper({
  block,
  locale,
  searchParams,
}: {
  block: PageBlockWithBlock;
  locale: string;
  searchParams?: PageSearchParams;
}) {
  const isForm = block.block.type === "FORM";
  const isProjectDetails = block.block.type === "PROJECT_DETAILS";
  const isMediaDetails = block.block.type === "MEDIA_DETAILS";

  const renderer = (
    <PageBlockRenderer
      block={block}
      locale={locale}
      searchParams={searchParams}
    />
  );

  // Forms and Details blocks should not use ScrollReveal.
  // Details blocks contain sticky elements (nav) which break if inside a transformed container (ScrollReveal).
  if (isForm || isProjectDetails || isMediaDetails) {
    return renderer;
  }

  return (
    <ScrollReveal width="100%" className="w-full">
      {renderer}
    </ScrollReveal>
  );
}

// ============================================================================
// Metadata Builder
// ============================================================================

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
  // Only cast if explicitly valid, otherwise fallback
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
      // Article specific props only if type is article
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = getSlug(resolvedParams);
  
  const page = await getPageBySlug({ slug });
  
  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const { defaults } = await getGlobalSeoDefaults();
  return buildMetadata(page, defaults);
}

// ============================================================================
// Main Page Component
// ============================================================================

export default async function PageBySlug({ params, searchParams }: Props) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const slug = getSlug(resolvedParams);
  const locale = getLocale(resolvedParams);

  // 1. Fetch Page Data
  const page = await fetchPage(slug);

  // 2. Handle Auto-injected Collection Details
  if (shouldInjectAutoBlock(page)) {
    const detailsBlock = buildAutoDetailsBlock(page);
    return (
      <>
        <StructuredData data={page.structuredData} />
        <BlockWrapper
          block={detailsBlock}
          locale={locale}
          searchParams={resolvedSearchParams}
        />
      </>
    );
  }

  // 3. Render Blocks
  const blocks = getRenderableBlocks(page.blocks);

  return (
    <>
      <StructuredData data={page.structuredData} />
      {blocks.length > 0 ? (
        blocks.map((block) => (
          <BlockWrapper
            key={block.id}
            block={block}
            locale={locale}
            searchParams={resolvedSearchParams}
          />
        ))
      ) : (
        <div className="mx-auto max-w-4xl px-4 py-24 text-center text-muted-foreground">
          This page does not have any blocks yet.
        </div>
      )}
    </>
  );
}
