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
import { updateCollection } from "@/server/actions/collection";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface EditCollectionDialogProps {
  collection: {
    id: string;
    name: string;
    slug: string;
    hasProfilePages: boolean;
    profilePageSlugPattern: string | null;
  };
  trigger?: React.ReactNode;
}

export function EditCollectionDialog({ collection, trigger }: EditCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(collection.name);
  const [slug, setSlug] = useState(collection.slug);
  const [hasProfilePages, setHasProfilePages] = useState(collection.hasProfilePages);
  const [profilePageSlugPattern, setProfilePageSlugPattern] = useState(collection.profilePageSlugPattern || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
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
      const result = await updateCollection(collection.id, {
        name,
        slug,
        hasProfilePages,
        profilePageSlugPattern: hasProfilePages ? profilePageSlugPattern : undefined,
      });
      if (result.success) {
        toast.success("Collection updated");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update collection");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogDescription>
            Update collection settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Projects"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
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
                if (checked && !profilePageSlugPattern) {
                    setProfilePageSlugPattern(`/${slug}/[slug]`);
                }
              }}
            />
            <div className="space-y-1 leading-none flex-1">
              <Label htmlFor="hasProfilePages" className="cursor-pointer font-medium">
                Enable profile pages
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically create a detail page for each item in this collection
              </p>
            </div>
          </div>

          {hasProfilePages && (
            <div className="grid gap-2">
              <Label htmlFor="profilePageSlugPattern">Profile Page URL Pattern</Label>
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
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
