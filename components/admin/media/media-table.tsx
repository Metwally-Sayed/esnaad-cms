"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus } from "lucide-react";
import { deleteMediaItem, type MediaItem } from "@/server/actions/media";
import { toast } from "sonner";

interface MediaTableProps {
  items: MediaItem[];
}

export function MediaTable({ items }: MediaTableProps) {
  const router = useRouter();
  const t = useTranslations("Media");
  const tCommon = useTranslations("Common");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteMediaItem(deleteId);
      if (result.success) {
        toast.success(t("messages.deleted"));
        router.refresh();
      } else {
        toast.error(result.error || t("messages.deleteError"));
      }
    } catch (error) {
      toast.error(t("messages.deleteError"));
    } finally{
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "updates":
        return "default";
      case "insights":
        return "secondary";
      case "news":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/media/create">
            <Plus className="me-2 h-4 w-4" />
            {t("create")}
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">{t("empty.title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("empty.subtitle")}
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/media/create">
              <Plus className="me-2 h-4 w-4" />
              {t("create")}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.image")}</TableHead>
                <TableHead>{t("table.nameEn")}</TableHead>
                <TableHead>{t("table.nameAr")}</TableHead>
                <TableHead>{t("table.type")}</TableHead>
                <TableHead>{t("table.slug")}</TableHead>
                <TableHead className="text-end">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-12 w-16 overflow-hidden rounded border">
                      <img
                        src={item.image}
                        alt={item.nameEn}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.nameEn}</TableCell>
                  <TableCell dir="rtl">{item.nameAr}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(item.type)}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.slug}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link href={`/admin/media/${item.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? tCommon("deleting") : tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
