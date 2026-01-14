import { notFound } from "next/navigation";
import { BlockWrapper, StructuredData } from "./_components";
import {
  fetchPage,
  getLocale,
  getSlug,
  shouldInjectAutoBlock,
  buildAutoDetailsBlock,
  getRenderableBlocks,
} from "./_lib/helpers";
import type { Props } from "./_lib/types";

// Enable ISR with 60-second revalidation
export const revalidate = 30;

// Allow dynamic params - pages not known at build time are generated on-demand
export const dynamicParams = true;

// Re-export metadata generator
export { generateMetadata } from "./_lib/metadata";

/**
 * Dynamic page renderer for all CMS pages
 *
 * Features:
 * - ISR caching with 60-second revalidation
 * - Auto-invalidation on page updates
 * - Request deduplication via React cache()
 * - Auto-generated collection detail blocks
 * - Comprehensive SEO metadata
 */
export default async function PageBySlug({ params, searchParams }: Props) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const slug = getSlug(resolvedParams);
  const locale = getLocale(resolvedParams);

  // Fetch page data (cached)
  const page = await fetchPage(slug);

  // Handle auto-injected collection details
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

  // Render blocks
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
