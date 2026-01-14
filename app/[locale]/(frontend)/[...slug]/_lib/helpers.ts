import { normalizeSlug } from "@/components/frontend/blocks/utils";
import { notFound } from "next/navigation";
import { getPageBySlugCached } from "@/lib/data/page";
import { BlockType } from "@prisma/client";
import type { PageBlockWithBlock } from "@/components/frontend/blocks/PageBlockRenderer";
import type { PageParams, PageData, AlternateLanguage } from "./types";

/**
 * Extract locale from resolved params
 */
export function getLocale(params: PageParams): string {
  return params.locale;
}

/**
 * Extract and normalize slug from resolved params
 */
export function getSlug(params: PageParams): string {
  return normalizeSlug(params.slug || []);
}

/**
 * Fetch page data safely, handling 404s
 * Uses cached fetching to avoid duplicate database queries
 */
export async function fetchPage(slug: string): Promise<PageData> {
  const page = await getPageBySlugCached(slug);
  if (!page) {
    notFound();
  }
  return page;
}

/**
 * Sanitize string values for metadata
 * Returns undefined for empty strings or nulls to avoid empty meta tags
 */
export function safeString(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Sanitize array values for metadata
 */
export function safeArray<T>(arr: T[] | null | undefined): T[] | undefined {
  return arr && arr.length > 0 ? arr : undefined;
}

/**
 * Type guard for alternate languages structure
 */
export function isAlternateLanguagesArray(value: unknown): value is AlternateLanguage[] {
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
export function buildAlternateLanguages(
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
export function shouldInjectAutoBlock(page: PageData): boolean {
  return Boolean(page.collectionItem && page.blocks.length === 0);
}

/**
 * Create a synthetic block for collection item details
 */
export function buildAutoDetailsBlock(page: PageData): PageBlockWithBlock {
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
export function getRenderableBlocks(blocks: PageData["blocks"]): PageBlockWithBlock[] {
  if (!blocks) return [];
  return [...blocks]
    .sort((a, b) => a.order - b.order)
    .filter((b): b is PageBlockWithBlock => Boolean(b.block));
}

/**
 * Parse JSON-LD data safely
 */
export function parseJsonLd(structuredData: unknown): unknown | null {
  if (!structuredData) return null;

  if (typeof structuredData === "object") return structuredData;
  if (typeof structuredData !== "string") return null;

  try {
    return JSON.parse(structuredData);
  } catch (error) {
    console.error("Failed to parse structured data:", error);
    return null;
  }
}
