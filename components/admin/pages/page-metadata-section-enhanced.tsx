"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2, FileJson, Settings2, Sparkles, Copy, Check } from "lucide-react";
import type { PageDetailsFormValues } from "@/lib/validators/page";
import { MetadataImageUpload } from "./metadata-image-upload";
import { GooglePreview, SocialPreview, TwitterPreview, SeoScoreIndicator } from "./seo-preview";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GlobalSeoDefaults {
  defaultOgImage: string | null;
  defaultOgSiteName: string | null;
  defaultOgLocale: string | null;
  defaultTwitterSite: string | null;
  defaultTwitterCreator: string | null;
  defaultAuthor: string | null;
  defaultRobots: string | null;
}

// Character count indicator component
function CharCount({ value, min, optimal, max }: { value: string; min: number; optimal: number; max: number }) {
  const count = value?.length || 0;

  const getColor = () => {
    if (count === 0) return "bg-muted text-muted-foreground";
    if (count < min) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (count <= optimal) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (count <= max) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <Badge variant="secondary" className={cn("ms-auto text-xs font-normal", getColor())}>
      {count}/{optimal}
    </Badge>
  );
}

// Auto-sync button for copying values
function SyncButton({ from, to, label }: { from: string; to: string; label: string }) {
  const form = useFormContext<PageDetailsFormValues>();
  const [copied, setCopied] = useState(false);

  const handleSync = () => {
    const value = form.getValues(from as keyof PageDetailsFormValues);
    if (value) {
      form.setValue(to as keyof PageDetailsFormValues, value as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSync}
      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="h-3 w-3 me-1" /> : <Copy className="h-3 w-3 me-1" />}
      {copied ? "Copied!" : label}
    </Button>
  );
}

