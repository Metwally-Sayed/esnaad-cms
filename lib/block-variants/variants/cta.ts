import { BlockTypeDefinition, BlockVariantSchema } from "../types";

// CTA Variant 1: Hero Inline
const ctaHeroInline: BlockVariantSchema = {
  id: "cta-hero-inline",
  type: "CTA",
  name: "Hero Inline Link",
  description: "Minimal inline link with accent bar, perfect for hero sections",
  fields: [
    {
      type: "text",
      name: "label",
      label: "Link label",
      placeholder: "Show Apartment Video",
      required: true,
      defaultValue: "Show Apartment Video",
    },
    {
      type: "url",
      name: "href",
      label: "Link URL",
      placeholder: "#story",
      required: true,
      defaultValue: "#story",
    },
    {
      type: "select",
      name: "tone",
      label: "Color tone",
      defaultValue: "light",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
    {
      type: "number",
      name: "accentWidth",
      label: "Accent bar width (px)",
      defaultValue: 40,
    },
  ],
};

// CTA Variant 2: Glow Button
const ctaGlowButton: BlockVariantSchema = {
  id: "cta-glow-button",
  type: "CTA",
  name: "Glow Button",
  description: "Eye-catching button with glow effect",
  fields: [
    {
      type: "text",
      name: "label",
      label: "Button label",
      placeholder: "Download Brochure",
      required: true,
      defaultValue: "Download Brochure",
    },
    {
      type: "url",
      name: "href",
      label: "Link URL",
      placeholder: "/downloads/brochure.pdf",
      required: true,
      defaultValue: "/downloads/brochure.pdf",
    },
    {
      type: "text",
      name: "sublabel",
      label: "Sub-label",
      placeholder: "3 MB • PDF",
      defaultValue: "3 MB • PDF",
    },
    {
      type: "color",
      name: "glowColor",
      label: "Glow color",
      defaultValue: "#F2D4A1",
    },
  ],
};

// CTA Variant 3: Split Panel
const ctaSplitPanel: BlockVariantSchema = {
  id: "cta-split-panel",
  type: "CTA",
  name: "Split Panel",
  description: "Two-column CTA with primary and secondary actions",
  fields: [
    {
      type: "text",
      name: "heading",
      label: "Heading",
      placeholder: "Ready to partner?",
      required: true,
      defaultValue: "Ready to partner?",
    },
    {
      type: "textarea",
      name: "copy",
      label: "Body copy",
      placeholder: "Schedule a consultation with our development advisors.",
      defaultValue: "Schedule a consultation with our development advisors.",
    },
    {
      type: "text",
      name: "primaryLabel",
      label: "Primary button label",
      placeholder: "Book A Call",
      required: true,
      defaultValue: "Book A Call",
    },
    {
      type: "url",
      name: "primaryHref",
      label: "Primary button URL",
      placeholder: "/contact-us",
      required: true,
      defaultValue: "/contact-us",
    },
    {
      type: "text",
      name: "secondaryLabel",
      label: "Secondary button label",
      placeholder: "Download Deck",
      defaultValue: "Download Deck",
    },
    {
      type: "url",
      name: "secondaryHref",
      label: "Secondary button URL",
      placeholder: "/downloads/deck.pdf",
      defaultValue: "/downloads/company-deck.pdf",
    },
  ],
};

// CTA Variant 4: Banner
const ctaBanner: BlockVariantSchema = {
  id: "cta-banner",
  type: "CTA",
  name: "Full-width Banner",
  description: "Bold banner CTA that spans the full width",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Title",
      placeholder: "Ready to get started?",
      required: true,
      defaultValue: "Ready to get started?",
    },
    {
      type: "textarea",
      name: "description",
      label: "Description",
      placeholder: "Join thousands of satisfied customers.",
      defaultValue: "Join thousands of satisfied customers today.",
    },
    {
      type: "text",
      name: "buttonText",
      label: "Button text",
      placeholder: "Get Started",
      required: true,
      defaultValue: "Get Started",
    },
    {
      type: "url",
      name: "buttonHref",
      label: "Button URL",
      placeholder: "/signup",
      required: true,
      defaultValue: "/signup",
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background color",
      defaultValue: "#000000",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text color",
      defaultValue: "#ffffff",
    },
  ],
};

// CTA Variant 5: Card
const ctaCard: BlockVariantSchema = {
  id: "cta-card",
  type: "CTA",
  name: "Card CTA",
  description: "Contained card-style CTA with optional image",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Title",
      placeholder: "Need help?",
      required: true,
      defaultValue: "Need help?",
    },
    {
      type: "textarea",
      name: "description",
      label: "Description",
      placeholder: "Our team is here to assist you.",
      defaultValue: "Our team is here to assist you 24/7.",
    },
    {
      type: "image",
      name: "image",
      label: "Card image",
      placeholder: "/images/support.jpg",
    },
    {
      type: "list",
      name: "buttons",
      label: "Buttons",
      itemLabel: "Button",
      minItems: 1,
      maxItems: 2,
      fields: [
        {
          type: "text",
          name: "text",
          label: "Label",
          defaultValue: "Contact Support",
        },
        {
          type: "url",
          name: "href",
          label: "URL",
          defaultValue: "/contact",
        },
        {
          type: "select",
          name: "variant",
          label: "Style",
          defaultValue: "primary",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
      ],
    },
  ],
};

export const ctaDefinition: BlockTypeDefinition = {
  type: "CTA",
  label: "Call to Action",
  description: "Buttons and links to drive user action",
  icon: "🎯",
  defaultVariant: "cta-split-panel",
  variants: [
    ctaHeroInline,
    ctaGlowButton,
    ctaSplitPanel,
    ctaBanner,
    ctaCard,
  ],
};
