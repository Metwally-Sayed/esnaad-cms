import { CollectionItemDialog } from "@/components/admin/collections/collection-item-dialog";
import { CollectionItemsList } from "@/components/admin/collections/collection-items-list";
import { EditCollectionDialog } from "@/components/admin/collections/edit-collection-dialog";
import { Button } from "@/components/ui/button";
import { getCollectionById } from "@/server/actions/collection";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCollectionById(id);
  console.log("getCollectionById result:", result);

  if (!result.success || !result.data) {
    notFound();
  }

  const collection = result.data;

  // Serialize fields for client component (Next.js requires explicit JSON serialization for client components)
  const serializedFields = collection.fields
    ? JSON.parse(JSON.stringify(collection.fields))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
          <p className="text-muted-foreground">
            Slug:{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {collection.slug}
            </code>
          </p>
        </div>
        <div className="flex gap-2">
          <EditCollectionDialog collection={{
            ...collection,
            fields: serializedFields
          }} />
          <CollectionItemDialog
            collectionId={collection.id}
            collectionSlug={collection.slug}
            hasProfilePages={collection.hasProfilePages}
            fields={serializedFields}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            }
          />
        </div>
      </div>

      <CollectionItemsList
        collectionId={collection.id}
        collectionSlug={collection.slug}
        hasProfilePages={collection.hasProfilePages}
        fields={serializedFields}
        items={collection.items.map(item => ({
            ...item,
            content: item.content as Record<string, unknown>
        }))}
      />
    </div>
  );
}
