"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowDown,
    ArrowUp,
    Layers,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import {
    useCallback,
    useMemo,
    useRef,
    useState,
    useTransition,
    type FormEvent,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    BlockType,
    BlockVariantSchema,
    getVariantSchema,
    mergeVariantDefaults,
} from "@/lib/block-variants";
import {
    pageDetailsSchema,
    type PageDetailsFormValues,
} from "@/lib/validators/page";
import type { CreatePageInput } from "@/server/actions/page";
import { createPage, updatePage } from "@/server/actions/page";
import BlockVariantSelector from "./block-variant-selector";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import BlockContentEditor from "./block-content-editor";
import { PageMetadataSectionEnhanced } from "./page-metadata-section-enhanced";
import { AvailableBlock, SelectedBlock } from "./types";

type InitialPageBlock = {
  id: string;
  order: number;
  blockId: string;
  block: {
    id: string;
    name: string;
    type: string;
    variant: string;
    content: Record<string, unknown> | null;
  };
};

type InitialPageData = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
  blocks: InitialPageBlock[];
  // Metadata fields
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  focusKeyword?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogType?: string | null;
  ogUrl?: string | null;
  ogSiteName?: string | null;
  ogLocale?: string | null;
  ogLocaleAlternate?: string[];
  ogArticleAuthor?: string | null;
  ogArticlePublishedTime?: Date | null;
  ogArticleModifiedTime?: Date | null;
  ogArticleSection?: string | null;
  ogArticleTags?: string[];
  twitterCard?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  twitterImageAlt?: string | null;
  twitterSite?: string | null;
  twitterCreator?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  metaRobots?: string | null;
  alternateLanguages?: unknown;
  author?: string | null;
  publishedDate?: Date | null;
  modifiedDate?: Date | null;
  category?: string | null;
  tags?: string[];
  structuredData?: unknown;
  breadcrumbTitle?: string | null;
  noindex?: boolean;
  nofollow?: boolean;
  // Arabic SEO fields
  titleAr?: string | null;
  seoTitleAr?: string | null;
  seoDescriptionAr?: string | null;
  seoKeywordsAr?: string[];
  focusKeywordAr?: string | null;
  ogTitleAr?: string | null;
  ogDescriptionAr?: string | null;
  ogImageAr?: string | null;
  twitterTitleAr?: string | null;
  twitterDescriptionAr?: string | null;
};

interface PageCreateFormProps {
  blocks: AvailableBlock[];
  initialPage?: InitialPageData;
}

const defaultValues: PageDetailsFormValues = {
  title: "",
  slug: "",
  description: "",
  published: false,
};

const buildSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^-/, "");

const cloneContent = (content?: Record<string, unknown> | null) => {
  try {
    return JSON.parse(JSON.stringify(content ?? {}));
  } catch {
    return {};
  }
};

const resolveInitialValues = (
  type: string,
  variant: string,
  content: Record<string, unknown> | null | undefined,
) => {
  const existing = cloneContent(content);
  return mergeVariantDefaults(type as BlockType, variant, existing);
};

const buildInitialSelectedBlocks = (
  initialPage?: InitialPageData,
): SelectedBlock[] => {
  if (!initialPage) {
    return [];
  }

  return initialPage.blocks
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((pageBlock) => {
      const variant = pageBlock.block.variant || "default";
      const schema = getVariantSchema(pageBlock.block.type as BlockType, variant);
      return {
        instanceId: `existing-${pageBlock.blockId}-${pageBlock.order}`,
        blockId: pageBlock.block.id,
        name: pageBlock.block.name,
        type: pageBlock.block.type,
        variant,
        schema,
        values: resolveInitialValues(pageBlock.block.type, variant, pageBlock.block.content),
      };
    });
};

