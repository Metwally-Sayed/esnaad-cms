import PageCreateForm from "@/components/admin/pages/page-create-form";
import { getAvailableBlocks } from "@/server/actions/block";

const CreatePage = async () => {
  const blocksResult = await getAvailableBlocks();

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Pages
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Create page</h1>
        <p className="text-muted-foreground">
          Define a slug, write the essentials, and assemble a landing page
          using reusable blocks.
        </p>
      </div>

      {!blocksResult.success ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {blocksResult.error || "Unable to load blocks for this workspace."}
        </div>
      ) : (
        <PageCreateForm blocks={blocksResult.data} />
      )}
    </div>
  );
};

export default CreatePage;
