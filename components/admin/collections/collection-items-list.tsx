"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { deleteCollectionItem } from "@/server/actions/collection";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CollectionItemDialog } from "./collection-item-dialog";
import { useTranslations } from "next-intl";

interface CollectionItemsListProps {
  collectionId: string;
  collectionSlug?: string;
  hasProfilePages?: boolean;
  items: any[];
}

export function CollectionItemsList({
  collectionId,
  collectionSlug,
  hasProfilePages,
  items,
}: CollectionItemsListProps) {
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("Collections.table");

  const handleDelete = async (id: string) => {
    // Note: Confirm dialogs usually need UI component or translated string. 
    // For now keeping native confirm but we could translate the message if we had it.
    if (!confirm("Are you sure you want to delete this item?")) return;

    const result = await deleteCollectionItem(id);
    if (result.success) {
      toast.success("Item deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">{t('order')}</TableHead>
              <TableHead>{t('contentPreview')}</TableHead>
              <TableHead className="text-end">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.order}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.content)
                        .filter(([key]) => key !== "_schema")
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground"
                          >
                            <span className="font-semibold me-1">{key}:</span>
                            <span className="truncate max-w-[150px]">
                              {String(value)}
                            </span>
                          </span>
                        ))}
                      {Object.keys(item.content).length > 4 && (
                        <span className="text-xs text-muted-foreground self-center">
                          ...
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
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

      <CollectionItemDialog
        collectionId={collectionId}
        collectionSlug={collectionSlug}
        hasProfilePages={hasProfilePages}
        item={editingItem}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
      />
    </>
  );
}
