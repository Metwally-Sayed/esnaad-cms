"use client";

import { deleteCollection, getAllCollections } from "@/server/actions/collection";
import { CreateCollectionDialog } from "@/components/admin/collections/create-collection-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Prisma } from "@prisma/client";

type CollectionWithCount = Prisma.CollectionGetPayload<{
  include: { _count: { select: { items: true } } };
}>;

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<{ id: string; name: string } | null>(null);

  const loadCollections = useCallback(async () => {
    setIsLoading(true);
    const result = await getAllCollections();
    if (result.success && result.data) {
      setCollections(result.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCollections();
  }, [loadCollections]);

  const openDeleteDialog = (id: string, name: string) => {
    setCollectionToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;

    const result = await deleteCollection(collectionToDelete.id);
    if (result.success) {
      toast.success("Collection deleted");
      loadCollections();
    } else {
      toast.error(result.error || "Failed to delete collection");
    }
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Manage your dynamic content collections.
            </p>
          </div>
          <CreateCollectionDialog />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading collections...
                  </TableCell>
                </TableRow>
              ) : collections?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No collections found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                collections?.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.name}</TableCell>
                    <TableCell>{collection.slug}</TableCell>
                    <TableCell>{collection._count.items}</TableCell>
                    <TableCell>{new Date(collection.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex jgap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/collections/${collection.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => openDeleteDialog(collection.id, collection.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the collection <strong>&quot;{collectionToDelete?.name}&quot;</strong> and all of its items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
