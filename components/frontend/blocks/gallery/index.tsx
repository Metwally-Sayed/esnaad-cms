import MediaHero, { type MediaHeroContent } from "./MediaHero";
import MediaGrid, { type MediaGridContent } from "./MediaGrid";
import IndustryUpdate, { type IndustryUpdateContent } from "./IndustryUpdate";

export type GalleryContent =
  | MediaHeroContent
  | MediaGridContent
  | IndustryUpdateContent;

export type GalleryVariantProps = {
  content: Record<string, unknown>;
  className?: string;
};

export function GalleryFactory({
  variant,
  content,
  className,
}: {
  variant: string;
  content: Record<string, unknown>;
  className?: string;
}) {
  switch (variant) {
    case "media-hero":
      return (
        <MediaHero
          content={content as MediaHeroContent}
          className={className}
        />
      );
    case "media-grid":
      return (
        <MediaGrid
          content={content as MediaGridContent}
          className={className}
        />
      );
    case "industry-update":
      return (
        <IndustryUpdate
          content={content as IndustryUpdateContent}
          className={className}
        />
      );
    default:
      return (
        <div className="rounded-xl border border-dashed border-border/60 bg-white/50 p-6 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">
            Unknown gallery variant: {variant}
          </p>
          <p className="text-xs">Available variants: media-hero, media-grid, industry-update</p>
        </div>
      );
  }
}

export type { MediaHeroContent, MediaGridContent, IndustryUpdateContent };
