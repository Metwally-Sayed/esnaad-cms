import { BlockTypeDefinition, BlockVariantSchema } from "../types";

// MEDIA_CARDS Variant: Standard Cards
const standardCards: BlockVariantSchema = {
  id: "media-cards-standard",
  type: "MEDIA_CARDS",
  name: "Standard Media Cards",
  description: "Display media items in a standard grid layout",
  fields: [
    {
      type: "collection-select",
      name: "collectionId",
      label: "Media Collection",
      description: "Select the media collection to display",
      required: false,
    },
    {
      type: "select",
      name: "imageStyle",
      label: "Image Style",
      description: "Choose how images are displayed in cards",
      required: false,
      options: [
        { label: "Landscape (16:10)", value: "landscape" },
        { label: "Wide (16:9)", value: "wide" },
        { label: "Square (1:1)", value: "square" },
        { label: "Portrait (4:5)", value: "portrait" },
        { label: "Tall Portrait (3:4)", value: "tall" },
      ],
      defaultValue: "landscape",
    },
    {
      type: "select",
      name: "filterType",
      label: "Filter by Type",
      description: "Filter media items by their type field",
      required: false,
      options: [
        { label: "Categories", value: "category" },
        { label: "Articles", value: "article" },
        { label: "Press", value: "press" },
        { label: "News", value: "news" },
        { label: "Updates", value: "updates" },
        { label: "Insights", value: "insights" },
      ],
    },
    {
      type: "select",
      name: "sortBy",
      label: "Sort Order",
      description: "How to sort the media items",
      required: false,
      options: [
        { label: "Last Updated (newest first)", value: "updatedAt" },
        { label: "Recently Created (newest first)", value: "createdAt" },
        { label: "Custom Order", value: "order" },
      ],
      defaultValue: "updatedAt",
    },
    {
      type: "number",
      name: "limit",
      label: "Limit",
      description: "Maximum number of items to display (0 = no limit)",
      placeholder: "6",
      defaultValue: 0,
    },
    {
      type: "switch",
      name: "showFilters",
      label: "Show Filters",
      description: "Display filter buttons for media types",
      defaultValue: true,
    },
  ],
};

// MEDIA_CARDS Variant: 3D Cards
const cards3d: BlockVariantSchema = {
  id: "media-cards-3d",
  type: "MEDIA_CARDS",
  name: "3D Media Cards",
  description: "Display media items with interactive 3D card effects",
  fields: [
    {
      type: "collection-select",
      name: "collectionId",
      label: "Media Collection",
      description: "Select the media collection to display",
      required: false,
    },
    {
      type: "select",
      name: "imageStyle",
      label: "Image Style",
      description: "Choose how images are displayed in cards",
      required: false,
      options: [
        { label: "Landscape (16:10)", value: "landscape" },
        { label: "Wide (16:9)", value: "wide" },
        { label: "Square (1:1)", value: "square" },
        { label: "Portrait (4:5)", value: "portrait" },
        { label: "Tall Portrait (3:4)", value: "tall" },
      ],
      defaultValue: "wide",
    },
    {
      type: "select",
      name: "filterType",
      label: "Filter by Type",
      description: "Filter media items by their type field",
      required: false,
      options: [
        { label: "Categories", value: "category" },
        { label: "Articles", value: "article" },
        { label: "Press", value: "press" },
        { label: "News", value: "news" },
        { label: "Updates", value: "updates" },
        { label: "Insights", value: "insights" },
      ],
    },
    {
      type: "select",
      name: "sortBy",
      label: "Sort Order",
      description: "How to sort the media items",
      required: false,
      options: [
        { label: "Last Updated (newest first)", value: "updatedAt" },
        { label: "Recently Created (newest first)", value: "createdAt" },
        { label: "Custom Order", value: "order" },
      ],
      defaultValue: "updatedAt",
    },
    {
      type: "number",
      name: "limit",
      label: "Limit",
      description: "Maximum number of items to display (0 = no limit)",
      placeholder: "6",
      defaultValue: 0,
    },
    {
      type: "switch",
      name: "showFilters",
      label: "Show Filters",
      description: "Display filter buttons for media types",
      defaultValue: true,
    },
  ],
};

// Export the MEDIA_CARDS block type definition
export const mediaCardsDefinition: BlockTypeDefinition = {
  type: "MEDIA_CARDS",
  label: "Media Cards",
  description: "Display media items from a collection with different card styles",
  defaultVariant: "media-cards-standard",
  variants: [standardCards, cards3d],
};
