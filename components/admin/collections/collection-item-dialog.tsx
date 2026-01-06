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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaPicker } from "@/components/admin/media/media-picker";
import { UnitsArrayField } from "@/components/admin/collections/units-array-field";
import { MultiImagePicker } from "@/components/admin/collections/multi-image-picker";
import { createCollectionItem, updateCollectionItem } from "@/server/actions/collection";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FieldType = "text" | "textarea" | "number" | "image" | "video" | "media" | "boolean";

interface Field {
  id: string;
  key: string;
  type: FieldType;
  valueEn: string;
  valueAr: string;
  description?: string;
}


interface FieldConfig {
    key: string;
    type: FieldType;
    required?: boolean;
    isFixed?: boolean;
    description?: string;
}

interface CollectionItemDialogProps {
  collectionId: string;
  collectionSlug?: string;
  hasProfilePages?: boolean;
  fields?: FieldConfig[] | null;
  item?: { id: string; content: Record<string, unknown> }; // If provided, we are editing
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CollectionItemDialog({
  collectionId,
  collectionSlug: _collectionSlug,
  hasProfilePages: _hasProfilePages,
  fields: collectionFields,
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
      // ALWAYS use collection schema if available
      if (collectionFields && collectionFields.length > 0) {
        if (item && item.content) {
          // Editing existing item - populate with values
          const rawContent = item.content;

          // Extract EN and AR content from localized structure
          const contentEn = (rawContent.en && typeof rawContent.en === 'object')
            ? rawContent.en as Record<string, unknown>
            : rawContent as Record<string, unknown>;

          const contentAr = (rawContent.ar && typeof rawContent.ar === 'object')
            ? rawContent.ar as Record<string, unknown>
            : {} as Record<string, unknown>;

          setFields(
            collectionFields.map((cf, i) => ({
              id: `field-${i}`,
              key: cf.key,
              type: cf.type,
              valueEn: contentEn[cf.key] !== undefined ? String(contentEn[cf.key]) : "",
              valueAr: contentAr[cf.key] !== undefined ? String(contentAr[cf.key]) : "",
              description: cf.description,
            }))
          );
        } else {
          // New item - start with empty values
          setFields(
            collectionFields.map((cf, i) => ({
              id: `field-${i}`,
              key: cf.key,
              type: cf.type,
              valueEn: "",
              valueAr: "",
              description: cf.description,
            }))
          );
        }
        return;
      }

      // No schema defined - show error message
      setFields([]);
    }
  }, [open, item, collectionFields]);

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
      // Construct field content for EN locale
      const fieldContentEn: Record<string, unknown> = {};
      const fieldContentAr: Record<string, unknown> = {};
      const schema: { key: string; type: FieldType }[] = [];

      fields.forEach((f) => {
        fieldContentEn[f.key] = f.valueEn;
        fieldContentAr[f.key] = f.valueAr;
        schema.push({ key: f.key, type: f.type });
      });

      fieldContentEn._schema = schema;
      fieldContentAr._schema = schema;

      // Create localized structure
      const content: Record<string, unknown> = {
        en: fieldContentEn,
        ar: fieldContentAr,
      };

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
  } catch {
    toast.error("Failed to save item");
  } finally {
    setIsLoading(false);
  }
};

  // Check if schema is defined
  const hasSchema = !!(collectionFields && collectionFields.length > 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? t('title') : t('new')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!hasSchema && (
            <div className="border border-destructive/50 bg-destructive/10 rounded-lg p-4 text-center">
              <p className="text-sm text-destructive font-medium">
                ⚠️ No schema defined for this collection
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Please edit the collection settings to define the field schema before adding items.
              </p>
            </div>
          )}

          {hasSchema && fields.length === 0 && (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
              Loading fields...
            </div>
          )}

          {hasSchema && fields.length > 0 && (
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>

              <TabsContent value="en" className="space-y-4 mt-4">
                {fields.map((field) => (
                  <div key={`${field.id}-en`} className="grid w-full gap-1.5">
                    {/* Special handling for shared fields (images are language-independent) */}
                    {field.key === "units" ? (
                      <UnitsArrayField
                        value={field.valueEn}
                        onChange={(value) => updateField(field.id, { valueEn: value })}
                        label={field.key}
                      />
                    ) : field.key === "conceptImages" ? (
                      <MultiImagePicker
                        value={field.valueEn}
                        onChange={(value) => updateField(field.id, { valueEn: value })}
                        label="Concept Images"
                        maxImages={6}
                      />
                    ) : field.key === "floorPlans" ? (
                      <MultiImagePicker
                        value={field.valueEn}
                        onChange={(value) => updateField(field.id, { valueEn: value })}
                        label="Floor Plans"
                        maxImages={10}
                      />
                    ) : field.type === "image" ? (
                      <MediaPicker
                        value={field.valueEn}
                        onChange={(url) => updateField(field.id, { valueEn: url })}
                        accept="image"
                        label={field.key}
                        placeholder={`Enter ${field.key}...`}
                      />
                    ) : field.type === "video" ? (
                      <MediaPicker
                        value={field.valueEn}
                        onChange={(url) => updateField(field.id, { valueEn: url })}
                        accept="video"
                        label={field.key}
                        placeholder={`Enter ${field.key}...`}
                      />
                    ) : field.type === "media" ? (
                      <MediaPicker
                        value={field.valueEn}
                        onChange={(url) => updateField(field.id, { valueEn: url })}
                        accept="all"
                        label={field.key}
                        placeholder={`Enter ${field.key}...`}
                      />
                    ) : (
                      <>
                        <Label htmlFor={`${field.id}-en`} className="text-sm font-medium">
                          {field.key}
                          {field.description && (
                            <span className="text-xs font-normal text-muted-foreground ms-2">
                              - {field.description}
                            </span>
                          )}
                        </Label>

                        {field.type === "textarea" ? (
                          <Textarea
                            id={`${field.id}-en`}
                            value={field.valueEn}
                            onChange={(e) => updateField(field.id, { valueEn: e.target.value })}
                            className="min-h-[100px] resize-y"
                            placeholder={`Enter ${field.key}...`}
                          />
                        ) : (
                          <Input
                            id={`${field.id}-en`}
                            value={field.valueEn}
                            onChange={(e) => updateField(field.id, { valueEn: e.target.value })}
                            placeholder={`Enter ${field.key}...`}
                            type={field.type === "number" ? "number" : "text"}
                          />
                        )}
                      </>
                    )}

                    {!["image", "video", "media"].includes(field.type) && !["units", "conceptImages", "floorPlans"].includes(field.key) && field.description && (
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="ar" className="space-y-4 mt-4">
                {fields.map((field) => (
                  <div key={`${field.id}-ar`} className="grid w-full gap-1.5">
                    {/* Special handling for shared fields (images/units are shared, text is localized) */}
                    {field.key === "units" || field.key === "conceptImages" || field.key === "floorPlans" || field.type === "image" || field.type === "video" || field.type === "media" ? (
                      <div className="p-4 bg-muted/20 rounded-lg text-sm text-muted-foreground text-center">
                        <p>⚠️ {field.key} is shared across languages. Edit in English tab.</p>
                      </div>
                    ) : (
                      <>
                        <Label htmlFor={`${field.id}-ar`} className="text-sm font-medium" dir="rtl">
                          {field.key}
                          {field.description && (
                            <span className="text-xs font-normal text-muted-foreground me-2">
                              - {field.description}
                            </span>
                          )}
                        </Label>

                        {field.type === "textarea" ? (
                          <Textarea
                            id={`${field.id}-ar`}
                            value={field.valueAr}
                            onChange={(e) => updateField(field.id, { valueAr: e.target.value })}
                            className="min-h-[100px] resize-y"
                            placeholder={`أدخل ${field.key}...`}
                            dir="rtl"
                          />
                        ) : (
                          <Input
                            id={`${field.id}-ar`}
                            value={field.valueAr}
                            onChange={(e) => updateField(field.id, { valueAr: e.target.value })}
                            placeholder={`أدخل ${field.key}...`}
                            type={field.type === "number" ? "number" : "text"}
                            dir="rtl"
                          />
                        )}
                      </>
                    )}

                    {!["image", "video", "media", "units", "conceptImages", "floorPlans"].includes(field.key) && field.description && (
                      <p className="text-xs text-muted-foreground" dir="rtl">{field.description}</p>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !hasSchema}>
            {isLoading ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
