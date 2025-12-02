import { z } from "zod/v3";

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
});

export type PageDetailsFormValues = z.infer<typeof pageDetailsSchema>;
