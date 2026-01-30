import prisma from "../lib/prisma";
import { writeFileSync } from "fs";
import { join } from "path";

async function generateSimpleContentDoc() {
  // Get all published pages with their blocks
  const pages = await prisma.page.findMany({
    where: {
      published: true,
    },
    include: {
      blocks: {
        include: {
          block: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: [
      { slug: "asc" },
    ],
  });

  // Get all collections
  const collections = await prisma.collection.findMany({
    include: {
      items: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  let doc = `# Website Content Document\n\n`;
  doc += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
  doc += `This document shows all the current content on the website.\n`;
  doc += `Please replace placeholder/demo content with real company content.\n\n`;
  doc += `---\n\n`;

  // Helper function to extract readable content
  const getReadableValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      // Check if array of strings
      if (typeof value[0] === 'string') {
        return value.join(', ');
      }
      return `${value.length} items`;
    }
    if (typeof value === 'object') {
      return '[Complex content - see details]';
    }
    return String(value);
  };

  // Document each page
  pages.forEach((page, pageIndex) => {
    doc += `## Page ${pageIndex + 1}: ${page.title}\n\n`;
    doc += `**Web Address:** ${page.slug}\n\n`;

    if (page.description) {
      doc += `**Description:** ${page.description}\n\n`;
    }

    // Show blocks
    page.blocks.forEach((pageBlock, blockIndex) => {
      const block = pageBlock.block;
      const content = block.content as any;

      doc += `### Section ${blockIndex + 1}: ${block.name}\n\n`;

      // Special handling for different block types
      if (block.type === 'HERO') {
        // Hero blocks
        if (content.title) doc += `**Title:** ${content.title}\n\n`;
        if (content.subtitle) doc += `**Subtitle:** ${content.subtitle}\n\n`;

        // Check for bilingual content
        if (content.en) {
          doc += `**English Content:**\n\n`;
          if (content.en.title) doc += `- Title: ${content.en.title}\n`;
          if (content.en.subtitle) doc += `- Subtitle: ${content.en.subtitle}\n`;
          if (content.en.description) doc += `- Description: ${content.en.description}\n`;
          doc += `\n`;
        }

        if (content.ar) {
          doc += `**Arabic Content:**\n\n`;
          if (content.ar.title) doc += `- Title: ${content.ar.title}\n`;
          if (content.ar.subtitle) doc += `- Subtitle: ${content.ar.subtitle}\n`;
          if (content.ar.description) doc += `- Description: ${content.ar.description}\n`;
          doc += `\n`;
        }

        if (content.mediaUrl) doc += `**Background:** Video/Image\n\n`;
        if (content.backgroundImage) doc += `**Background:** Image\n\n`;

      } else if (block.type === 'ABOUT') {
        // About blocks
        if (content.title) doc += `**Title:** ${content.title}\n\n`;
        if (content.subtitle) doc += `**Subtitle:** ${content.subtitle}\n\n`;
        if (content.description) doc += `**Description:** ${content.description}\n\n`;
        if (content.content) doc += `**Content:** ${content.content}\n\n`;

        // Bilingual
        if (content.en) {
          doc += `**English Content:**\n\n`;
          if (content.en.title) doc += `- Title: ${content.en.title}\n`;
          if (content.en.subtitle) doc += `- Subtitle: ${content.en.subtitle}\n`;
          if (content.en.description) doc += `- Description: ${content.en.description}\n`;
          if (content.en.content) doc += `- Content: ${content.en.content}\n`;
          doc += `\n`;
        }

        if (content.ar) {
          doc += `**Arabic Content:**\n\n`;
          if (content.ar.title) doc += `- Title: ${content.ar.title}\n`;
          if (content.ar.subtitle) doc += `- Subtitle: ${content.ar.subtitle}\n`;
          if (content.ar.description) doc += `- Description: ${content.ar.description}\n`;
          if (content.ar.content) doc += `- Content: ${content.ar.content}\n`;
          doc += `\n`;
        }

      } else if (block.type === 'FORM') {
        // Form blocks
        if (content.title) doc += `**Form Title:** ${content.title}\n\n`;
        if (content.description) doc += `**Form Description:** ${content.description}\n\n`;
        if (content.submitButtonText) doc += `**Button Text:** ${content.submitButtonText}\n\n`;

        // Bilingual
        if (content.en) {
          doc += `**English:**\n`;
          if (content.en.title) doc += `- Title: ${content.en.title}\n`;
          if (content.en.description) doc += `- Description: ${content.en.description}\n`;
          if (content.en.submitButtonText) doc += `- Button: ${content.en.submitButtonText}\n`;
          doc += `\n`;
        }

        if (content.ar) {
          doc += `**Arabic:**\n`;
          if (content.ar.title) doc += `- Title: ${content.ar.title}\n`;
          if (content.ar.description) doc += `- Description: ${content.ar.description}\n`;
          if (content.ar.submitButtonText) doc += `- Button: ${content.ar.submitButtonText}\n`;
          doc += `\n`;
        }

      } else if (block.type === 'GALLERY') {
        // Gallery blocks
        if (content.title) doc += `**Gallery Title:** ${content.title}\n\n`;
        if (content.description) doc += `**Description:** ${content.description}\n\n`;

        // Bilingual
        if (content.en?.title || content.en?.description) {
          doc += `**English:**\n`;
          if (content.en.title) doc += `- Title: ${content.en.title}\n`;
          if (content.en.description) doc += `- Description: ${content.en.description}\n`;
          doc += `\n`;
        }

        if (content.ar?.title || content.ar?.description) {
          doc += `**Arabic:**\n`;
          if (content.ar.title) doc += `- Title: ${content.ar.title}\n`;
          if (content.ar.description) doc += `- Description: ${content.ar.description}\n`;
          doc += `\n`;
        }

        if (content.collectionSlug) {
          doc += `**Content Source:** ${content.collectionSlug} collection\n\n`;
        }

      } else if (block.type === 'MEDIA_CARDS') {
        // Media cards
        if (content.title) doc += `**Title:** ${content.title}\n\n`;
        if (content.subtitle) doc += `**Subtitle:** ${content.subtitle}\n\n`;
        if (content.collectionSlug) {
          doc += `**Content Source:** ${content.collectionSlug} collection\n\n`;
        }

      } else {
        // Generic handling for other block types
        Object.keys(content).forEach(key => {
          const value = getReadableValue(content[key]);
          if (value && !key.includes('image') && !key.includes('Image') && !key.includes('url') && !key.includes('Url')) {
            doc += `**${key}:** ${value}\n\n`;
          }
        });
      }

      doc += `---\n\n`;
    });
  });

  // Document Collections in simple format
  if (collections.length > 0) {
    doc += `# Collections (Reusable Content)\n\n`;

    collections.forEach((collection) => {
      doc += `## ${collection.name}\n\n`;

      collection.items.forEach((item, itemIndex) => {
        const itemContent = item.content as any;
        doc += `### Item ${itemIndex + 1}\n\n`;

        // Check for bilingual structure
        if (itemContent.en || itemContent.ar) {
          if (itemContent.en) {
            doc += `**English:**\n\n`;
            Object.keys(itemContent.en).forEach(key => {
              const value = getReadableValue(itemContent.en[key]);
              if (value && !key.includes('image') && !key.includes('Image') && !key.includes('url') && !key.includes('Url') && !key.includes('slug')) {
                doc += `- ${key}: ${value}\n`;
              }
            });
            doc += `\n`;
          }

          if (itemContent.ar) {
            doc += `**Arabic:**\n\n`;
            Object.keys(itemContent.ar).forEach(key => {
              const value = getReadableValue(itemContent.ar[key]);
              if (value && !key.includes('image') && !key.includes('Image') && !key.includes('url') && !key.includes('Url') && !key.includes('slug')) {
                doc += `- ${key}: ${value}\n`;
              }
            });
            doc += `\n`;
          }
        } else {
          // Non-bilingual content
          Object.keys(itemContent).forEach(key => {
            const value = getReadableValue(itemContent[key]);
            if (value && !key.includes('image') && !key.includes('Image') && !key.includes('url') && !key.includes('Url') && !key.includes('slug')) {
              doc += `**${key}:** ${value}\n\n`;
            }
          });
        }

        doc += `---\n\n`;
      });
    });
  }

  // Write to file
  const outputPath = join(process.cwd(), "WEBSITE_CONTENT.md");
  writeFileSync(outputPath, doc, "utf-8");

  console.log(`✅ Simple content document generated: ${outputPath}`);
  console.log(`📄 Pages documented: ${pages.length}`);
  console.log(`📚 Collections: ${collections.length}`);
}

generateSimpleContentDoc()
  .catch((error) => {
    console.error("Error generating content document:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
