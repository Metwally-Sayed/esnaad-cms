import { AboutFactory } from "@/components/frontend/blocks/about";
import { CTAFactory, type CTAContent } from "@/components/frontend/blocks/cta";
import ProjectCards from "@/components/frontend/blocks/features/ProjectCards";
import FeaturesSection from "@/components/frontend/blocks/FeaturesSection";
import { FormFactory } from "@/components/frontend/blocks/forms";
import { HeroFactory } from "@/components/frontend/blocks/hero";
import HeroBlock from "@/components/frontend/blocks/HeroBlock";
import {
  HighlightFactory,
  type HighlightsContent,
} from "@/components/frontend/blocks/highlights";
import { BlockType, type Block, type PageBlock } from "@prisma/client";
import ProjectDetailsBlock from "./ProjectDetailsBlock";

type PageBlockWithBlock = PageBlock & {
  block: Block;
};

const PageBlockRenderer = async ({ block }: { block: PageBlockWithBlock }) => {
  const content = (block.block.content ?? {}) as Record<string, unknown>;
  const variant = block.block.variant || "default";

  switch (block.block.type) {
    case "HERO":
      // Use variant-aware factory if variant is specified
      if (variant && variant !== "default") {
        return <HeroFactory variant={variant} content={content} />;
      }
      // Fallback to legacy HeroBlock for backwards compatibility
      return <HeroBlock content={content} />;
    case "CTA":
      return (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <CTAFactory content={content as CTAContent} className="w-full" />
          </div>
        </section>
      );
    case "HIGHLIGHTS":
      return (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <HighlightFactory content={content as HighlightsContent} />
          </div>
        </section>
      );
    case "FEATURES":
      if (variant === "project-cards" || (!content.features && content.collectionId)) {
        return <ProjectCards content={content} />;
      }
      return <FeaturesSection content={content} />;
    case "ABOUT":
      return <AboutFactory variant={variant} content={content} />;
    case "FORM":
      return <FormFactory variant={variant} content={content} />;
    case BlockType.PROJECT_DETAILS:
      return <ProjectDetailsBlock content={content} />;
    default:
      return (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl rounded-xl border border-dashed border-border/60 bg-white/50 p-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">
              Unsupported block type: {block.block.type}
            </p>
            <p className="text-xs text-muted-foreground">
              Variant: {variant}
            </p>
            <pre className="mt-4 overflow-x-auto text-xs">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </section>
      );
  }
};

export type { PageBlockWithBlock };
export default PageBlockRenderer;
