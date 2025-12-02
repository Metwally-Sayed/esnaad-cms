import { BlockTypeDefinition, BlockVariantSchema } from "../types";

// Features Variant 1: Grid Cards
const featuresGrid: BlockVariantSchema = {
  id: "features-grid",
  type: "FEATURES",
  name: "Grid Cards",
  description: "Multi-column grid of feature cards with icons",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Section title",
      placeholder: "Why choose us",
      required: true,
      defaultValue: "Why Choose Esnaad",
    },
    {
      type: "textarea",
      name: "description",
      label: "Section description",
      placeholder: "Brief overview",
      defaultValue: "Stack reusable building blocks to compose complete experiences faster.",
    },
    {
      type: "select",
      name: "columns",
      label: "Number of columns",
      defaultValue: "3",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    },
    {
      type: "list",
      name: "features",
      label: "Feature cards",
      itemLabel: "Feature",
      minItems: 3,
      fields: [
        {
          type: "text",
          name: "icon",
          label: "Icon (emoji or icon name)",
          defaultValue: "⚡",
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          placeholder: "Fast Performance",
          required: true,
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          placeholder: "Explain the value",
        },
      ],
    },
  ],
};

// Features Variant 2: List with Icons
const featuresList: BlockVariantSchema = {
  id: "features-list",
  type: "FEATURES",
  name: "Vertical List",
  description: "Vertical list of features with checkmarks or icons",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Section title",
      placeholder: "What's included",
      required: true,
      defaultValue: "What's Included",
    },
    {
      type: "textarea",
      name: "description",
      label: "Section description",
      placeholder: "Brief overview",
    },
    {
      type: "select",
      name: "iconType",
      label: "Icon style",
      defaultValue: "check",
      options: [
        { label: "Checkmark", value: "check" },
        { label: "Arrow", value: "arrow" },
        { label: "Bullet", value: "bullet" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      type: "list",
      name: "items",
      label: "List items",
      itemLabel: "Item",
      minItems: 3,
      fields: [
        {
          type: "text",
          name: "text",
          label: "Feature text",
          placeholder: "Unlimited storage",
          required: true,
        },
        {
          type: "text",
          name: "icon",
          label: "Custom icon (optional)",
          placeholder: "✓",
        },
      ],
    },
  ],
};

// Features Variant 3: Alternating
const featuresAlternating: BlockVariantSchema = {
  id: "features-alternating",
  type: "FEATURES",
  name: "Alternating Rows",
  description: "Features with alternating image/text layout",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Section title",
      placeholder: "Our Features",
      defaultValue: "Our Features",
    },
    {
      type: "list",
      name: "features",
      label: "Feature rows",
      itemLabel: "Feature",
      minItems: 2,
      fields: [
        {
          type: "text",
          name: "title",
          label: "Title",
          placeholder: "Feature name",
          required: true,
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          placeholder: "Detailed explanation",
          required: true,
        },
        {
          type: "image",
          name: "image",
          label: "Image",
          placeholder: "/images/feature.jpg",
          required: true,
        },
        {
          type: "text",
          name: "imageAlt",
          label: "Image alt text",
          placeholder: "Describe the image",
        },
      ],
    },
  ],
};

// Features Variant 4: Comparison Table
const featuresComparison: BlockVariantSchema = {
  id: "features-comparison",
  type: "FEATURES",
  name: "Comparison Table",
  description: "Side-by-side feature comparison",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Section title",
      placeholder: "Compare Plans",
      required: true,
      defaultValue: "Compare Plans",
    },
    {
      type: "list",
      name: "plans",
      label: "Plans to compare",
      itemLabel: "Plan",
      minItems: 2,
      maxItems: 4,
      fields: [
        {
          type: "text",
          name: "name",
          label: "Plan name",
          placeholder: "Basic",
          required: true,
        },
        {
          type: "switch",
          name: "highlighted",
          label: "Highlight this plan",
          defaultValue: false,
        },
      ],
    },
    {
      type: "list",
      name: "features",
      label: "Feature rows",
      itemLabel: "Feature",
      minItems: 3,
      fields: [
        {
          type: "text",
          name: "name",
          label: "Feature name",
          placeholder: "Storage",
          required: true,
        },
        {
          type: "list",
          name: "values",
          label: "Values per plan",
          itemLabel: "Value",
          fields: [
            {
              type: "text",
              name: "value",
              label: "Value",
              placeholder: "10GB or ✓",
            },
          ],
        },
      ],
    },
  ],
};

// Features Variant 5: Icon Boxes
const featuresIconBoxes: BlockVariantSchema = {
  id: "features-icon-boxes",
  type: "FEATURES",
  name: "Icon Boxes",
  description: "Boxed features with large icons and hover effects",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Section title",
      placeholder: "Our Services",
      required: true,
      defaultValue: "Our Services",
    },
    {
      type: "textarea",
      name: "description",
      label: "Section description",
    },
    {
      type: "select",
      name: "style",
      label: "Box style",
      defaultValue: "bordered",
      options: [
        { label: "Bordered", value: "bordered" },
        { label: "Filled", value: "filled" },
        { label: "Minimal", value: "minimal" },
      ],
    },
    {
      type: "list",
      name: "boxes",
      label: "Feature boxes",
      itemLabel: "Box",
      minItems: 3,
      maxItems: 6,
      fields: [
        {
          type: "text",
          name: "icon",
          label: "Icon",
          placeholder: "🚀",
          required: true,
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          placeholder: "Service name",
          required: true,
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          placeholder: "Brief description",
        },
        {
          type: "url",
          name: "link",
          label: "Link URL",
          placeholder: "/services/service-name",
        },
      ],
    },
  ],
};

const featuresProjectCards: BlockVariantSchema = {
  id: "project-cards",
  type: "FEATURES",
  name: "Project Cards",
  description: "Three-up image cards pulled from a collection with overlay titles",
  fields: [
    {
      type: "text",
      name: "sectionTitle",
      label: "Section Title",
      defaultValue: "OUR PROJECTS",
    },
    {
      type: "collection-select",
      name: "collectionId",
      label: "Projects Collection",
      description: "Choose the collection that holds project image items.",
      required: true,
    },
  ],
};

export const featuresDefinition: BlockTypeDefinition = {
  type: "FEATURES",
  label: "Features",
  description: "Showcase product or service features",
  icon: "✨",
  defaultVariant: "features-grid",
  variants: [
    featuresGrid,
    featuresList,
    featuresAlternating,
    featuresComparison,
    featuresIconBoxes,
    featuresProjectCards,
  ],
};