const PageCreateForm = ({ blocks, initialPage }: PageCreateFormProps) => {
  const t = useTranslations("PageEditor");

  const getBlockPreview = useCallback((content: Record<string, unknown> | null) => {
    if (!content || Array.isArray(content)) {
      return t("reusableBlock");
    }

    const title = content["title"];
    if (typeof title === "string" && title.length) {
      return title;
    }

    const subtitle = content["subtitle"];
    if (typeof subtitle === "string" && subtitle.length) {
      return subtitle;
    }

    const description = content["description"];
    if (typeof description === "string" && description.length) {
      return description;
    }

    return t("composableBlock");
  }, [t]);

  const editingPageId = initialPage?.id ?? null;
  const isEditing = Boolean(editingPageId);
  const [selectedBlocks, setSelectedBlocks] = useState<SelectedBlock[]>(() =>
    buildInitialSelectedBlocks(initialPage),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const slugEditedRef = useRef(false);

  const instantiateBlock = useCallback((block: AvailableBlock): SelectedBlock => {
    const variant = block.variant || "default";
    const schema = getVariantSchema(block.type as BlockType, variant);
    return {
      instanceId: `${block.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      blockId: block.id,
      name: block.name,
      type: block.type,
      variant,
      schema,
      values: resolveInitialValues(block.type, variant, block.content),
    };
  }, []);

  const handleAddNewBlock = useCallback((
    type: BlockType,
    variant: BlockVariantSchema,
    defaultValues: Record<string, unknown>
  ) => {
    const newBlock: SelectedBlock = {
      instanceId: `new-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      blockId: `new-${Date.now()}`,
      name: variant.name,
      type,
      variant: variant.id,
      schema: variant,
      values: defaultValues,
    };
    setSelectedBlocks((prev) => [...prev, newBlock]);
  }, []);

  const form = useForm<PageDetailsFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(pageDetailsSchema) as any,
    defaultValues: initialPage
      ? {
          title: initialPage.title,
          slug: initialPage.slug,
          description: initialPage.description ?? "",
          published: initialPage.published,
          metadata: {
            seoTitle: initialPage.seoTitle ?? "",
            seoDescription: initialPage.seoDescription ?? "",
            seoKeywords: initialPage.seoKeywords ?? [],
            focusKeyword: initialPage.focusKeyword ?? "",
            ogTitle: initialPage.ogTitle ?? "",
            ogDescription: initialPage.ogDescription ?? "",
            ogImage: initialPage.ogImage ?? "",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ogType: (initialPage.ogType as any) ?? "website",
            ogUrl: initialPage.ogUrl ?? "",
            ogSiteName: initialPage.ogSiteName ?? "",
            ogLocale: initialPage.ogLocale ?? "en_US",
            ogLocaleAlternate: initialPage.ogLocaleAlternate ?? [],
            ogArticleAuthor: initialPage.ogArticleAuthor ?? "",
            ogArticlePublishedTime: initialPage.ogArticlePublishedTime ?? null,
            ogArticleModifiedTime: initialPage.ogArticleModifiedTime ?? null,
            ogArticleSection: initialPage.ogArticleSection ?? "",
            ogArticleTags: initialPage.ogArticleTags ?? [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            twitterCard: (initialPage.twitterCard as any) ?? "summary_large_image",
            twitterTitle: initialPage.twitterTitle ?? "",
            twitterDescription: initialPage.twitterDescription ?? "",
            twitterImage: initialPage.twitterImage ?? "",
            twitterImageAlt: initialPage.twitterImageAlt ?? "",
            twitterSite: initialPage.twitterSite ?? "",
            twitterCreator: initialPage.twitterCreator ?? "",
            canonicalUrl: initialPage.canonicalUrl ?? "",
            robots: initialPage.robots ?? "index,follow",
            metaRobots: initialPage.metaRobots ?? "",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alternateLanguages: (initialPage.alternateLanguages as any) ?? [],
            author: initialPage.author ?? "",
            publishedDate: initialPage.publishedDate ?? null,
            modifiedDate: initialPage.modifiedDate ?? null,
            category: initialPage.category ?? "",
            tags: initialPage.tags ?? [],
            structuredData: initialPage.structuredData ?? null,
            breadcrumbTitle: initialPage.breadcrumbTitle ?? "",
            noindex: initialPage.noindex ?? false,
            nofollow: initialPage.nofollow ?? false,
            // Arabic SEO fields
            titleAr: initialPage.titleAr ?? "",
            seoTitleAr: initialPage.seoTitleAr ?? "",
            seoDescriptionAr: initialPage.seoDescriptionAr ?? "",
            seoKeywordsAr: initialPage.seoKeywordsAr ?? [],
            focusKeywordAr: initialPage.focusKeywordAr ?? "",
            ogTitleAr: initialPage.ogTitleAr ?? "",
            ogDescriptionAr: initialPage.ogDescriptionAr ?? "",
            ogImageAr: initialPage.ogImageAr ?? "",
            twitterTitleAr: initialPage.twitterTitleAr ?? "",
            twitterDescriptionAr: initialPage.twitterDescriptionAr ?? "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }
      : defaultValues,
  });


  const blockTypeOptions = useMemo(() => {
    const uniqueTypes = Array.from(new Set(blocks.map((block) => block.type)));
    return ["all", ...uniqueTypes];
  }, [blocks]);

  const filteredBlocks = useMemo(() => {
    return blocks.filter((block) => {
      const matchesType = typeFilter === "all" || block.type === typeFilter;
      const matchesQuery =
        searchQuery.length === 0 ||
        block.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesQuery;
    });
  }, [blocks, searchQuery, typeFilter]);

  const handleAddBlock = (block: AvailableBlock) => {
    const nextBlock = instantiateBlock(block);
    setSelectedBlocks((prev) => [...prev, nextBlock]);
  };

  const handleRemoveBlock = (instanceId: string) => {
    setSelectedBlocks((prev) =>
      prev.filter((block) => block.instanceId !== instanceId)
    );
  };

  const handleMoveBlock = (instanceId: string, direction: "up" | "down") => {
    setSelectedBlocks((prev) => {
      const currentIndex = prev.findIndex(
        (block) => block.instanceId === instanceId
      );
      if (currentIndex === -1) return prev;

      const nextIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= prev.length) {
        return prev;
      }

      const copy = [...prev];
      const [moved] = copy.splice(currentIndex, 1);
      copy.splice(nextIndex, 0, moved);
      return copy;
    });
  };

  const handleUpdateBlockValues = (
    instanceId: string,
    values: Record<string, unknown>
  ) => {
    setSelectedBlocks((prev) =>
      prev.map((block) =>
        block.instanceId === instanceId ? { ...block, values } : block
      )
    );
  };

  const toggleEditor = (instanceId: string) => {
    setEditingBlockId((prev) => (prev === instanceId ? null : instanceId));
  };

  const resetForm = useCallback(() => {
    if (initialPage) {
      form.reset({
        title: initialPage.title,
        slug: initialPage.slug,
        description: initialPage.description ?? "",
        published: initialPage.published,
      });
      setSelectedBlocks(buildInitialSelectedBlocks(initialPage));
    } else {
      form.reset(defaultValues);
      setSelectedBlocks([]);
    }
    setEditingBlockId(null);
    slugEditedRef.current = false;
  }, [form, initialPage]);

  const handleFormSubmit = useCallback(
    (values: PageDetailsFormValues) => {
      startTransition(async () => {
        const payload: CreatePageInput = {
          ...values,
          slug: buildSlug(values.slug),
          blocks: selectedBlocks.map((block, index) => ({
            blockId: block.blockId,
            order: index,
            name: block.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: block.type as any,
            variant: block.variant,
            content: block.values ?? {},
          })),
        };

        const result = editingPageId
          ? await updatePage(editingPageId, payload)
          : await createPage(payload);

        if (result.success) {
          toast.success(
            isEditing ? t("pageUpdatedSuccess") : t("pageCreatedSuccess"),
          );
          if (!isEditing) {
            resetForm();
          }
        } else {
          toast.error(result.error ?? t("createError"));
        }
      });
    },
    [editingPageId, isEditing, resetForm, selectedBlocks, startTransition, t]
  );

  const handleSubmitEvent = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      void form.handleSubmit(handleFormSubmit)(event);
    },
    [form, handleFormSubmit]
  );


  return (
    <Form {...form}>
      <form onSubmit={handleSubmitEvent} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("pageDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("pageTitle")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("titlePlaceholder")}
                          {...field}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            field.onChange(nextValue);

                            if (!slugEditedRef.current) {
                              form.setValue("slug", buildSlug(nextValue), {
                                shouldValidate: true,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Use a descriptive title that matches the navigation
                        label.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/landing"
                          {...field}
                          onChange={(event) => {
                            const formatted = buildSlug(event.target.value);
                            slugEditedRef.current = formatted.length > 0;
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Slugs become the public URL. Slashes create nested
                        routes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("shortDescription")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("descriptionPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("internalNote")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border px-4 py-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Publish immediately
                        </FormLabel>
                        <FormDescription>
                          Draft pages stay hidden until toggled live.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO & Metadata Section */}
            <PageMetadataSectionEnhanced />

            <Card>
              <CardHeader>
                <CardTitle>{t("selectedBlocks")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedBlocks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("noBlocksYet")} {t("addFirstBlock")}
                  </p>
                ) : (
                  <div className="space-y-3">
                {selectedBlocks.map((block, index) => (
                  <div
                    key={block.instanceId}
                    className="rounded-lg border bg-card px-3 py-3 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {index + 1}. {block.name}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge variant="outline">{block.type}</Badge>
                          {block.variant && block.variant !== "default" && (
                            <Badge variant="secondary">{block.variant}</Badge>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="px-0 text-xs text-primary"
                          onClick={() => toggleEditor(block.instanceId)}
                        >
                          {editingBlockId === block.instanceId
                            ? t("hideSettings")
                            : t("customize")}
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveBlock(block.instanceId, "up")}
                          aria-label={t("moveUp")}
                        >
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveBlock(block.instanceId, "down")}
                          aria-label={t("moveDown")}
                        >
                          <ArrowDown className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBlock(block.instanceId)}
                          aria-label={t("removeBlock")}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {editingBlockId === block.instanceId && (
                      <div className="rounded-lg border border-dashed bg-background/50 px-3 py-3">
                        <BlockContentEditor
                          key={block.instanceId}
                          block={block}
                          onChange={(values) =>
                            handleUpdateBlockValues(block.instanceId, values)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="size-4" />
                    {t("blockLibrary")}
                  </span>
                  <BlockVariantSelector onSelect={handleAddNewBlock} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute start-2 top-1/2 size-4 -translate-y-1/2" />
                    <Input
                      placeholder={t("searchBlocks")}
                      className="ps-8"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                  </div>
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value)}
                  >
                    <SelectTrigger className="min-w-[140px]">
                      <SelectValue placeholder={t("filter")} />
                    </SelectTrigger>
                    <SelectContent>
                      {blockTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "all" ? t("allTypes") : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="max-h-[600px] space-y-3 overflow-y-auto pe-1">
                  {filteredBlocks.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No blocks match your filters.
                    </p>
                  )}

                  {filteredBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-xl border bg-background/50 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{block.name}</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <Badge variant="outline">{block.type}</Badge>
                            {block.isGlobal && (
                              <Badge variant="secondary">Global</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddBlock(block)}
                        >
                          <Plus className="size-4" />
                          Add
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        {getBlockPreview(block.content)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex  gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("creating") : t("createPage")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PageCreateForm;
