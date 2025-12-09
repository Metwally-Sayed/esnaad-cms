"use client";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { createCollectionItem, updateCollectionItem } from "@/server/actions/collection";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FieldType = "text" | "textarea" | "number" | "image" | "boolean";

interface Field {
  id: string;
  key: string;
  type: FieldType;
  value: string;
  description?: string;
}

interface CollectionItemDialogProps {
  collectionId: string;
  collectionSlug?: string;
  hasProfilePages?: boolean;
  item?: { id: string; content: any }; // If provided, we are editing
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CollectionItemDialog({
  collectionId,
  collectionSlug,
  hasProfilePages,
  item,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: CollectionItemDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Collections.itemDialog");

  useEffect(() => {
    if (open) {
      if (item && item.content) {
        // Reconstruct fields from content
        // We look for _schema if present, otherwise infer
        const content = item.content;
        const schema = content._schema as { key: string; type: FieldType }[] | undefined;

        if (schema) {
          setFields(
            schema.map((s, i) => ({
              id: `field-${i}`,
              key: s.key,
              type: s.type,
              value: content[s.key] !== undefined ? String(content[s.key]) : "",
            }))
          );
        } else {
          // Infer from keys (excluding _schema)
          const inferredFields: Field[] = Object.keys(content)
            .filter((k) => k !== "_schema")
            .map((k, i) => ({
              id: `field-${i}`,
              key: k,
              type: "text", // Default to text if no schema
              value: String(content[k]),
            }));
          setFields(inferredFields);
        }
      } else {
        // New item - check if this is a project collection and use template
        if (collectionSlug === "projects") {
          const baseFields = [
            {
              id: "field-1",
              key: "title",
              type: "text" as FieldType,
              value: "",
              description: "Project title (e.g., 'THE SPARK')",
            },
            {
              id: "field-2",
              key: "image",
              type: "image" as FieldType,
              value: "",
              description: "Thumbnail image URL for cards",
            },
          ];

          // If profile pages are enabled, add slug field and detail fields
          if (hasProfilePages) {
            baseFields.push(
              {
                id: "field-slug",
                key: "slug",
                type: "text" as FieldType,
                value: "",
                description: "URL slug (e.g., 'the-spark'). Required for profile pages.",
              },
              // Hero Section
              {
                id: "field-hero-image",
                key: "heroImage",
                type: "image" as FieldType,
                value: "",
                description: "Hero section full-width background image",
              },
              // Concept Section
              {
                id: "field-concept-desc",
                key: "conceptDescription",
                type: "textarea" as FieldType,
                value: "",
                description: "Concept section description paragraph",
              },
              {
                id: "field-concept-images",
                key: "conceptImages",
                type: "textarea" as FieldType,
                value: "",
                description: "Concept images (6 URLs, comma-separated)",
              },
              {
                id: "field-architecture",
                key: "architecture",
                type: "text" as FieldType,
                value: "",
                description: "Architecture details (e.g., 'B+G+5+R 50 One & Two-Bedroom Apartments')",
              },
              {
                id: "field-features",
                key: "features",
                type: "textarea" as FieldType,
                value: "",
                description: "Unique features (comma-separated list)",
              },
              {
                id: "field-brochure",
                key: "brochureUrl",
                type: "text" as FieldType,
                value: "",
                description: "Brochure PDF download URL",
              },
              // Location Section
              {
                id: "field-location-desc",
                key: "locationDescription",
                type: "textarea" as FieldType,
                value: "",
                description: "Location section main description",
              },
              {
                id: "field-map-embed",
                key: "mapEmbedUrl",
                type: "text" as FieldType,
                value: "",
                description: "Google Maps embed URL",
              },
              {
                id: "field-emplacement",
                key: "emplacementText",
                type: "textarea" as FieldType,
                value: "",
                description: "Emplacement subsection text",
              },
              {
                id: "field-recreational",
                key: "recreationalText",
                type: "textarea" as FieldType,
                value: "",
                description: "Recreational Activities subsection text",
              },
              {
                id: "field-video-tour",
                key: "videoTourUrl",
                type: "text" as FieldType,
                value: "",
                description: "Video tour URL (optional)",
              }
            );
          }

          setFields(baseFields);
        } else if (hasProfilePages) {
          // For other collections with profile pages, add slug field
          setFields([
            {
              id: "field-slug",
              key: "slug",
              type: "text" as FieldType,
              value: "",
              description: "URL slug for the detail page. Required for profile pages.",
            },
          ]);
        } else {
          // New item - start with one empty field or empty
          setFields([]);
        }
      }
    }
  }, [open, item, collectionSlug, hasProfilePages]);

  const handleAddField = () => {
    setFields([
      ...fields,
      { id: `new-${Date.now()}`, key: "", type: "text", value: "" },
    ]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleSave = async () => {
    // Validate
    if (fields.some((f) => !f.key)) {
      toast.error("All fields must have a key (name)");
      return;
    }

    setIsLoading(true);
    try {
      // Construct content object
      const content: any = {};
      const schema: { key: string; type: FieldType }[] = [];

      fields.forEach((f) => {
        content[f.key] = f.value; // You might want to parse numbers/booleans here
        schema.push({ key: f.key, type: f.type });
      });

      content._schema = schema;

      let result;
      if (item) {
        result = await updateCollectionItem(item.id, { content });
      } else {
        result = await createCollectionItem({ collectionId, content });
      }

      if (result.success) {
        toast.success(item ? "Item updated" : "Item created");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to save item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? t('title') : t('new')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border p-4 rounded-lg bg-muted/20 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('field')} {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveField(field.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('remove')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block font-medium">{t('fieldName')}</Label>
                  <Input
                    value={field.key}
                    onChange={(e) => updateField(field.id, { key: e.target.value })}
                    placeholder="e.g. title"
                    disabled={!!field.description}
                  />
                  {field.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {field.description}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm mb-2 block font-medium">{t('type')}</Label>
                  <Select
                    value={field.type}
                    onValueChange={(val) => updateField(field.id, { type: val as FieldType })}
                    disabled={!!field.description}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">{t('types.text')}</SelectItem>
                      <SelectItem value="textarea">{t('types.textarea')}</SelectItem>
                      <SelectItem value="image">{t('types.image')}</SelectItem>
                      <SelectItem value="number">{t('types.number')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block font-medium">{t('value')}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={field.value}
                    onChange={(e) => updateField(field.id, { value: e.target.value })}
                    className="min-h-[100px] resize-y"
                    placeholder={t('enterValue')}
                  />
                ) : (
                  <Input
                    value={field.value}
                    onChange={(e) => updateField(field.id, { value: e.target.value })}
                    placeholder={t('enterValue')}
                  />
                )}
              </div>
            </div>
          ))}

          <Button onClick={handleAddField} variant="outline" className="w-full border-dashed">
            <Plus className="mr-2 h-4 w-4" /> {t('addField')}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
