import { BlockTypeDefinition, BlockVariantSchema } from "../types";

// About Variant 1: Story Section (matching the screenshot)
const aboutStory: BlockVariantSchema = {
  id: "about-story",
  type: "ABOUT",
  name: "Company Story",
  description: "Split layout with image and multiple text paragraphs",
  fields: [
    {
      type: "text",
      name: "sectionTitle",
      label: "Section Title",
      placeholder: "ABOUT COMPANY",
      defaultValue: "ABOUT COMPANY",
    },
    {
      type: "text",
      name: "subtitle",
      label: "Subtitle",
      placeholder: "OUR STORY",
      defaultValue: "OUR STORY",
    },
    {
      type: "image",
      name: "image",
      label: "Image",
      placeholder: "/images/about.jpg",
      required: true,
    },
    {
      type: "text",
      name: "imageAlt",
      label: "Image Alt Text",
      placeholder: "Company building",
      defaultValue: "Company building",
    },
    {
      type: "list",
      name: "paragraphs",
      label: "Content Paragraphs",
      itemLabel: "Paragraph",
      minItems: 1,
      fields: [
        {
          type: "textarea",
          name: "text",
          label: "Paragraph Text",
          placeholder: "Enter paragraph content...",
        },
      ],
    },
    {
      type: "switch",
      name: "customColors",
      label: "Custom Colors",
      description: "Enable to override theme colors",
      defaultValue: false,
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#f5f5f0",
    },
    {
      type: "color",
      name: "titleColor",
      label: "Title Color",
      defaultValue: "#1a1a1a",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#2d2d2d",
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#f8f6f4",
    },
  ],
};

// About Variant 2: Team Section
const aboutTeam: BlockVariantSchema = {
  id: "about-team",
  type: "ABOUT",
  name: "Team Section",
  description: "Display team members with photos and bios",
  fields: [
    {
      type: "text",
      name: "sectionTitle",
      label: "Section Title",
      defaultValue: "OUR TEAM",
    },
    {
      type: "text",
      name: "subtitle",
      label: "Subtitle",
      defaultValue: "Meet the experts",
    },
    {
      type: "textarea",
      name: "description",
      label: "Section Description",
    },
    {
      type: "list",
      name: "members",
      label: "Team Members",
      itemLabel: "Member",
      minItems: 1,
      fields: [
        {
          type: "text",
          name: "name",
          label: "Name",
          required: true,
        },
        {
          type: "text",
          name: "role",
          label: "Role/Title",
        },
        {
          type: "image",
          name: "photo",
          label: "Photo",
        },
        {
          type: "textarea",
          name: "bio",
          label: "Bio",
        },
      ],
    },
    {
      type: "switch",
      name: "customColors",
      label: "Custom Colors",
      description: "Enable to override theme colors",
      defaultValue: false,
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#ffffff",
    },
    {
      type: "color",
      name: "titleColor",
      label: "Title Color",
      defaultValue: "#000000",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#4a4a4a",
    },
  ],
};

// About Variant 3: Mission/Vision
const aboutMission: BlockVariantSchema = {
  id: "about-mission",
  type: "ABOUT",
  name: "Mission & Vision",
  description: "Display company mission and vision statements",
  fields: [
    {
      type: "text",
      name: "sectionTitle",
      label: "Section Title",
      defaultValue: "OUR PURPOSE",
    },
    {
      type: "text",
      name: "missionTitle",
      label: "Mission Title",
      defaultValue: "Our Mission",
    },
    {
      type: "textarea",
      name: "missionText",
      label: "Mission Statement",
    },
    {
      type: "text",
      name: "visionTitle",
      label: "Vision Title",
      defaultValue: "Our Vision",
    },
    {
      type: "textarea",
      name: "visionText",
      label: "Vision Statement",
    },
    {
      type: "image",
      name: "backgroundImage",
      label: "Background Image (optional)",
    },
    {
      type: "switch",
      name: "customColors",
      label: "Custom Colors",
      description: "Enable to override theme colors",
      defaultValue: false,
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#ffffff",
    },
    {
      type: "color",
      name: "titleColor",
      label: "Title Color",
      defaultValue: "#000000",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#4a4a4a",
    },
  ],
};

