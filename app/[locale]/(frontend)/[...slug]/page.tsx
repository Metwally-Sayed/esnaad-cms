import PageBlockRenderer, {
    type PageBlockWithBlock,
} from "@/components/frontend/blocks/PageBlockRenderer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getPageBySlug } from "@/server/actions/page";
import { notFound } from "next/navigation";
import { BlockType } from "@prisma/client";

type Props = {
  params: Promise<{
    slug?: string[];
    locale: string;
  }>;
  searchParams: Promise<{
    type?: string;
  }>;
};

const PageBySlug = async ({ params, searchParams }: Props) => {
  const resolvedParams = params ? await params : undefined;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const slugArray = resolvedParams?.slug ?? [];

  // Join the slug array to create the full path
  // For catch-all routes: [projects, project-01] => /projects/project-01
  const normalizedSlug = slugArray.length > 0
    ? `/${slugArray.join("/")}`.toLowerCase()
    : "/";

  const page = await getPageBySlug({
    slug: normalizedSlug,
  });

  if (!page) {
    notFound();
  }

  // If page is linked to a collection item, automatically inject details block
  if (page.collectionItem && page.blocks.length === 0) {
    // Determine block type based on collection slug
    const collectionSlug = page.collectionItem.collection.slug;
    const blockType = collectionSlug === "media" ? BlockType.MEDIA_DETAILS : BlockType.PROJECT_DETAILS;
    const blockName = collectionSlug === "media"
      ? "Auto-generated Media Details"
      : "Auto-generated Project Details";

    const detailsBlock: PageBlockWithBlock = {
      id: `auto-${page.id}`,
      pageId: page.id,
      blockId: `auto-block-${page.id}`,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      block: {
        id: `auto-block-${page.id}`,
        name: blockName,
        type: blockType,
        variant: "default",
        content: page.collectionItem.content,
        isGlobal: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    return (
      <main className="bg-background">
        <PageBlockRenderer
          block={detailsBlock}
          locale={resolvedParams?.locale || 'en'}
          searchParams={resolvedSearchParams}
        />
      </main>
    );
  }

  // Regular page rendering with blocks
  const orderedBlocks = page.blocks
    ? ([...page.blocks].sort(
        (a, b) => a.order - b.order
      ) as PageBlockWithBlock[])
    : [];

  const renderableBlocks = orderedBlocks.filter(
    (block): block is PageBlockWithBlock => Boolean(block.block)
  );

  return (
    <main className="bg-background">
      {renderableBlocks.length ? (
        renderableBlocks.map((block) => (
          <ScrollReveal key={block.id} width="100%" className="w-full">
            <PageBlockRenderer
              block={block}
              locale={resolvedParams?.locale || 'en'}
              searchParams={resolvedSearchParams}
            />
          </ScrollReveal>
        ))
      ) : (
        <div className="mx-auto max-w-4xl px-4 py-24 text-center text-muted-foreground">
          This page does not have any blocks yet.
        </div>
      )}
    </main>
  );
};

export default PageBySlug;
