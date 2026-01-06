import { BlockTypeDefinition, BlockVariantSchema } from "../types";

// Hero Variant 0: Advanced (Legacy Full-Featured)
const heroAdvanced: BlockVariantSchema = {
  id: "hero-advanced",
  type: "HERO",
  name: "Advanced Hero",
  description: "Full-featured hero with video/image, CTAs, highlights, and rotating headlines",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Primary headline",
      placeholder: "Experience Esnaad",
      required: true,
      defaultValue: "Experience Esnaad",
    },
    {
      type: "textarea",
      name: "subtitle",
      label: "Subheadline / Description",
      placeholder: "Explain what makes this page special.",
      defaultValue: "Build modern experiences with our CMS foundation.",
    },
    {
      type: "select",
      name: "mediaType",
      label: "Hero media type",
      description: "Choose between a looping video or a static image.",
      defaultValue: "video",
      options: [
        { label: "Video", value: "video" },
        { label: "Image", value: "image" },
      ],
    },
    {
      type: "media",
      name: "mediaUrl",
      label: "Video URL or image path",
      placeholder: "https://cdn.coverr.co/video.mp4 or /images/hero.jpg",
      defaultValue: "https://cdn.coverr.co/videos/coverr-contemporary-interior-o2152/1080p.mp4",
    },
    {
      type: "image",
      name: "posterImage",
      label: "Poster / fallback image",
      placeholder: "/images/hero-poster.jpg",
    },
    {
      type: "text",
      name: "location",
      label: "Location label",
      placeholder: "ABU DHABI, UAE",
    },
    {
      type: "list",
      name: "headlines",
      label: "Additional headlines",
      itemLabel: "Headline",
      description: "Add supporting lines that display as rotating headlines.",
      fields: [
        {
          type: "text",
          name: "text",
          label: "Headline copy",
          placeholder: "Engineered for growth",
        },
      ],
    },
    {
      type: "list",
      name: "ctas",
      label: "Calls to action",
      itemLabel: "CTA",
      fields: [
        {
          type: "text",
          name: "text",
          label: "CTA label",
          defaultValue: "Get started",
        },
        {
          type: "text",
          name: "link",
          label: "CTA link",
          defaultValue: "/contact",
        },
        {
          type: "select",
          name: "variant",
          label: "Variant",
          defaultValue: "primary",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Ghost", value: "ghost" },
          ],
        },
      ],
    },
    {
      type: "list",
      name: "highlights",
      label: "Hero highlights",
      itemLabel: "Highlight",
      description: "Optional stat row beneath the hero copy.",
      fields: [
        {
          type: "text",
          name: "label",
          label: "Label",
          placeholder: "DEVELOPMENTS",
        },
        {
          type: "text",
          name: "value",
          label: "Value",
          placeholder: "30+",
        },
      ],
    },
    {
      type: "text",
      name: "contactLabel",
      label: "Contact / caption text",
      placeholder: "WHATSAPP +971 55 555 5555",
    },
  ],
};

// Hero Variant 1: Centered with Video Background
const heroCenteredVideo: BlockVariantSchema = {
  id: "hero-centered-video",
  type: "HERO",
  name: "Centered with Video",
  description: "Full-width hero with centered text and video background",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Primary headline",
      placeholder: "Experience Esnaad",
      required: true,
      defaultValue: "Experience Esnaad",
    },
    {
      type: "textarea",
      name: "subtitle",
      label: "Subheadline",
      placeholder: "Explain what makes this page special.",
      defaultValue: "Build modern experiences with our CMS foundation.",
    },
    {
      type: "video",
      name: "videoUrl",
      label: "Video URL",
      placeholder: "https://cdn.coverr.co/video.mp4",
      required: true,
      defaultValue: "https://cdn.coverr.co/videos/coverr-contemporary-interior-o2152/1080p.mp4",
    },
    {
      type: "image",
      name: "posterImage",
      label: "Poster / fallback image",
      placeholder: "/images/hero-poster.jpg",
    },
    {
      type: "list",
      name: "ctas",
      label: "Calls to action",
      itemLabel: "CTA",
      maxItems: 3,
      fields: [
        {
          type: "text",
          name: "text",
          label: "CTA label",
          defaultValue: "Get started",
        },
        {
          type: "text",
          name: "link",
          label: "CTA link",
          defaultValue: "/contact",
        },
        {
          type: "select",
          name: "variant",
          label: "Variant",
          defaultValue: "primary",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Ghost", value: "ghost" },
          ],
        },
      ],
    },
  ],
};

// Hero Variant 2: Split with Image
const heroSplitImage: BlockVariantSchema = {
  id: "hero-split-image",
  type: "HERO",
  name: "Split with Image",
  description: "Two-column hero with text on one side and image on the other",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Primary headline",
      placeholder: "Your headline here",
      required: true,
      defaultValue: "Transform Your Business",
    },
    {
      type: "textarea",
      name: "subtitle",
      label: "Subheadline",
      placeholder: "Supporting text",
      defaultValue: "Discover how our solutions can help you grow.",
    },
    {
      type: "image",
      name: "image",
      label: "Hero image",
      placeholder: "/images/hero.jpg",
      required: true,
    },
    {
      type: "text",
      name: "imageAlt",
      label: "Image alt text",
      placeholder: "Describe the image",
    },
    {
      type: "select",
      name: "imagePosition",
      label: "Image position",
      defaultValue: "right",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    {
      type: "list",
      name: "ctas",
      label: "Calls to action",
      itemLabel: "CTA",
      maxItems: 2,
      fields: [
        {
          type: "text",
          name: "text",
          label: "CTA label",
          defaultValue: "Learn more",
        },
        {
          type: "text",
          name: "link",
          label: "CTA link",
          defaultValue: "/about",
        },
        {
          type: "select",
          name: "variant",
          label: "Variant",
          defaultValue: "primary",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      ],
    },
  ],
};