// About Variant 4: Philosophy (Dynamic Collection)
const aboutPhilosophy: BlockVariantSchema = {
  id: "about-philosophy",
  type: "ABOUT",
  name: "Philosophy Section",
  description: "Dynamic philosophy section powered by Collections",
  fields: [
    {
      type: "text",
      name: "sectionTitle",
      label: "Section Title",
      defaultValue: "ESNAAD PHILOSOPHY",
    },
    {
      type: "text",
      name: "subtitle",
      label: "Subtitle",
      defaultValue: "WHAT WE STAND FOR",
    },
    {
      type: "textarea",
      name: "description",
      label: "Description",
      placeholder:
        "Add a supporting line beneath the subtitle to introduce the collection.",
    },
    {
      type: "select",
      name: "itemTextAlign",
      label: "Item Text Alignment (when no descriptions)",
      defaultValue: "center",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    {
      type: "collection-select",
      name: "collectionId",
      label: "Collection",
      description: "Select the collection to display (e.g., Philosophy Items)",
      required: true,
    },
    {
      type: "switch",
      name: "customColors",
      label: "Custom Colors",
      description: "Enable to override theme colors",
      defaultValue: false,
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#ffffff",
    },
    {
      type: "color",
      name: "titleColor",
      label: "Title Color",
      defaultValue: "#000000",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#4a4a4a",
    },
  ],
};

const aboutEssay: BlockVariantSchema = {
  id: "about-essay",
  type: "ABOUT",
  name: "Essay with Image",
  description: "Two-column layout with rich text next to a visual",
  fields: [
    {
      type: "list",
      name: "paragraphs",
      label: "Paragraphs",
      itemLabel: "Paragraph",
      minItems: 2,
      fields: [
        {
          type: "textarea",
          name: "text",
          label: "Paragraph text",
        },
      ],
    },
    {
      type: "image",
      name: "image",
      label: "Image",
      placeholder: "/images/about.jpg",
    },
    {
      type: "text",
      name: "imageAlt",
      label: "Image Alt Text",
    },
    {
      type: "switch",
      name: "customColors",
      label: "Custom Colors",
      description: "Enable to override theme colors",
      defaultValue: false,
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#ffffff",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#111111",
    },
  ],
};

const aboutVision: BlockVariantSchema = {
  id: "about-vision",
  type: "ABOUT",
  name: "Vision Split",
  description: "Centered heading with image and narrative split layout",
  fields: [
    {
      type: "text",
      name: "heading",
      label: "Heading",
      defaultValue: "A TEAM OF INNOVATORS AND BUILDERS PIONEERING PROGRESSIVE FORMS OF LARGE-SCALE URBAN DEVELOPMENT",
    },
    {
      type: "image",
      name: "image",
      label: "Image",
      placeholder: "/images/vision.jpg",
    },
    {
      type: "text",
      name: "imageAlt",
      label: "Image Alt Text",
    },
    {
      type: "list",
      name: "paragraphs",
      label: "Paragraphs",
      itemLabel: "Paragraph",
      minItems: 2,
      fields: [
        {
          type: "textarea",
          name: "text",
          label: "Paragraph text",
        },
      ],
    },
    {
      type: "switch",
      name: "customColors",
      label: "Custom Colors",
      description: "Enable to override theme colors",
      defaultValue: false,
    },
    {
      type: "color",
      name: "backgroundColor",
      label: "Background Color",
      defaultValue: "#f8f6f4",
    },
    {
      type: "color",
      name: "titleColor",
      label: "Title Color",
      defaultValue: "#1a1a1a",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#2d2d2d",
    },
  ],
};

const aboutVisionStatement: BlockVariantSchema = {
  id: "about-vision-statement",
  type: "ABOUT",
  name: "Vision Statement",
  description: "Centered heading/subheading with stacked narrative and portrait",
  fields: [
    {
      type: "text",
      name: "heading",
      label: "Heading",
      defaultValue: "A VISION SHAPED BY DESIGN",
    },
    {
      type: "text",
      name: "subheading",
      label: "Subheading",
      defaultValue: "INSPIRED BY PEOPLE",
    },
    {
      type: "list",
      name: "paragraphs",
      label: "Intro Paragraphs",
      itemLabel: "Paragraph",
      minItems: 3,
      fields: [
        {
          type: "textarea",
          name: "text",
          label: "Paragraph text",
        },
      ],
    },
    {
      type: "image",
      name: "portraitImage",
      label: "Portrait Image (optional)",
    },
    {
      type: "text",
      name: "portraitAlt",
      label: "Portrait Alt",
    },
    {
      type: "text",
      name: "founderHeading",
      label: "Founder Heading",
      defaultValue: "A MESSAGE FROM OUR FOUNDER",
    },
    {
      type: "list",
      name: "founderParagraphs",
      label: "Founder Paragraphs",
      itemLabel: "Paragraph",
      minItems: 3,
      fields: [
        {
          type: "textarea",
          name: "text",
          label: "Paragraph text",
        },
      ],
    },
    {
      type: "switch",
      name: "customColors",
      label: "Custom Colors",
      description: "Enable to override theme colors",
      defaultValue: false,
    },
    {
      type: "color",
      name: "topBackgroundColor",
      label: "Top Background Color",
      defaultValue: "#ffffff",
    },
    {
      type: "color",
      name: "bottomBackgroundColor",
      label: "Bottom Background Color",
      defaultValue: "#f4f2ef",
    },
    {
      type: "color",
      name: "titleColor",
      label: "Title Color",
      defaultValue: "#111111",
    },
    {
      type: "color",
      name: "subtitleColor",
      label: "Subtitle Color",
      defaultValue: "#666666",
    },
    {
      type: "color",
      name: "textColor",
      label: "Text Color",
      defaultValue: "#111111",
    },
  ],
};

export const aboutDefinition: BlockTypeDefinition = {
  type: "ABOUT",
  label: "About",
  description: "About sections for company info, team, and mission",
  icon: "👥",
  defaultVariant: "about-story",
  variants: [aboutStory, aboutTeam, aboutMission, aboutPhilosophy, aboutEssay, aboutVision, aboutVisionStatement],
};