export function PageMetadataSectionEnhanced() {
  const form = useFormContext<PageDetailsFormValues>();
  const [globalDefaults, setGlobalDefaults] = useState<GlobalSeoDefaults | null>(null);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(true);
  const [mode, setMode] = useState<"simple" | "advanced">("simple");

  // Watch form values for character counters
  const seoTitle = useWatch({ control: form.control, name: "metadata.seoTitle" });
  const seoDescription = useWatch({ control: form.control, name: "metadata.seoDescription" });
  const title = useWatch({ control: form.control, name: "title" });

  useEffect(() => {
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

  useEffect(() => {
    if (globalDefaults && !isLoadingDefaults) {
      if (globalDefaults.defaultOgSiteName) {
        const currentValue = form.getValues("metadata.ogSiteName");
        if (!currentValue || currentValue.trim() === "") {
          form.setValue("metadata.ogSiteName", globalDefaults.defaultOgSiteName);
        }
      }
      if (globalDefaults.defaultOgLocale) {
        const currentValue = form.getValues("metadata.ogLocale");
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              SEO & Metadata
              <Badge variant={mode === "simple" ? "default" : "secondary"} className="text-xs">
                {mode === "simple" ? "Simple" : "Advanced"}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1.5">
              {mode === "simple"
                ? "Essential SEO settings for your page. Switch to Advanced for more options."
                : "Full control over all SEO and metadata settings."
              }
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="seo-mode" className="text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 inline me-1" />
              Simple
            </Label>
            <Switch
              id="seo-mode"
              checked={mode === "advanced"}
              onCheckedChange={(checked: boolean) => setMode(checked ? "advanced" : "simple")}
            />
            <Label htmlFor="seo-mode" className="text-sm text-muted-foreground">
              <Settings2 className="h-4 w-4 inline me-1" />
              Advanced
            </Label>
          </div>
        </div>
        {globalDefaults && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
            ✓ Global SEO defaults applied automatically
          </p>
        )}
      </CardHeader>
      <CardContent>
        {mode === "simple" ? (
          <SimpleSeoMode />
        ) : (
          <AdvancedSeoMode globalDefaults={globalDefaults} />
        )}
      </CardContent>
    </Card>
  );
}

// Simple mode - Essential fields only with live previews
function SimpleSeoMode() {
  const form = useFormContext<PageDetailsFormValues>();
  const title = useWatch({ control: form.control, name: "title" });
  const seoTitle = useWatch({ control: form.control, name: "metadata.seoTitle" });
  const seoDescription = useWatch({ control: form.control, name: "metadata.seoDescription" });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Essential Fields */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            Essential SEO
            <Badge variant="outline" className="text-xs font-normal">Required</Badge>
          </h4>

          {/* SEO Title */}
          <FormField
            control={form.control}
            name="metadata.seoTitle"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>SEO Title</FormLabel>
                  <CharCount value={field.value || title || ""} min={30} optimal={60} max={70} />
                </div>
                <FormControl>
                  <Input
                    placeholder={title || "Enter SEO title (50-60 chars ideal)"}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty to use page title. This appears in Google search results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SEO Description */}
          <FormField
            control={form.control}
            name="metadata.seoDescription"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Meta Description</FormLabel>
                  <CharCount value={field.value || ""} min={120} optimal={160} max={170} />
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Compelling description to attract clicks from search results (150-160 chars ideal)"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Focus Keyword */}
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
                  The main keyword you want to rank for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* OG Image - Most important social field */}
          <FormField
            control={form.control}
            name="metadata.ogImage"
            render={({ field }) => (
              <MetadataImageUpload
                value={field.value || ""}
                onChange={(url) => {
                  field.onChange(url);
                  // Auto-sync to Twitter if empty
                  const twitterImage = form.getValues("metadata.twitterImage");
                  if (!twitterImage) {
                    form.setValue("metadata.twitterImage", url);
                  }
                }}
                label="Social Share Image"
                description="Used for Facebook, LinkedIn, Twitter when shared."
                recommendedSize="1200x630px"
              />
            )}
          />
        </div>
      </div>

      {/* Right: Live Previews & Score */}
      <div className="space-y-4">
        <SeoScoreIndicator />

        <Tabs defaultValue="google" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="google" className="flex-1">Google</TabsTrigger>
            <TabsTrigger value="social" className="flex-1">Social</TabsTrigger>
            <TabsTrigger value="twitter" className="flex-1">Twitter</TabsTrigger>
          </TabsList>
          <TabsContent value="google" className="mt-4">
            <GooglePreview />
          </TabsContent>
          <TabsContent value="social" className="mt-4">
            <SocialPreview />
          </TabsContent>
          <TabsContent value="twitter" className="mt-4">
            <TwitterPreview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Advanced mode - All fields in accordion
function AdvancedSeoMode({ globalDefaults }: { globalDefaults: GlobalSeoDefaults | null }) {
  const form = useFormContext<PageDetailsFormValues>();
  const title = useWatch({ control: form.control, name: "title" });
  const seoTitle = useWatch({ control: form.control, name: "metadata.seoTitle" });
  const seoDescription = useWatch({ control: form.control, name: "metadata.seoDescription" });
  const ogTitle = useWatch({ control: form.control, name: "metadata.ogTitle" });
  const ogDescription = useWatch({ control: form.control, name: "metadata.ogDescription" });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content - 2 columns */}
      <div className="lg:col-span-2">
        <Accordion type="multiple" defaultValue={["basic-seo"]} className="w-full">
          {/* Basic SEO */}
          <AccordionItem value="basic-seo">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                Basic SEO
                <Badge variant="outline" className="text-xs">Essential</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>SEO Title</FormLabel>
                      <CharCount value={field.value || title || ""} min={30} optimal={60} max={70} />
                    </div>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>SEO Description</FormLabel>
                      <CharCount value={field.value || ""} min={120} optimal={160} max={170} />
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Description shown in search results (150-160 chars)"
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
                name="metadata.focusKeyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focus Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary keyword for this page" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <KeywordsField />
            </AccordionContent>
          </AccordionItem>

          {/* Open Graph */}
          <AccordionItem value="open-graph">
            <AccordionTrigger>Open Graph (Facebook, LinkedIn)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="metadata.ogTitle"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>OG Title</FormLabel>
                      <div className="flex items-center gap-2">
                        <SyncButton from="metadata.seoTitle" to="metadata.ogTitle" label="Copy from SEO" />
                        <CharCount value={field.value || seoTitle || title || ""} min={30} optimal={60} max={95} />
                      </div>
                    </div>
                    <FormControl>
                      <Input placeholder={seoTitle || title || "Title when shared"} {...field} />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>OG Description</FormLabel>
                      <SyncButton from="metadata.seoDescription" to="metadata.ogDescription" label="Copy from SEO" />
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder={seoDescription || "Description when shared"}
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
                    description="Image displayed when shared on Facebook, LinkedIn."
                    recommendedSize="1200x630px"
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-4">
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
                  name="metadata.ogLocale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Locale</FormLabel>
                      <FormControl>
                        <Input placeholder="en_US" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="metadata.ogSiteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your site name" {...field} />
                    </FormControl>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Twitter Title</FormLabel>
                      <SyncButton from="metadata.ogTitle" to="metadata.twitterTitle" label="Copy from OG" />
                    </div>
                    <FormControl>
                      <Input placeholder={ogTitle || seoTitle || title || "Title for Twitter"} {...field} />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Twitter Description</FormLabel>
                      <SyncButton from="metadata.ogDescription" to="metadata.twitterDescription" label="Copy from OG" />
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder={ogDescription || seoDescription || "Description for Twitter"}
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="metadata.twitterSite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="@yoursitehandle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metadata.twitterCreator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="@authorhandle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                      <Input type="text" placeholder="https://example.com/page" {...field} />
                    </FormControl>
                    <FormDescription>
                      The preferred URL for this page if accessible from multiple URLs.
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
                      Directives: index/noindex, follow/nofollow
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
                          Hide from search engines
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
                          Don&apos;t follow links
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
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

          {/* Arabic SEO */}
          <AccordionItem value="arabic">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                🇸🇦 Arabic SEO
                <Badge variant="outline" className="text-xs">RTL</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Arabic content for the /ar version of this page. Leave empty to use English content.
              </p>

              <FormField
                control={form.control}
                name="metadata.titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title (Arabic)</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان الصفحة" dir="rtl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.seoTitleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title (Arabic)</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان SEO للصفحة" dir="rtl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.seoDescriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description (Arabic)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="وصف الصفحة لمحركات البحث"
                        dir="rtl"
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
                name="metadata.focusKeywordAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focus Keyword (Arabic)</FormLabel>
                    <FormControl>
                      <Input placeholder="الكلمة المفتاحية الرئيسية" dir="rtl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ArabicKeywordsField />

              <FormField
                control={form.control}
                name="metadata.ogTitleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Title (Arabic)</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان للمشاركة على وسائل التواصل" dir="rtl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.ogDescriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Description (Arabic)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="وصف للمشاركة على وسائل التواصل"
                        dir="rtl"
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
                name="metadata.ogImageAr"
                render={({ field }) => (
                  <MetadataImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    label="OG Image (Arabic)"
                    description="Arabic version of the social share image."
                    recommendedSize="1200x630px"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterTitleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Title (Arabic)</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان تويتر" dir="rtl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.twitterDescriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Description (Arabic)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="وصف تويتر"
                        dir="rtl"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      JSON-LD schema for rich snippets
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Sidebar - Preview & Score */}
      <div className="space-y-4">
        <SeoScoreIndicator />
        <GooglePreview />
        <SocialPreview />
      </div>
    </div>
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
            <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => append("")} className="w-full">
        <Plus className="me-2 h-4 w-4" />
        Add Keyword
      </Button>
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
            <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => append("")} className="w-full">
        <Plus className="me-2 h-4 w-4" />
        Add Tag
      </Button>
    </div>
  );
}

// Arabic Keywords array field component
function ArabicKeywordsField() {
  const form = useFormContext<PageDetailsFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metadata.seoKeywordsAr",
  });

  return (
    <div className="space-y-2">
      <FormLabel>SEO Keywords (Arabic)</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={form.control}
              name={`metadata.seoKeywordsAr.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="كلمة مفتاحية" dir="rtl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => append("")} className="w-full">
        <Plus className="me-2 h-4 w-4" />
        إضافة كلمة مفتاحية
      </Button>
    </div>
  );
}

export default PageMetadataSectionEnhanced;