// Hero Variant 3: Minimal Text Only
const heroMinimalText: BlockVariantSchema = {
  id: "hero-minimal-text",
  type: "HERO",
  name: "Minimal Text",
  description: "Clean, text-focused hero with no media",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Primary headline",
      placeholder: "Your headline",
      required: true,
      defaultValue: "Simple. Powerful. Effective.",
    },
    {
      type: "textarea",
      name: "subtitle",
      label: "Subheadline",
      placeholder: "A brief description",
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
    {
      type: "select",
      name: "textAlign",
      label: "Text alignment",
      defaultValue: "center",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  ],
};

// Hero Variant 4: Gallery Hero
const heroGallery: BlockVariantSchema = {
  id: "hero-gallery",
  type: "HERO",
  name: "Gallery Hero",
  description: "Hero with rotating image gallery or grid",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Primary headline",
      placeholder: "Your headline",
      required: true,
      defaultValue: "Our Portfolio",
    },
    {
      type: "textarea",
      name: "subtitle",
      label: "Subheadline",
      placeholder: "Brief description",
    },
    {
      type: "list",
      name: "gallery",
      label: "Gallery images",
      itemLabel: "Image",
      minItems: 3,
      maxItems: 8,
      fields: [
        {
          type: "image",
          name: "url",
          label: "Image URL",
          placeholder: "/images/gallery-1.jpg",
          required: true,
        },
        {
          type: "text",
          name: "alt",
          label: "Alt text",
          placeholder: "Describe the image",
        },
        {
          type: "text",
          name: "caption",
          label: "Caption",
          placeholder: "Optional caption",
        },
      ],
    },
    {
      type: "select",
      name: "layout",
      label: "Gallery layout",
      defaultValue: "grid",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Carousel", value: "carousel" },
        { label: "Masonry", value: "masonry" },
      ],
    },
  ],
};

// Hero Variant 5: Stats Hero
const heroStats: BlockVariantSchema = {
  id: "hero-stats",
  type: "HERO",
  name: "Stats Hero",
  description: "Hero with prominent statistics or metrics",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Primary headline",
      placeholder: "Your headline",
      required: true,
      defaultValue: "Our Impact",
    },
    {
      type: "textarea",
      name: "subtitle",
      label: "Subheadline",
      placeholder: "Brief description",
    },
    {
      type: "image",
      name: "backgroundImage",
      label: "Background image",
      placeholder: "/images/bg.jpg",
    },
    {
      type: "list",
      name: "stats",
      label: "Statistics",
      itemLabel: "Stat",
      minItems: 2,
      maxItems: 4,
      fields: [
        {
          type: "text",
          name: "value",
          label: "Value",
          placeholder: "100+",
          required: true,
        },
        {
          type: "text",
          name: "label",
          label: "Label",
          placeholder: "Projects Completed",
          required: true,
        },
        {
          type: "text",
          name: "suffix",
          label: "Suffix",
          placeholder: "+",
        },
      ],
    },
    {
      type: "text",
      name: "contactLabel",
      label: "Contact / caption text",
      placeholder: "WHATSAPP +971 55 555 5555",
    },
  ],
};

const heroTitleOnly: BlockVariantSchema = {
  id: "hero-title-only",
  type: "HERO",
  name: "Title Only",
  description: "Centered title hero with optional background color",
  fields: [
    {
      type: "text",
      name: "title",
      label: "Title",
      required: true,
      defaultValue: "ABOUT ESNAAD",
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#f8f6f4",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#111111",
    },
  ],
};

const heroImageOnly: BlockVariantSchema = {
  id: "hero-image-only",
  type: "HERO",
  name: "Image Only",
  description: "Full-bleed hero with a single background image",
  fields: [
    {
      type: "image",
      name: "image",
      label: "Background Image",
      placeholder: "/images/hero.jpg",
      required: true,
    },
    {
      type: "text",
      name: "imageAlt",
      label: "Image Alt Text",
    },
    {
      type: "number",
      name: "minHeight",
      label: "Minimum Height (px)",
      defaultValue: 520,
    },
  ],
};

const heroVideoPoster: BlockVariantSchema = {
  id: "hero-video-poster",
  type: "HERO",
  name: "Video Poster",
  description: "Wide poster with play overlay and title",
  fields: [
    {
      type: "image",
      name: "image",
      label: "Poster Image",
      placeholder: "/images/video.jpg",
      required: true,
    },
    {
      type: "text",
      name: "imageAlt",
      label: "Poster Alt Text",
    },
    {
      type: "text",
      name: "title",
      label: "Title",
      defaultValue: "BUILDING VIDEO",
    },
    {
      type: "url",
      name: "videoUrl",
      label: "Video URL",
      placeholder: "https://example.com/video.mp4",
    },
    {
      type: "number",
      name: "minHeight",
      label: "Minimum Height (px)",
      defaultValue: 440,
    },
  ],
};

export const heroDefinition: BlockTypeDefinition = {
  type: "HERO",
  label: "Hero",
  description: "Large first impression area with various layout options",
  icon: "🎯",
  defaultVariant: "hero-advanced",
  variants: [
    heroAdvanced,
    heroCenteredVideo,
    heroSplitImage,
    heroMinimalText,
    heroGallery,
    heroStats,
    heroTitleOnly,
    heroImageOnly,
    heroVideoPoster,
  ],
};
