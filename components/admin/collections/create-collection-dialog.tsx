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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createCollection } from "@/server/actions/collection";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FieldType = "text" | "textarea" | "number" | "image" | "boolean";

interface FieldConfig {
    key: string;
    type: FieldType;
    required: boolean;
    isFixed: boolean;
    description: string;
}

const MEDIA_FIELDS: FieldConfig[] = [
    { key: "title", type: "text", required: true, isFixed: true, description: "Title of the media item" },
    { key: "image", type: "image", required: true, isFixed: true, description: "Main image" },
    { key: "description", type: "textarea", required: false, isFixed: true, description: "Short description" },
];

export function CreateCollectionDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [hasProfilePages, setHasProfilePages] = useState(false);
  const [profilePageSlugPattern, setProfilePageSlugPattern] = useState("");
  const [fields, setFields] = useState<FieldConfig[]>([]);
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

    if (fields.some(f => !f.key)) {
        toast.error("All fields must have a key (name)");
        return;
    }

    setIsLoading(true);
    try {
      const result = await createCollection({
        name,
        slug,
        hasProfilePages,
        profilePageSlugPattern: hasProfilePages ? profilePageSlugPattern : undefined,
        fields,
      });
      if (result.success) {
        toast.success("Collection created");
        setOpen(false);
        setName("");
        setSlug("");
        setHasProfilePages(false);
        setProfilePageSlugPattern("");
        setFields([]);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to create collection");
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    setFields([...fields, { key: "", type: "text", required: false, isFixed: false, description: "" }]);
  };

  const removeField = (index: number) => {
    if (fields[index].isFixed) return;
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FieldConfig>) => {
     if (fields[index].isFixed && (updates.key || updates.type)) return; // Prevent changing key/type of fixed fields
     setFields(fields.map((f, i) => i === index ? { ...f, ...updates } : f));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" /> {t('new')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('create')}</DialogTitle>
          <DialogDescription>
            {t('dialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                id="name"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    // Auto-slug
                    if (!slug) {
                        const newSlug = e.target.value.toLowerCase().replace(/\s+/g, "-");
                        setSlug(newSlug);
                        // Auto-detect Media Template
                        if (newSlug.includes("media") && fields.length === 0) {
                            setFields([...MEDIA_FIELDS]);
                            toast.info("Media template applied automatically");
                        }
                    }
                    if (!profilePageSlugPattern && hasProfilePages) {
                        const collectionSlug = e.target.value.toLowerCase().replace(/\s+/g, "-");
                        setProfilePageSlugPattern(`/${collectionSlug}/[slug]`);
                    }
                }}
                placeholder="e.g. Media Center"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="slug">{t('slug')}</Label>
                <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                    setSlug(e.target.value);
                    if (e.target.value.includes("media") && fields.length === 0) {
                         setFields([...MEDIA_FIELDS]);
                         toast.info("Media template applied automatically");
                    }
                }}
                placeholder="e.g. media-center"
                />
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/10">
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
                Use [slug] as a placeholder for the item&apos;s slug. Example: /projects/[slug]
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Fields Configuration</Label>
                <Button variant="outline" size="sm" onClick={addField}>
                    <Plus className="mr-2 h-3 w-3" /> Add Field
                </Button>
            </div>
            <div className="space-y-3">
                {fields.length === 0 && (
                    <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
                        No fields defined. Start adding fields or use a collection name like &quot;Media&quot; to load generic presets.
                    </div>
                )}
                {fields.map((field, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-start border p-3 rounded-md bg-card">
                        <div className="col-span-3">
                            <Label className="text-xs text-muted-foreground">Key (Name)</Label>
                            <Input
                                value={field.key}
                                onChange={(e) => updateField(index, { key: e.target.value })}
                                placeholder="e.g. title"
                                disabled={field.isFixed}
                                className="h-8 text-sm mt-1"
                            />
                        </div>
                        <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Select
                                value={field.type}
                                onValueChange={(val) => updateField(index, { type: val as FieldType })}
                                disabled={field.isFixed}
                            >
                                <SelectTrigger className="h-8 text-sm mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="textarea">Long Text</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="boolean">Switch</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Required</Label>
                            <div className="mt-3 flex items-center">
                                <Checkbox
                                    checked={field.required}
                                    onCheckedChange={(checked) => updateField(index, { required: Boolean(checked) })}
                                />
                            </div>
                        </div>
                        <div className="col-span-3">
                            <Label className="text-xs text-muted-foreground">Description</Label>
                            <Input
                                value={field.description || ""}
                                onChange={(e) => updateField(index, { description: e.target.value })}
                                placeholder="Helper text"
                                className="h-8 text-sm mt-1"
                            />
                        </div>
                        <div className="col-span-2 flex items-end justify-end h-full pt-6">
                            {field.isFixed ? (
                                <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground font-medium select-none">Fixed</span>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeField(index)}
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          </div>
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
