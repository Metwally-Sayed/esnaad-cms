import PageBlockRenderer, {
  type PageBlockWithBlock,
} from "@/components/frontend/blocks/PageBlockRenderer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { PageSearchParams } from "../_lib/types";

interface BlockWrapperProps {
  block: PageBlockWithBlock;
  locale: string;
  searchParams?: PageSearchParams;
}

/**
 * Wraps blocks with ScrollReveal animation, except for forms and detail pages
 * Forms and details blocks contain sticky elements that break inside transformed containers
 */
export function BlockWrapper({ block, locale, searchParams }: BlockWrapperProps) {
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

  // Forms and Details blocks should not use ScrollReveal
  if (isForm || isProjectDetails || isMediaDetails) {
    return renderer;
  }

  return (
    <ScrollReveal width="100%" className="w-full">
      {renderer}
    </ScrollReveal>
  );
}
