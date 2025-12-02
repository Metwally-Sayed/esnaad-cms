import PageBlockRenderer, {
  type PageBlockWithBlock,
} from "@/components/frontend/blocks/PageBlockRenderer";
import { getPageBySlug } from "@/server/actions/page";
import { notFound } from "next/navigation";

type Props = {
  params?: Promise<{
    slug?: string[];
  }>;
};

const PageBySlug = async ({ params }: Props) => {
  const resolvedParams = params ? await params : undefined;
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

  // If page is linked to a collection item, automatically inject PROJECT_DETAILS block
  if (page.collectionItem && page.blocks.length === 0) {
    const projectDetailsBlock: PageBlockWithBlock = {
      id: `auto-${page.id}`,
      pageId: page.id,
      blockId: `auto-block-${page.id}`,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      block: {
        id: `auto-block-${page.id}`,
        name: "Auto-generated Project Details",
        type: "PROJECT_DETAILS",
        variant: "default",
        content: page.collectionItem.content,
        isGlobal: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    return (
      <main className="bg-background">
        <PageBlockRenderer block={projectDetailsBlock} />
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
          <PageBlockRenderer key={block.id} block={block} />
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
