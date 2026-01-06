"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/editor/rich-text-editor";
import { MediaPicker } from "@/components/admin/media/media-picker";
import { createMediaItem, updateMediaItem, type MediaItem } from "@/server/actions/media";
import type { JSONContent } from "novel";
import { toast } from "sonner";

interface MediaFormProps {
  item?: MediaItem;
  mode: "create" | "edit";
}

export function MediaForm({ item, mode }: MediaFormProps) {
  const router = useRouter();
  const t = useTranslations("Media");
  const tCommon = useTranslations("Common");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [nameEn, setNameEn] = useState(item?.nameEn || "");
  const [nameAr, setNameAr] = useState(item?.nameAr || "");
  const [slug, setSlug] = useState(item?.slug || "");
  const [type, setType] = useState(item?.type || "updates");
  const [image, setImage] = useState(item?.image || "");
  const [descriptionEn, setDescriptionEn] = useState<JSONContent | undefined>(
    item?.descriptionEn
  );
  const [descriptionAr, setDescriptionAr] = useState<JSONContent | undefined>(
    item?.descriptionAr
  );

  // Auto-generate slug from English name
  const handleNameEnChange = (value: string) => {
    setNameEn(value);
    if (!item) {
      // Only auto-generate slug in create mode
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that an image is provided
    if (!image) {
      toast.error("Please upload an image or provide an image URL");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        nameEn,
        nameAr,
        descriptionEn,
        descriptionAr,
        slug,
        type,
        image,
        order: item?.order || 0,
      };

      const result =
        mode === "create"
          ? await createMediaItem(data)
          : await updateMediaItem(item!.id, data);

      if (result.success) {
        toast.success(t(`messages.${mode === "create" ? "created" : "updated"}`));
        router.push("/admin/media");
        router.refresh();
      } else {
        toast.error(result.error || tCommon("error"));
      }
    } catch {
      toast.error(t(`messages.${mode === "create" ? "createError" : "updateError"}`));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.basicInfo")}</CardTitle>
          <CardDescription>
            {t("form.basicInfoDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nameEn">{t("form.nameEn")} *</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => handleNameEnChange(e.target.value)}
                required
                placeholder={t("form.nameEnPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">{t("form.nameAr")} *</Label>
              <Input
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                required
                placeholder={t("form.nameArPlaceholder")}
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">{t("form.slug")} *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder={t("form.slugPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{t("form.type")} *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updates">{t("types.updates")}</SelectItem>
                  <SelectItem value="insights">{t("types.insights")}</SelectItem>
                  <SelectItem value="news">{t("types.news")}</SelectItem>
                  <SelectItem value="press">{t("types.press")}</SelectItem>
                  <SelectItem value="article">{t("types.article")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <MediaPicker
              value={image}
              onChange={setImage}
              accept="all"
              label={`${t("form.image")} *`}
              placeholder={t("form.imagePlaceholder")}
            />
            <p className="text-sm text-muted-foreground">
              Upload an image or video (max 10MB). Supported formats: JPEG, PNG, GIF, WebP, MP4
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("form.description")}</CardTitle>
          <CardDescription>
            {t("form.descriptionSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">{tCommon("english")}</TabsTrigger>
              <TabsTrigger value="ar">{tCommon("arabic")}</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="mt-4">
              <div className="space-y-2">
                <Label>{t("form.descriptionEn")}</Label>
                <RichTextEditor
                  initialValue={descriptionEn}
                  onChange={setDescriptionEn}
                  placeholder={t("form.descriptionEnPlaceholder")}
                />
              </div>
            </TabsContent>
            <TabsContent value="ar" className="mt-4">
              <div className="space-y-2">
                <Label>{t("form.descriptionAr")}</Label>
                <RichTextEditor
                  initialValue={descriptionAr}
                  onChange={setDescriptionAr}
                  placeholder={t("form.descriptionArPlaceholder")}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? tCommon("saving") : mode === "create" ? tCommon("create") : tCommon("save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/media")}
        >
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  );
}
