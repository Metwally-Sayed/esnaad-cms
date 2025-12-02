/**
 * Block Variant Registry
 *
 * Central registry for all block types and their variants.
 * Each block type can have multiple variants with unique schemas.
 */

import {
    BLOCK_TYPE_VALUES,
    BlockContent,
    BlockListField,
    BlockSchemaField,
    BlockType,
    BlockTypeDefinition,
    BlockVariantRegistry,
    BlockVariantSchema,
} from "./types";

import { aboutDefinition } from "./variants/about";
import { ctaDefinition } from "./variants/cta";
import { featuresDefinition } from "./variants/features";
import { formDefinition } from "./variants/form";
import { heroDefinition } from "./variants/hero";

// Re-export types
export * from "./types";

// Build the registry
const BLOCK_VARIANT_REGISTRY: BlockVariantRegistry = {
  HERO: heroDefinition,
  CTA: ctaDefinition,
  FEATURES: featuresDefinition,
  ABOUT: aboutDefinition,
  // Placeholder definitions for other types - extend as needed
  TEXT: createPlaceholderDefinition("TEXT", "Text", "Rich text content block"),
  IMAGE: createPlaceholderDefinition("IMAGE", "Image", "Single image with caption"),
  GALLERY: createPlaceholderDefinition("GALLERY", "Gallery", "Image gallery or carousel"),
  VIDEO: createPlaceholderDefinition("VIDEO", "Video", "Embedded video player"),
  HIGHLIGHTS: createPlaceholderDefinition("HIGHLIGHTS", "Highlights", "Key statistics or metrics"),
  TESTIMONIALS: createPlaceholderDefinition("TESTIMONIALS", "Testimonials", "Customer testimonials"),
  PRICING: createPlaceholderDefinition("PRICING", "Pricing", "Pricing tables or cards"),
  FAQ: createPlaceholderDefinition("FAQ", "FAQ", "Frequently asked questions"),
  FORM: formDefinition,
  SPACER: createPlaceholderDefinition("SPACER", "Spacer", "Vertical spacing element"),
  CODE: createPlaceholderDefinition("CODE", "Code", "Code snippet with syntax highlighting"),
  CUSTOM: createPlaceholderDefinition("CUSTOM", "Custom", "Custom HTML or component"),
};

// Helper to create placeholder definitions
function createPlaceholderDefinition(
  type: BlockType,
  label: string,
  description: string
): BlockTypeDefinition {
  return {
    type,
    label,
    description,
    defaultVariant: `${type.toLowerCase()}-default`,
    variants: [
      {
        id: `${type.toLowerCase()}-default`,
        type,
        name: `Default ${label}`,
        description: `Standard ${label.toLowerCase()} block`,
        fields: [
          {
            type: "text",
            name: "title",
            label: "Title",
            placeholder: `Enter ${label.toLowerCase()} title`,
          },
          {
            type: "textarea",
            name: "content",
            label: "Content",
            placeholder: `Enter ${label.toLowerCase()} content`,
          },
        ],
      },
    ],
  };
}

// ============================================================================
// Registry Access Functions
// ============================================================================

/**
 * Get all block type definitions
 */
export function getAllBlockTypes(): BlockTypeDefinition[] {
  return Object.values(BLOCK_VARIANT_REGISTRY);
}

/**
 * Get a specific block type definition
 */
export function getBlockType(type: BlockType): BlockTypeDefinition | null {
  return BLOCK_VARIANT_REGISTRY[type] ?? null;
}

/**
 * Get all variants for a block type
 */
export function getBlockVariants(type: BlockType): BlockVariantSchema[] {
  return BLOCK_VARIANT_REGISTRY[type]?.variants ?? [];
}

/**
 * Get a specific variant schema
 */
export function getVariantSchema(
  type: BlockType,
  variantId: string
): BlockVariantSchema | null {
  const blockType = BLOCK_VARIANT_REGISTRY[type];
  if (!blockType) return null;

  // Find the exact match first
  const exactMatch = blockType.variants.find((v) => v.id === variantId);
  if (exactMatch) return exactMatch;

  // If variantId is "default", return the default variant for this type
  if (variantId === "default") {
    return getDefaultVariant(type);
  }

  return null;
}

/**
 * Get the default variant for a block type
 */
export function getDefaultVariant(type: BlockType): BlockVariantSchema | null {
  const blockType = BLOCK_VARIANT_REGISTRY[type];
  if (!blockType) return null;

  return (
    blockType.variants.find((v) => v.id === blockType.defaultVariant) ??
    blockType.variants[0] ??
    null
  );
}

/**
 * Get variant by ID (searches all types)
 */
