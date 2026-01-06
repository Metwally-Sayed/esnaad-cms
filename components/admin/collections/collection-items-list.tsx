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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CollectionItemDialog } from "./collection-item-dialog";


type FieldType = "text" | "textarea" | "number" | "image" | "video" | "media" | "boolean";

interface FieldConfig {
  key: string;
  type: FieldType;
  required?: boolean;
  isFixed?: boolean;
  description?: string;
}

interface CollectionItemsListProps {
  collectionId: string;
  collectionSlug?: string;
  hasProfilePages?: boolean;
  fields?: FieldConfig[] | null;
  items: CollectionItemPreview[];
}

type CollectionItemPreview = {
  id: string;
  order: number;
  content: Record<string, unknown>;
};

export function CollectionItemsList({
  collectionId,
  collectionSlug,
  hasProfilePages,
  fields,
  items,
}: CollectionItemsListProps) {
  const [editingItem, setEditingItem] = useState<CollectionItemPreview | null>(null);
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

  const handleEdit = (item: CollectionItemPreview) => {
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
              items.map((item) => {
                // Extract the actual field content from localized structure
                // Content can be either: { en: {...}, ar: {...} } or flat {...}
                let displayContent = item.content;

                // If content has locale keys (en/ar), use English as default for preview
                if (item.content.en && typeof item.content.en === 'object') {
                  displayContent = item.content.en as Record<string, unknown>;
                } else if (item.content.ar && typeof item.content.ar === 'object') {
                  displayContent = item.content.ar as Record<string, unknown>;
                }

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(displayContent)
                          .filter(([key]) => key !== "_schema")
                          .slice(0, 3)
                          .map(([key, value]) => {
                            // Handle different value types for better display
                            let displayValue = String(value);
                            if (typeof value === 'object' && value !== null) {
                              displayValue = '[Object]';
                            } else if (typeof value === 'string' && value.length > 50) {
                              displayValue = value.substring(0, 50) + '...';
                            }

                            return (
                              <span
                                key={key}
                                className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground"
                              >
                                <span className="font-semibold me-1">{key}:</span>
                                <span className="truncate max-w-[150px]">
                                  {displayValue}
                                </span>
                              </span>
                            );
                          })}
                        {Object.keys(displayContent).length > 3 && (
                          <span className="text-xs text-muted-foreground self-center">
                            +{Object.keys(displayContent).length - 3} more
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CollectionItemDialog
        collectionId={collectionId}
        collectionSlug={collectionSlug}
        hasProfilePages={hasProfilePages}
        fields={fields}
        item={editingItem || undefined}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
      />
    </>
  );
}
