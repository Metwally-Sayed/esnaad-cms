import { notFound } from "next/navigation";

import { getAvailableBlocks } from "@/server/actions/block";
import { getPageWithBlocks } from "@/server/actions/page";
import PageCreateForm from "@/components/admin/pages/page-create-form";

type EditPageProps = {
  params: Promise<{
    pageId: string;
  }>;
};

const EditPage = async ({ params }: EditPageProps) => {
  const { pageId } = await params;

  const [blocksResult, page] = await Promise.all([
    getAvailableBlocks(),
    getPageWithBlocks(pageId),
  ]);

  if (!blocksResult.success) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {blocksResult.error || "Unable to load blocks for this workspace."}
      </div>
    );
  }

  if (!page) {
    notFound();
  }

  const initialPage = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    description: page.description,
    published: page.published,
    blocks: page.blocks.map((block) => ({
      id: block.id,
      order: block.order,
      blockId: block.blockId,
      block: {
        id: block.block.id,
        name: block.block.name,
        type: block.block.type,
        variant: block.block.variant,
        content: block.block.content as Record<string, unknown> | null,
      },
    })),
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Pages
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Edit page</h1>
        <p className="text-muted-foreground">
          Update the metadata and reorder blocks. Changes apply immediately once
          saved.
        </p>
      </div>

      <PageCreateForm blocks={blocksResult.data} initialPage={initialPage} />
    </div>
  );
};

export default EditPage;
