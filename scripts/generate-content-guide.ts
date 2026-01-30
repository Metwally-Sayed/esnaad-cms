import prisma from "../lib/prisma";
import { writeFileSync } from "fs";
import { join } from "path";

async function generateContentGuide() {
  // Get all pages with their blocks
  const pages = await prisma.page.findMany({
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

  let doc = `# Content Creation Guide - Esnaad CMS\n\n`;
  doc += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
  doc += `This document shows all pages and their content blocks that need to be filled with real content.\n\n`;
  doc += `**Total Pages:** ${pages.length}\n\n`;
  doc += `---\n\n`;

  // Table of Contents
  doc += `## Table of Contents\n\n`;
  pages.forEach((page, index) => {
    doc += `${index + 1}. [${page.title}](#${index + 1}-${page.title.toLowerCase().replace(/\s+/g, '-')})\n`;
  });
  if (collections.length > 0) {
    doc += `\n### Collections\n`;
    collections.forEach((collection) => {
      doc += `- [${collection.name}](#collection-${collection.name.toLowerCase().replace(/\s+/g, '-')})\n`;
    });
  }
  doc += `\n---\n\n`;

  // Document each page
  pages.forEach((page, pageIndex) => {
    doc += `## ${pageIndex + 1}. ${page.title}\n\n`;
    doc += `**URL:** ${page.slug}\n\n`;
    doc += `**Status:** ${page.published ? '✅ Published' : '⏳ Draft'}\n\n`;

    if (page.description) {
      doc += `**Page Description:** ${page.description}\n\n`;
    }

    // SEO Section
    doc += `### 📝 SEO Content Needed\n\n`;
    doc += `| Field | Current Value | Instructions |\n`;
    doc += `|-------|---------------|-------------|\n`;
    doc += `| SEO Title | ${page.seoTitle || '❌ Missing'} | Optimal length: 50-60 characters |\n`;
    doc += `| SEO Description | ${page.seoDescription || '❌ Missing'} | Optimal length: 150-160 characters |\n`;
    doc += `| Focus Keyword | ${page.focusKeyword || '❌ Missing'} | Main keyword to target |\n\n`;

    // Blocks
    if (page.blocks.length === 0) {
      doc += `### ⚠️ No blocks yet - page structure needs to be defined\n\n`;
    } else {
      doc += `### 🧩 Content Blocks (${page.blocks.length} blocks)\n\n`;

      page.blocks.forEach((pageBlock, blockIndex) => {
        const block = pageBlock.block;
        doc += `#### Block ${blockIndex + 1}: ${block.name}\n\n`;
        doc += `**Type:** ${block.type} (${block.variant})\n\n`;

        // Parse content and show what needs to be filled
        const content = block.content as any;

        doc += `**Content Required:**\n\n`;
        doc += `| Field | Current Value | Notes |\n`;
        doc += `|-------|---------------|-------|\n`;

        // Helper function to display content fields
        const displayField = (key: string, value: any, depth = 0) => {
          const indent = '  '.repeat(depth);

          if (value === null || value === undefined || value === '') {
            doc += `| ${indent}${key} | ❌ **MISSING** | Required |\n`;
          } else if (typeof value === 'string') {
            const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
            doc += `| ${indent}${key} | ${preview} | |\n`;
          } else if (typeof value === 'boolean') {
            doc += `| ${indent}${key} | ${value ? '✅' : '❌'} | |\n`;
          } else if (Array.isArray(value)) {
            if (value.length === 0) {
              doc += `| ${indent}${key} | ❌ **EMPTY ARRAY** | Add items |\n`;
            } else {
              doc += `| ${indent}${key} | ${value.length} items | |\n`;
              // Show first item as example
              if (typeof value[0] === 'object') {
                Object.keys(value[0]).forEach(subKey => {
                  displayField(`${key}[0].${subKey}`, value[0][subKey], depth + 1);
                });
              }
            }
          } else if (typeof value === 'object') {
            doc += `| ${indent}${key} | Object | |\n`;
            Object.keys(value).forEach(subKey => {
              displayField(`${key}.${subKey}`, value[subKey], depth + 1);
            });
          } else {
            doc += `| ${indent}${key} | ${value} | |\n`;
          }
        };

        // Display all content fields
        Object.keys(content).forEach(key => {
          displayField(key, content[key]);
        });

        doc += `\n`;

        // Show full JSON for reference
        doc += `<details>\n<summary>📋 View Full Content JSON</summary>\n\n`;
        doc += `\`\`\`json\n${JSON.stringify(content, null, 2)}\n\`\`\`\n\n`;
        doc += `</details>\n\n`;
      });
    }

    doc += `---\n\n`;
  });

  // Document Collections
  if (collections.length > 0) {
    doc += `## 📚 Collections\n\n`;
    doc += `Collections are reusable content types. Content creators need to provide data for all items.\n\n`;

    collections.forEach((collection) => {
      doc += `### Collection: ${collection.name}\n\n`;
      doc += `**Slug:** ${collection.slug}\n\n`;
      doc += `**Total Items:** ${collection.items.length}\n\n`;

      if (collection.hasProfilePages) {
        doc += `**Has Profile Pages:** Yes\n\n`;
        doc += `**Profile URL Pattern:** ${collection.profilePageSlugPattern}\n\n`;
      }

      // Show field schema
      if (collection.fields) {
        doc += `#### Field Schema\n\n`;
        const fields = collection.fields as any;
        if (Array.isArray(fields)) {
          doc += `| Field Name | Type | Required |\n`;
          doc += `|------------|------|----------|\n`;
          fields.forEach((field: any) => {
            doc += `| ${field.name || field.label} | ${field.type} | ${field.required ? '✅ Yes' : '❌ No'} |\n`;
          });
          doc += `\n`;
        } else {
          doc += `\`\`\`json\n${JSON.stringify(fields, null, 2)}\n\`\`\`\n\n`;
        }
      }

      // Show all items
      doc += `#### Items to Fill\n\n`;
      if (collection.items.length === 0) {
        doc += `⚠️ **No items yet** - content creator needs to add items to this collection.\n\n`;
      } else {
        collection.items.forEach((item, itemIndex) => {
          doc += `##### Item ${itemIndex + 1}\n\n`;

          const itemContent = item.content as any;
          doc += `| Field | Current Value | Status |\n`;
          doc += `|-------|---------------|--------|\n`;

          Object.keys(itemContent).forEach(key => {
            const value = itemContent[key];
            if (value === null || value === undefined || value === '') {
              doc += `| ${key} | ❌ **MISSING** | Needs content |\n`;
            } else if (typeof value === 'string') {
              const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
              doc += `| ${key} | ${preview} | ✅ Has content |\n`;
            } else if (Array.isArray(value)) {
              doc += `| ${key} | ${value.length} items | ${value.length > 0 ? '✅' : '❌'} |\n`;
            } else {
              doc += `| ${key} | ${JSON.stringify(value).substring(0, 50)} | |\n`;
            }
          });

          doc += `\n<details>\n<summary>View Full JSON</summary>\n\n`;
          doc += `\`\`\`json\n${JSON.stringify(itemContent, null, 2)}\n\`\`\`\n\n`;
          doc += `</details>\n\n`;
        });
      }

      doc += `---\n\n`;
    });
  }

  // Summary Section
  doc += `## 📊 Content Summary\n\n`;

  // Count missing content
  let totalBlocks = 0;
  let blocksWithMissingContent = 0;
  const blockTypesUsed = new Map<string, { count: number; variants: Set<string> }>();

  pages.forEach(page => {
    page.blocks.forEach(pageBlock => {
      totalBlocks++;
      const block = pageBlock.block;
      const content = block.content as any;

      // Check if block has missing content
      let hasMissing = false;
      Object.values(content).forEach(value => {
        if (value === null || value === undefined || value === '') {
          hasMissing = true;
        }
      });
      if (hasMissing) blocksWithMissingContent++;

      // Track block types
      if (!blockTypesUsed.has(block.type)) {
        blockTypesUsed.set(block.type, { count: 0, variants: new Set() });
      }
      const stats = blockTypesUsed.get(block.type)!;
      stats.count++;
      stats.variants.add(block.variant);
    });
  });

  doc += `### Overview\n\n`;
  doc += `- **Total Pages:** ${pages.length}\n`;
  doc += `- **Published Pages:** ${pages.filter(p => p.published).length}\n`;
  doc += `- **Draft Pages:** ${pages.filter(p => !p.published).length}\n`;
  doc += `- **Total Blocks:** ${totalBlocks}\n`;
  doc += `- **Blocks with Missing Content:** ${blocksWithMissingContent}\n`;
  doc += `- **Total Collections:** ${collections.length}\n`;
  doc += `- **Total Collection Items:** ${collections.reduce((sum, c) => sum + c.items.length, 0)}\n\n`;

  doc += `### Block Types Used\n\n`;
  doc += `| Block Type | Count | Variants |\n`;
  doc += `|------------|-------|----------|\n`;
  Array.from(blockTypesUsed.entries()).sort().forEach(([type, stats]) => {
    doc += `| ${type} | ${stats.count} | ${Array.from(stats.variants).join(', ')} |\n`;
  });
  doc += `\n`;

  // Write to file
  const outputPath = join(process.cwd(), "CONTENT_CREATION_GUIDE.md");
  writeFileSync(outputPath, doc, "utf-8");

  console.log(`✅ Content guide generated: ${outputPath}`);
  console.log(`📄 Pages documented: ${pages.length}`);
  console.log(`🧩 Total blocks: ${totalBlocks}`);
  console.log(`⚠️  Blocks with missing content: ${blocksWithMissingContent}`);
  console.log(`📚 Collections: ${collections.length}`);
}

generateContentGuide()
  .catch((error) => {
    console.error("Error generating content guide:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
