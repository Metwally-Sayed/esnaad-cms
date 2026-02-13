import { z } from "zod/v3";

// Alternate language schema for hreflang
export const alternateLanguageSchema = z.object({
  lang: z.string(),
  url: z.string().url(),
});

// Metadata schema for comprehensive SEO
// Note: SEO length limits are soft guidelines enforced by the CharCount UI indicator,
// not hard validation limits. The schema uses generous max values to avoid blocking saves.
export const pageMetadataSchema = z.object({
  // Basic SEO (English)
  seoTitle: z.string().trim().max(500).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(500).optional().or(z.literal("")),
  seoKeywords: z.array(z.string()).optional().default([]),
  focusKeyword: z.string().trim().optional().or(z.literal("")),

  // Basic SEO (Arabic)
  seoTitleAr: z.string().trim().max(500).optional().or(z.literal("")),
  seoDescriptionAr: z.string().trim().max(500).optional().or(z.literal("")),
  seoKeywordsAr: z.array(z.string()).optional().default([]),
  focusKeywordAr: z.string().trim().optional().or(z.literal("")),

  // Open Graph (English)
  ogTitle: z.string().trim().max(500).optional().or(z.literal("")),
  ogDescription: z.string().trim().max(500).optional().or(z.literal("")),
  ogImage: z.string().refine((val) => !val || val.startsWith('/') || val.startsWith('http'), "Must be a valid URL or path").optional().or(z.literal("")),
  ogType: z.enum(["website", "article", "product", "profile"]).optional(),
  ogUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  ogSiteName: z.string().trim().optional().or(z.literal("")),
  ogLocale: z.string().optional(),
  ogLocaleAlternate: z.array(z.string()).optional().default([]),

  // Open Graph (Arabic)
  ogTitleAr: z.string().trim().max(500).optional().or(z.literal("")),
  ogDescriptionAr: z.string().trim().max(500).optional().or(z.literal("")),
  ogImageAr: z.string().refine((val) => !val || val.startsWith('/') || val.startsWith('http'), "Must be a valid URL or path").optional().or(z.literal("")),

  // Open Graph Article
  ogArticleAuthor: z.string().trim().optional().or(z.literal("")),
  ogArticlePublishedTime: z.coerce.date().optional().nullable(),
  ogArticleModifiedTime: z.coerce.date().optional().nullable(),
  ogArticleSection: z.string().trim().optional().or(z.literal("")),
  ogArticleTags: z.array(z.string()).optional().default([]),

  // Twitter Card (English)
  twitterCard: z.enum(["summary", "summary_large_image", "app", "player"]).optional(),
  twitterTitle: z.string().trim().max(500).optional().or(z.literal("")),
  twitterDescription: z.string().trim().max(500).optional().or(z.literal("")),
  twitterImage: z.string().refine((val) => !val || val.startsWith('/') || val.startsWith('http'), "Must be a valid URL or path").optional().or(z.literal("")),
  twitterImageAlt: z.string().trim().max(420, "Alt text too long").optional().or(z.literal("")),
  twitterSite: z.string().trim().optional().or(z.literal("")),
  twitterCreator: z.string().trim().optional().or(z.literal("")),

  // Twitter Card (Arabic)
  twitterTitleAr: z.string().trim().max(500).optional().or(z.literal("")),
  twitterDescriptionAr: z.string().trim().max(500).optional().or(z.literal("")),

  // Technical SEO
  canonicalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  robots: z.string().optional(),
  metaRobots: z.string().optional().or(z.literal("")),
  alternateLanguages: z.array(alternateLanguageSchema).optional(),

  // Content Metadata
  author: z.string().trim().optional().or(z.literal("")),
  publishedDate: z.coerce.date().optional().nullable(),
  modifiedDate: z.coerce.date().optional().nullable(),
  category: z.string().trim().optional().or(z.literal("")),
  tags: z.array(z.string()).optional().default([]),

  // Structured Data
  structuredData: z.any().optional(), // JSON-LD schema

  // Advanced
  breadcrumbTitle: z.string().trim().optional().or(z.literal("")),
  noindex: z.boolean().optional().default(false),
  nofollow: z.boolean().optional().default(false),

  // Page title (Arabic)
  titleAr: z.string().trim().optional().or(z.literal("")),
});

// Main page schema
export const pageDetailsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Shorter titles read better."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(
      /^\/?[a-z0-9-/]+$/,
      "Only lowercase letters, numbers, slashes, and hyphens are allowed."
    ),
  description: z
    .string()
    .trim()
    .max(420, "Keep descriptions under 420 characters.")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
  // Include metadata
  metadata: pageMetadataSchema.optional(),
});

export type PageDetailsFormValues = z.infer<typeof pageDetailsSchema>;
export type PageMetadataFormValues = z.infer<typeof pageMetadataSchema>;
