import { z } from "zod";

/**
 * Validation schema for collection items
 * Provides type safety for collection content
 */
export const collectionItemContentSchema = z.record(z.string(), z.unknown()).optional();

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  hasProfilePages: z.boolean().optional().default(false),
  profilePageSlugPattern: z.string().optional(),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  hasProfilePages: z.boolean().optional(),
  profilePageSlugPattern: z.string().optional(),
});

export const createCollectionItemSchema = z.object({
  collectionId: z.string().min(1, "Collection ID is required"),
  content: collectionItemContentSchema,
});

export const updateCollectionItemSchema = z.object({
  content: collectionItemContentSchema,
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type CreateCollectionItemInput = z.infer<typeof createCollectionItemSchema>;
export type UpdateCollectionItemInput = z.infer<typeof updateCollectionItemSchema>;
