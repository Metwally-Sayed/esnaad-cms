"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActionResponse } from "@/lib/types/action-response";
import type { NavigationLinkInput } from "@/lib/types/navigation";
import { ChevronDown, ChevronRight, Edit, PlusIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { LinkEditorDialog } from "../globals/link-editor-dialog";
import { useTranslations } from "next-intl";

interface NavigationItem {
  id: string;
  name: string;
  linksCount: number;
  isGlobal: boolean;
}

interface NavigationItemDetails {
  id: string;
  name: string;
  links: Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
  }>;
}

interface NavigationTableProps {
  type: "header" | "footer";
  title: string;
  getAll: () => Promise<ActionResponse<NavigationItem[]>>;
  setAsGlobal: (id: string) => Promise<ActionResponse<void>>;
  getCurrentGlobalId: () => Promise<ActionResponse<string | null>>;
  getById: (id: string) => Promise<ActionResponse<NavigationItemDetails | null>>;
  updateLinks: (
    id: string,
    links: NavigationLinkInput[]
  ) => Promise<ActionResponse<void>>;
}

/**
 * Generic table for managing Headers or Footers
 * Eliminates duplication between headers-table and footers-table
 */
export function NavigationTable({
  type,
  title,
  getAll,
  setAsGlobal,
  getCurrentGlobalId,
  getById,
  updateLinks,
}: NavigationTableProps) {
  const t = useTranslations(type === "header" ? "Headers" : "Footers");
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentGlobalId, setCurrentGlobalId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [itemDetails, setItemDetails] = useState<
    Record<string, NavigationItemDetails>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Fetch items and current global item on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch all items
      const itemsResult = await getAll();
      if (itemsResult.success) {
        setItems(itemsResult.data);
      } else {
        toast.error(itemsResult.error || `Failed to load ${type}s`);
      }

      // Fetch current global item ID
      const currentResult = await getCurrentGlobalId();
      if (currentResult.success && currentResult.data) {
        setCurrentGlobalId(currentResult.data);
        setSelectedItemId(currentResult.data);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [getAll, getCurrentGlobalId, type]);

  // Fetch details when row is expanded
  const handleToggleRow = async (itemId: string) => {
    const isCurrentlyExpanded = expandedRows.has(itemId);

    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });

    // Fetch details if expanding and not already fetched
    if (!isCurrentlyExpanded && !itemDetails[itemId]) {
      const result = await getById(itemId);
      if (result.success && result.data) {
        setItemDetails((prev) => ({
          ...prev,
          [itemId]: result.data!,
        }));
      }
    }
  };

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleApply = async () => {
    if (!selectedItemId) {
      toast.error(`Please select a ${type}`);
      return;
    }

    startTransition(async () => {
      const result = await setAsGlobal(selectedItemId);

      if (result.success) {
        toast.success(t(type === "header" ? "headerApplied" : "footerApplied"));
        setCurrentGlobalId(selectedItemId);
        // Update items to reflect new global status
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            isGlobal: item.id === selectedItemId,
          }))
        );
      } else {
        toast.error(result.error || `Failed to apply ${type}`);
      }
    });
  };

  const handleSaveLinks = async (
    itemId: string,
    links: NavigationLinkInput[]
  ) => {
    const result = await updateLinks(itemId, links);

    if (result.success) {
      toast.success("Links updated successfully!");

      // Refresh item details
      const detailsResult = await getById(itemId);
      if (detailsResult.success && detailsResult.data) {
        setItemDetails((prev) => ({
          ...prev,
          [itemId]: detailsResult.data!,
        }));
      }

      // Update links count in main list
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, linksCount: links.length } : item
        )
      );
    } else {
      toast.error(result.error || "Failed to update links");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading {type}s...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No {type}s found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-start items-end w-full mb-2">
        <Button onClick={handleApply} disabled={isPending || !selectedItemId}>
          {isPending ? t("saving") : t("apply")}
          <PlusIcon className="ms-2 h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[50px]">{t("select")}</TableHead>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("linksCount")}</TableHead>
            <TableHead>{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isExpanded = expandedRows.has(item.id);
            const details = itemDetails[item.id];

            return (
              <>
                <TableRow key={item.id}>
                  <TableCell>
                    <button
                      onClick={() => handleToggleRow(item.id)}
                      className="p-1 hover:bg-muted rounded"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedItemId === item.id}
                      onCheckedChange={() => handleCheckboxChange(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.linksCount}</TableCell>
                  <TableCell>
                    {item.isGlobal && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {t("global")}
                      </span>
                    )}
                  </TableCell>
                </TableRow>

                {isExpanded && details && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/50 p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold">
                            {t(type === "header" ? "headerLinks" : "footerLinks")}
                          </h4>
                          <LinkEditorDialog
                            title={t("editLinks")}
                            initialLinks={details.links}
                            onSave={(links) => handleSaveLinks(item.id, links)}
                            trigger={
                              <Button variant="outline" size="sm">
                                <Edit className="me-2 h-4 w-4" />
                                {t("editLinks")}
                              </Button>
                            }
                          />
                        </div>

                        {details.links.length > 0 ? (
                          <div className="space-y-2">
                            {details.links.map((link) => (
                              <div
                                key={link.id}
                                className="flex items-center justify-between rounded-md border border-border bg-background p-2 text-sm"
                              >
                                <span className="font-medium">{link.name}</span>
                                <span className="text-muted-foreground">
                                  {link.slug}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t("noLinks")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
