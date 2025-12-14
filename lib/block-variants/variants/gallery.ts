import { BlockTypeDefinition, BlockVariantSchema } from "../types";

// Gallery Variant 1: Media Hero
const mediaHero: BlockVariantSchema = {
  id: "media-hero",
  type: "GALLERY",
  name: "Media Hero",
  description: "Simple hero section with title and subtitle for media pages",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Title",
      placeholder: "MEDIA CENTER",
      required: true,
      defaultValue: "MEDIA CENTER",
    },
    {
      type: "text",
      name: "subtitle",
      label: "Subtitle",
      placeholder: "WHAT THEY SAY ABOUT US",
      defaultValue: "WHAT THEY SAY ABOUT US",
    },
  ],
};

// Gallery Variant 2: Media Grid
const mediaGrid: BlockVariantSchema = {
  id: "media-grid",
  type: "GALLERY",
  name: "Media Categories Grid",
  description: "3-column grid displaying media categories from collection",
  fields: [
    {
      type: "collection-select",
      name: "collectionId",
      label: "Media Collection",
      description: "Select the collection to display items from",
      required: false,
    },
    {
      type: "select",
      name: "filterType",
      label: "Filter by Type",
      description: "Filter media items by their type field (leave empty to show all)",
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
      type: "list",
      name: "items",
      label: "Static Grid Items",
      description: "Optional: Add static items if not using a collection",
      itemLabel: "Grid Item",
      minItems: 0,
      maxItems: 6,
      fields: [
        {
          type: "image",
          name: "image",
          label: "Image URL",
          placeholder: "https://images.unsplash.com/...",
          required: true,
        },
        {
          type: "text",
          name: "label",
          label: "Label",
          placeholder: "UPDATES",
          required: true,
        },
        {
          type: "text",
          name: "link",
          label: "Link",
          placeholder: "#updates",
          defaultValue: "#",
        },
      ],
    },
  ],
};

// Gallery Variant 3: Industry Update
const industryUpdate: BlockVariantSchema = {
  id: "industry-update",
  type: "GALLERY",
  name: "Industry Updates",
  description: "Display news articles or industry updates from collection",
  fields: [
    {
      type: "text",
      name: "sectionTitle",
      label: "Section Title",
      placeholder: "INDUSTRY UPDATE",
      defaultValue: "INDUSTRY UPDATE",
    },
    {
      type: "collection-select",
      name: "collectionId",
      label: "Media Collection",
      description: "Select the collection to display items from",
      required: false,
    },
    {
      type: "select",
      name: "filterType",
      label: "Filter by Type",
      description: "Filter media items by their type field (leave empty to show all)",
      required: false,
      options: [
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
      type: "list",
      name: "items",
      label: "Static Update Items",
      description: "Optional: Add static items if not using a collection",
      itemLabel: "Update Item",
      minItems: 0,
      maxItems: 6,
      fields: [
        {
          type: "image",
          name: "image",
          label: "Image URL",
          placeholder: "https://images.unsplash.com/...",
          required: true,
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          placeholder: "Article Title",
          required: true,
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          placeholder: "Brief description of the article",
        },
        {
          type: "text",
          name: "link",
          label: "Link",
          placeholder: "#article",
          defaultValue: "#",
        },
      ],
    },
  ],
};

// Export the Gallery block type definition
export const galleryDefinition: BlockTypeDefinition = {
  type: "GALLERY",
  label: "Gallery",
  description: "Media galleries, grids, and update sections",
  defaultVariant: "media-grid",
  variants: [mediaHero, mediaGrid, industryUpdate],
};
