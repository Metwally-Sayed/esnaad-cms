"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { MetadataImageUpload } from "@/components/admin/pages/metadata-image-upload";
import { updateGlobalSeoDefaults } from "@/server/actions/global-settings";

const globalSeoSchema = z.object({
  defaultOgImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  defaultOgSiteName: z.string().trim().optional().or(z.literal("")),
  defaultOgLocale: z.string().trim().optional().or(z.literal("")),
  defaultTwitterSite: z.string().trim().optional().or(z.literal("")),
  defaultTwitterCreator: z.string().trim().optional().or(z.literal("")),
  defaultAuthor: z.string().trim().optional().or(z.literal("")),
  defaultRobots: z.string().trim().optional().or(z.literal("")),
});

type GlobalSeoFormValues = z.infer<typeof globalSeoSchema>;

interface GlobalSeoSettingsFormProps {
  defaults: {
    defaultOgImage: string | null;
    defaultOgSiteName: string | null;
    defaultOgLocale: string | null;
    defaultTwitterSite: string | null;
    defaultTwitterCreator: string | null;
    defaultAuthor: string | null;
    defaultRobots: string | null;
  };
}

export function GlobalSeoSettingsForm({ defaults }: GlobalSeoSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<GlobalSeoFormValues>({
    resolver: zodResolver(globalSeoSchema),
    defaultValues: {
      defaultOgImage: defaults.defaultOgImage || "",
      defaultOgSiteName: defaults.defaultOgSiteName || "",
      defaultOgLocale: defaults.defaultOgLocale || "en_US",
      defaultTwitterSite: defaults.defaultTwitterSite || "",
      defaultTwitterCreator: defaults.defaultTwitterCreator || "",
      defaultAuthor: defaults.defaultAuthor || "",
      defaultRobots: defaults.defaultRobots || "index,follow",
    },
  });

  const onSubmit = async (data: GlobalSeoFormValues) => {
    setIsSaving(true);

    try {
      const result = await updateGlobalSeoDefaults({
        defaultOgImage: data.defaultOgImage || null,
        defaultOgSiteName: data.defaultOgSiteName || null,
        defaultOgLocale: data.defaultOgLocale || null,
        defaultTwitterSite: data.defaultTwitterSite || null,
        defaultTwitterCreator: data.defaultTwitterCreator || null,
        defaultAuthor: data.defaultAuthor || null,
        defaultRobots: data.defaultRobots || null,
      });

      if (result.success) {
        toast.success("Global SEO settings saved successfully!");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving global SEO settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Default Open Graph Settings</CardTitle>
            <CardDescription>
              These values will be used for social media sharing (Facebook, LinkedIn, WhatsApp) when not specified on individual pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="defaultOgImage"
              render={({ field }) => (
                <MetadataImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  label="Default OG Image"
                  description="Default image for social media sharing. Will be used when pages don't have their own OG image."
                  recommendedSize="1200x630px"
                />
              )}
            />

            <FormField
              control={form.control}
              name="defaultOgSiteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Site Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Esnaad CMS"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your site or brand name that appears in social media shares.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultOgLocale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Locale</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default locale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en_US">English (US)</SelectItem>
                      <SelectItem value="en_GB">English (UK)</SelectItem>
                      <SelectItem value="ar_AR">Arabic</SelectItem>
                      <SelectItem value="es_ES">Spanish</SelectItem>
                      <SelectItem value="fr_FR">French</SelectItem>
                      <SelectItem value="de_DE">German</SelectItem>
                      <SelectItem value="ja_JP">Japanese</SelectItem>
                      <SelectItem value="zh_CN">Chinese (Simplified)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Default language and region for Open Graph tags.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Twitter Card Settings</CardTitle>
            <CardDescription>
              Configure default Twitter/X settings for better social sharing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="defaultTwitterSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Twitter Site Handle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@yoursite"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your organization&apos;s Twitter/X username (with @). Shown in Twitter cards.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultTwitterCreator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Twitter Creator Handle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@creator"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Default content creator&apos;s Twitter/X username (with @).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Content Settings</CardTitle>
            <CardDescription>
              Default authorship and indexing settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="defaultAuthor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Author</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Your Name or Organization"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Default author name for content attribution.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultRobots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Robots Directive</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default robots directive" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="index,follow">Index, Follow (Default - Allow indexing)</SelectItem>
                      <SelectItem value="noindex,follow">No Index, Follow (Don&apos;t index page)</SelectItem>
                      <SelectItem value="index,nofollow">Index, No Follow (Index but don&apos;t follow links)</SelectItem>
                      <SelectItem value="noindex,nofollow">No Index, No Follow (Don&apos;t index or follow)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Default search engine indexing behavior. Most sites use &quot;index,follow&quot;.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} size="lg">
            {isSaving ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="me-2 h-4 w-4" />
                Save Global SEO Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
