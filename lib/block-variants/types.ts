/**
 * Block Variant System - Type Definitions
 *
 * This module defines the type system for block variants, allowing each
 * block type to have multiple variants with their own unique schemas.
 */

// Base field types
export type BlockFieldBase = {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: unknown;
};

export type BlockTextField = BlockFieldBase & {
  type: "text" | "textarea" | "image" | "url" | "number" | "color";
};

export type BlockSelectField = BlockFieldBase & {
  type: "select";
  options: Array<{
    label: string;
    value: string;
  }>;
};

export type BlockSwitchField = BlockFieldBase & {
  type: "switch";
};

export type BlockCollectionSelectField = BlockFieldBase & {
  type: "collection-select";
};

export type BlockListField = BlockFieldBase & {
  type: "list";
  itemLabel?: string;
  minItems?: number;
  maxItems?: number;
  fields: BlockSchemaField[];
};

export type BlockSchemaField =
  | BlockTextField
  | BlockSelectField
  | BlockSwitchField
  | BlockListField
  | BlockCollectionSelectField;

// Block type enum values
export const BLOCK_TYPE_VALUES = [
  "HERO",
  "TEXT",
  "IMAGE",
  "GALLERY",
  "VIDEO",
  "CTA",
  "HIGHLIGHTS",
  "TESTIMONIALS",
  "FEATURES",
  "PRICING",
  "FAQ",
  "FORM",
  "SPACER",
  "CODE",
  "CUSTOM",
  "ABOUT",
] as const;

export type BlockType = (typeof BLOCK_TYPE_VALUES)[number];

// Variant definition
export interface BlockVariantSchema {
  id: string; // Unique identifier like "hero-centered", "hero-split"
  type: BlockType;
  name: string; // Display name like "Centered Hero"
  description?: string;
  thumbnail?: string; // Preview image URL
  fields: BlockSchemaField[];
}

// Block type definition with its variants
export interface BlockTypeDefinition {
  type: BlockType;
  label: string;
  description?: string;
  icon?: string;
  variants: BlockVariantSchema[];
  defaultVariant: string;
}

// Content type
export type BlockContent = Record<string, unknown>;

// Registry type
export type BlockVariantRegistry = Record<BlockType, BlockTypeDefinition>;
