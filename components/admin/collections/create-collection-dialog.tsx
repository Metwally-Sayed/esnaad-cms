"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCollection } from "@/server/actions/collection";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreateCollectionDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [hasProfilePages, setHasProfilePages] = useState(false);
  const [profilePageSlugPattern, setProfilePageSlugPattern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Collections");

  const handleCreate = async () => {
    if (!name || !slug) {
      toast.error("Name and slug are required");
      return;
    }

    if (hasProfilePages && !profilePageSlugPattern) {
      toast.error("Profile page slug pattern is required when profile pages are enabled");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCollection({
        name,
        slug,
        hasProfilePages,
        profilePageSlugPattern: hasProfilePages ? profilePageSlugPattern : undefined,
      });
      if (result.success) {
        toast.success("Collection created");
        setOpen(false);
        setName("");
        setSlug("");
        setHasProfilePages(false);
        setProfilePageSlugPattern("");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to create collection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> {t('new')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create')}</DialogTitle>
          <DialogDescription>
            {t('dialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Auto-slug
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }
                // Auto-generate profile page pattern
                if (!profilePageSlugPattern && hasProfilePages) {
                  const collectionSlug = e.target.value.toLowerCase().replace(/\s+/g, "-");
                  setProfilePageSlugPattern(`/${collectionSlug}/[slug]`);
                }
              }}
              placeholder="e.g. Projects"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">{t('slug')}</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. projects"
            />
          </div>

          <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox
              id="hasProfilePages"
              checked={hasProfilePages}
              onCheckedChange={(checked) => {
                setHasProfilePages(checked as boolean);
                if (checked && slug) {
                  setProfilePageSlugPattern(`/${slug}/[slug]`);
                } else if (!checked) {
                  setProfilePageSlugPattern("");
                }
              }}
            />
            <div className="space-y-1 leading-none flex-1">
              <Label htmlFor="hasProfilePages" className="cursor-pointer font-medium">
                {t('hasProfilePages')}
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically create a detail page for each item in this collection
              </p>
            </div>
          </div>

          {hasProfilePages && (
            <div className="grid gap-2">
              <Label htmlFor="profilePageSlugPattern">{t('profilePagePattern')}</Label>
              <Input
                id="profilePageSlugPattern"
                value={profilePageSlugPattern}
                onChange={(e) => setProfilePageSlugPattern(e.target.value)}
                placeholder="e.g. /projects/[slug]"
              />
              <p className="text-xs text-muted-foreground">
                Use [slug] as a placeholder for the item's slug. Example: /projects/[slug]
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('dialog.cancel')}
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : t('dialog.create') || "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