export function findVariantById(variantId: string): BlockVariantSchema | null {
  for (const type of BLOCK_TYPE_VALUES) {
    const variant = getVariantSchema(type, variantId);
    if (variant) return variant;
  }
  return null;
}

// ============================================================================
// Default Values & Content Helpers
// ============================================================================

const isRecord = (value: unknown): value is BlockContent => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * Build default value for a single field
 */
function buildDefaultForField(field: BlockSchemaField): unknown {
  switch (field.type) {
    case "text":
    case "textarea":
    case "image":
    case "url":
    case "number":
    case "color":
      return field.defaultValue ?? "";
    case "select":
      return field.defaultValue ?? field.options[0]?.value ?? "";
    case "switch":
      return field.defaultValue ?? false;
    case "list": {
      const minItems = field.minItems ?? 0;
      const defaults: BlockContent[] = [];
      for (let i = 0; i < minItems; i++) {
        defaults.push(buildDefaultsFromFields(field.fields));
      }
      return defaults;
    }
    default:
      return field.defaultValue ?? null;
  }
}

/**
 * Build default values from a field array
 */
export function buildDefaultsFromFields(
  fields: BlockSchemaField[]
): BlockContent {
  return fields.reduce((acc, field) => {
    acc[field.name] = buildDefaultForField(field);
    return acc;
  }, {} as BlockContent);
}

/**
 * Get default values for a variant
 */
export function getVariantDefaults(
  type: BlockType,
  variantId: string
): BlockContent {
  const schema = getVariantSchema(type, variantId);
  if (!schema) {
    // Return empty if variant not found
    return {};
  }
  return buildDefaultsFromFields(schema.fields);
}

/**
 * Create defaults for a new list item
 */
export function createListItemDefaults(field: BlockListField): BlockContent {
  return buildDefaultsFromFields(field.fields);
}

/**
 * Deep merge defaults with existing content
 */
function mergeDeep(defaults: unknown, actual: unknown): unknown {
  if (Array.isArray(defaults) && Array.isArray(actual)) {
    if (!actual.length) return defaults;

    return actual.map((item, index) => {
      const template = defaults[index] ?? defaults[0];
      if (isRecord(template) && isRecord(item)) {
        return mergeDeep(template, item);
      }
      return item;
    });
  }

  if (Array.isArray(defaults) && actual === undefined) {
    return defaults;
  }

  if (isRecord(defaults) && isRecord(actual)) {
    const result: BlockContent = { ...defaults };
    for (const key of Object.keys(actual)) {
      const defaultValue = result[key];
      const actualValue = actual[key];

      if (
        (Array.isArray(defaultValue) && Array.isArray(actualValue)) ||
        (isRecord(defaultValue) && isRecord(actualValue))
      ) {
        result[key] = mergeDeep(defaultValue, actualValue);
      } else {
        result[key] = actualValue ?? defaultValue;
      }
    }
    return result;
  }

  return actual === undefined ? defaults : actual;
}

/**
 * Merge variant defaults with existing content
 */
export function mergeVariantDefaults(
  type: BlockType,
  variantId: string,
  existing?: BlockContent | null
): BlockContent {
  const defaults = getVariantDefaults(type, variantId);
  if (!existing || !isRecord(existing)) {
    return defaults;
  }
  return mergeDeep(defaults, existing) as BlockContent;
}

/**
 * Serialize block content (deep clone)
 */
export function serializeBlockContent(value: BlockContent): BlockContent {
  return JSON.parse(JSON.stringify(value));
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if a variant ID is valid for a block type
 */
export function isValidVariant(type: BlockType, variantId: string): boolean {
  return getVariantSchema(type, variantId) !== null;
}

/**
 * Get the block type for a variant ID
 */
export function getTypeForVariant(variantId: string): BlockType | null {
  for (const type of BLOCK_TYPE_VALUES) {
    if (getVariantSchema(type, variantId)) {
      return type;
    }
  }
  return null;
}

// ============================================================================
// UI Helper Functions
// ============================================================================

/**
 * Get variant options for a select dropdown
 */
export function getVariantOptions(
  type: BlockType
): Array<{ value: string; label: string; description?: string }> {
  const variants = getBlockVariants(type);
  return variants.map((v) => ({
    value: v.id,
    label: v.name,
    description: v.description,
  }));
}

/**
 * Get block type options for a select dropdown
 */
export function getBlockTypeOptions(): Array<{
  value: BlockType;
  label: string;
  description?: string;
}> {
  return getAllBlockTypes().map((bt) => ({
    value: bt.type,
    label: bt.label,
    description: bt.description,
  }));
}
