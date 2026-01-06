"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, FileJson } from "lucide-react";
import type { PageDetailsFormValues } from "@/lib/validators/page";
import { MetadataImageUpload } from "./metadata-image-upload";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GlobalSeoDefaults {
  defaultOgImage: string | null;
  defaultOgSiteName: string | null;
  defaultOgLocale: string | null;
  defaultTwitterSite: string | null;
  defaultTwitterCreator: string | null;
  defaultAuthor: string | null;
  defaultRobots: string | null;
}

export function PageMetadataSection() {
  const form = useFormContext<PageDetailsFormValues>();
  const [globalDefaults, setGlobalDefaults] = useState<GlobalSeoDefaults | null>(null);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(true);

  useEffect(() => {
    // Fetch global SEO defaults on mount
    async function fetchDefaults() {
      try {
        const response = await fetch("/api/global-seo-defaults");
        const data = await response.json();
        if (data.success) {
          setGlobalDefaults(data.defaults);
        }
      } catch (error) {
        console.error("Failed to fetch global SEO defaults:", error);
      } finally {
        setIsLoadingDefaults(false);
      }
    }
    fetchDefaults();
  }, []);

  // Apply global defaults to form when they're loaded
  useEffect(() => {
    if (globalDefaults && !isLoadingDefaults) {
      // Set defaults - they will apply if fields are empty or just whitespace
      if (globalDefaults.defaultOgSiteName) {
        const currentValue = form.getValues("metadata.ogSiteName");
        if (!currentValue || currentValue.trim() === "") {
          form.setValue("metadata.ogSiteName", globalDefaults.defaultOgSiteName);
        }
      }
      if (globalDefaults.defaultOgLocale) {
        const currentValue = form.getValues("metadata.ogLocale");
        // Override even the hardcoded "en_US" if global default is different
        if (!currentValue || currentValue.trim() === "" || currentValue === "en_US") {
          form.setValue("metadata.ogLocale", globalDefaults.defaultOgLocale);
        }
      }
      if (globalDefaults.defaultTwitterSite) {
        const currentValue = form.getValues("metadata.twitterSite");
        if (!currentValue || currentValue.trim() === "") {
          form.setValue("metadata.twitterSite", globalDefaults.defaultTwitterSite);
        }
      }
      if (globalDefaults.defaultTwitterCreator) {
        const currentValue = form.getValues("metadata.twitterCreator");
        if (!currentValue || currentValue.trim() === "") {
          form.setValue("metadata.twitterCreator", globalDefaults.defaultTwitterCreator);
        }
      }
      if (globalDefaults.defaultAuthor) {
        const currentValue = form.getValues("metadata.author");
        if (!currentValue || currentValue.trim() === "") {
          form.setValue("metadata.author", globalDefaults.defaultAuthor);
        }
      }
      if (globalDefaults.defaultOgImage) {
        const currentValue = form.getValues("metadata.ogImage");
        if (!currentValue || currentValue.trim() === "") {
          form.setValue("metadata.ogImage", globalDefaults.defaultOgImage);
        }
      }
    }
  }, [globalDefaults, isLoadingDefaults, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO & Metadata</CardTitle>
        <CardDescription>
          Comprehensive SEO settings to optimize your page for search engines and social media.
          {globalDefaults && (
            <span className="block mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Global SEO defaults have been automatically applied. You can edit any field to override.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {/* Basic SEO */}
          <AccordionItem value="basic-seo">
            <AccordionTrigger>Basic SEO</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Page title for search engines (50-60 chars)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optimized for Google search results. Defaults to page title if not set.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description shown in search results (150-160 chars)"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Compelling description to improve click-through rates from search results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.focusKeyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focus Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary keyword for this page" {...field} />
                    </FormControl>
                    <FormDescription>
                      Main keyword you want this page to rank for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <KeywordsField />
            </AccordionContent>
          </AccordionItem>

          {/* Open Graph */}
          <AccordionItem value="open-graph">
            <AccordionTrigger>Open Graph (Facebook, LinkedIn, WhatsApp)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.ogTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title when shared (under 95 chars)" {...field} />
                    </FormControl>
                    <FormDescription>Defaults to SEO title if not set.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.ogDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description when shared (under 200 chars)"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.ogImage"
                render={({ field }) => (
                  <MetadataImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    label="OG Image"
                    description="Image displayed when shared on Facebook, LinkedIn, WhatsApp."
                    recommendedSize="1200x630px"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="metadata.ogType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="profile">Profile</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.ogSiteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Site Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your site name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of your website for social media sharing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.ogLocale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Locale</FormLabel>
                    <FormControl>
                      <Input placeholder="en_US" {...field} />
                    </FormControl>
                    <FormDescription>e.g., en_US, ar_SA</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Twitter Card */}
          <AccordionItem value="twitter">
            <AccordionTrigger>Twitter Card</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.twitterCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Card Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        <SelectItem value="app">App</SelectItem>
                        <SelectItem value="player">Player</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title for Twitter (under 70 chars)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description for Twitter (under 200 chars)"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterImage"
                render={({ field }) => (
                  <MetadataImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    label="Twitter Image"
                    description="Image displayed on Twitter/X."
                    recommendedSize="1200x628px"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterImageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Image Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Alt text for accessibility" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterSite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Site Handle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@yoursitehandle"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Twitter handle of your website
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterCreator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Creator Handle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="@authorhandle"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Twitter handle of the content creator
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Technical SEO */}
          <AccordionItem value="technical">
            <AccordionTrigger>Technical SEO</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.canonicalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canonical URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/page (prevents duplicate content)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The preferred URL for this page if it&apos;s accessible from multiple URLs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.robots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Robots Meta Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="index,follow" {...field} />
                    </FormControl>
                    <FormDescription>
                      Directives: index/noindex, follow/nofollow (e.g., &quot;index,follow&quot;)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="metadata.noindex"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border px-4 py-3">
                      <div className="space-y-0.5">
                        <FormLabel>No Index</FormLabel>
                        <FormDescription className="text-xs">
                          Prevent search engines from indexing
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metadata.nofollow"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border px-4 py-3">
                      <div className="space-y-0.5">
                        <FormLabel>No Follow</FormLabel>
                        <FormDescription className="text-xs">
                          Prevent following links on this page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="metadata.metaRobots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Robots Directives</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="max-snippet:-1, max-image-preview:large"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Advanced directives like max-snippet, max-image-preview, max-video-preview.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Content Metadata */}
          <AccordionItem value="content">
            <AccordionTrigger>Content Metadata</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Author name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Name of the content author
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="metadata.publishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().slice(0, 16)
                              : field.value || ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metadata.modifiedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modified Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().slice(0, 16)
                              : field.value || ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="metadata.category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <TagsField />
            </AccordionContent>
          </AccordionItem>

          {/* Advanced */}
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced SEO</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.breadcrumbTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breadcrumb Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Custom title for breadcrumbs" {...field} />
                    </FormControl>
                    <FormDescription>
                      Override the page title in breadcrumb navigation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.structuredData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      Structured Data (JSON-LD)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : field.value
                              ? JSON.stringify(field.value, null, 2)
                              : ""
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            field.onChange(parsed);
                          } catch {
                            field.onChange(e.target.value);
                          }
                        }}
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <FormDescription>
                      JSON-LD schema for rich snippets (Article, WebPage, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// Keywords array field component
function KeywordsField() {
  const form = useFormContext<PageDetailsFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metadata.seoKeywords",
  });

  return (
    <div className="space-y-2">
      <FormLabel>SEO Keywords</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={form.control}
              name={`metadata.seoKeywords.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Keyword" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
        className="w-full"
      >
        <Plus className="me-2 h-4 w-4" />
        Add Keyword
      </Button>
      <FormDescription>Add relevant keywords for SEO.</FormDescription>
    </div>
  );
}

// Tags array field component
function TagsField() {
  const form = useFormContext<PageDetailsFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metadata.tags",
  });

  return (
    <div className="space-y-2">
      <FormLabel>Tags</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={form.control}
              name={`metadata.tags.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Tag" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
        className="w-full"
      >
        <Plus className="me-2 h-4 w-4" />
        Add Tag
      </Button>
      <FormDescription>Organize content with tags.</FormDescription>
    </div>
  );
}
