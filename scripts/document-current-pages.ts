import prisma from "../lib/prisma";
import { writeFileSync } from "fs";
import { join } from "path";

async function documentPages() {
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
      header: {
        include: {
          headerLinks: {
            include: {
              children: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      footer: {
        include: {
          footerLinks: {
            include: {
              children: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Get global settings
  const globalSettings = await prisma.globalSettings.findUnique({
    where: { id: "global" },
    include: {
      defaultHeader: {
        include: {
          headerLinks: {
            include: {
              children: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      defaultFooter: {
        include: {
          footerLinks: {
            include: {
              children: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
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

  // Build documentation
  let doc = `# Current Pages & Blocks Documentation\n\n`;
  doc += `Generated on: ${new Date().toISOString()}\n\n`;
  doc += `Total Pages: ${pages.length}\n\n`;

  doc += `---\n\n`;

  // Document Global Settings
  doc += `## Global Settings\n\n`;
  if (globalSettings) {
    doc += `- Site Name: ${globalSettings.siteName || "N/A"}\n`;
    doc += `- Site Description: ${globalSettings.siteDescription || "N/A"}\n`;
    doc += `- Default Header: ${globalSettings.defaultHeader?.name || "N/A"}\n`;
    doc += `- Default Footer: ${globalSettings.defaultFooter?.name || "N/A"}\n\n`;

    if (globalSettings.defaultHeader) {
      doc += `### Default Header Links\n\n`;
      globalSettings.defaultHeader.headerLinks
        .filter((link) => !link.parentId)
        .forEach((link) => {
          doc += `- ${link.name} (${link.slug})`;
          if (link.nameAr) doc += ` | AR: ${link.nameAr}`;
          doc += `\n`;
          const children = globalSettings.defaultHeader!.headerLinks.filter(
            (l) => l.parentId === link.id
          );
          children.forEach((child) => {
            doc += `  - ${child.name} (${child.slug})`;
            if (child.nameAr) doc += ` | AR: ${child.nameAr}`;
            doc += `\n`;
          });
        });
      doc += `\n`;
    }

    if (globalSettings.defaultFooter) {
      doc += `### Default Footer Links\n\n`;
      globalSettings.defaultFooter.footerLinks
        .filter((link) => !link.parentId)
        .forEach((link) => {
          doc += `- ${link.name} (${link.slug})`;
          if (link.nameAr) doc += ` | AR: ${link.nameAr}`;
          doc += `\n`;
          const children = globalSettings.defaultFooter!.footerLinks.filter(
            (l) => l.parentId === link.id
          );
          children.forEach((child) => {
            doc += `  - ${child.name} (${child.slug})`;
            if (child.nameAr) doc += ` | AR: ${child.nameAr}`;
            doc += `\n`;
          });
        });
      doc += `\n`;
    }
  }

  doc += `---\n\n`;

  // Document Collections
  if (collections.length > 0) {
    doc += `## Collections\n\n`;
    collections.forEach((collection) => {
      doc += `### ${collection.name}\n\n`;
      doc += `- Slug: ${collection.slug}\n`;
      doc += `- Has Profile Pages: ${collection.hasProfilePages}\n`;
      if (collection.profilePageSlugPattern) {
        doc += `- Profile Page Slug Pattern: ${collection.profilePageSlugPattern}\n`;
      }
      doc += `- Total Items: ${collection.items.length}\n`;

      if (collection.fields) {
        doc += `\n**Field Schema:**\n\`\`\`json\n${JSON.stringify(collection.fields, null, 2)}\n\`\`\`\n\n`;
      }

      if (collection.items.length > 0) {
        doc += `\n**Sample Item Content (first item):**\n\`\`\`json\n${JSON.stringify(collection.items[0].content, null, 2)}\n\`\`\`\n\n`;
      }
    });

    doc += `---\n\n`;
  }

  // Document each page
  pages.forEach((page, index) => {
    doc += `## ${index + 1}. ${page.title}\n\n`;
    doc += `- **Slug:** ${page.slug}\n`;
    doc += `- **Published:** ${page.published ? "✅ Yes" : "❌ No"}\n`;
    doc += `- **Created:** ${page.createdAt.toISOString()}\n`;
    doc += `- **Updated:** ${page.updatedAt.toISOString()}\n`;

    if (page.description) {
      doc += `- **Description:** ${page.description}\n`;
    }

    // SEO Information
    if (page.seoTitle || page.seoDescription) {
      doc += `\n### SEO\n\n`;
      if (page.seoTitle) doc += `- **SEO Title:** ${page.seoTitle}\n`;
      if (page.seoDescription)
        doc += `- **SEO Description:** ${page.seoDescription}\n`;
      if (page.focusKeyword)
        doc += `- **Focus Keyword:** ${page.focusKeyword}\n`;
      if (page.canonicalUrl)
        doc += `- **Canonical URL:** ${page.canonicalUrl}\n`;
      if (page.robots) doc += `- **Robots:** ${page.robots}\n`;
    }

    // Header/Footer overrides
    if (page.header) {
      doc += `\n### Header Override\n\n`;
      doc += `- **Name:** ${page.header.name}\n`;
    }

    if (page.footer) {
      doc += `\n### Footer Override\n\n`;
      doc += `- **Name:** ${page.footer.name}\n`;
    }

    // Blocks
    doc += `\n### Blocks (${page.blocks.length} total)\n\n`;

    page.blocks.forEach((pageBlock, blockIndex) => {
      const block = pageBlock.block;
      doc += `#### Block ${blockIndex + 1}: ${block.name}\n\n`;
      doc += `- **Type:** ${block.type}\n`;
      doc += `- **Variant:** ${block.variant}\n`;
      doc += `- **Global Block:** ${block.isGlobal ? "✅ Yes" : "❌ No"}\n`;
      doc += `- **Order:** ${pageBlock.order}\n\n`;

      doc += `**Content:**\n\`\`\`json\n${JSON.stringify(block.content, null, 2)}\n\`\`\`\n\n`;
    });

    doc += `---\n\n`;
  });

  // Summary of block types used
  const blockTypesUsed = new Map<string, Set<string>>();
  pages.forEach((page) => {
    page.blocks.forEach((pageBlock) => {
      const block = pageBlock.block;
      if (!blockTypesUsed.has(block.type)) {
        blockTypesUsed.set(block.type, new Set());
      }
      blockTypesUsed.get(block.type)!.add(block.variant);
    });
  });

  doc += `## Summary: Block Types & Variants Used\n\n`;
  Array.from(blockTypesUsed.entries())
    .sort()
    .forEach(([type, variants]) => {
      doc += `### ${type}\n\n`;
      doc += `Variants used:\n`;
      Array.from(variants)
        .sort()
        .forEach((variant) => {
          doc += `- ${variant}\n`;
        });
      doc += `\n`;
    });

  // Write to file
  const outputPath = join(process.cwd(), "CURRENT_PAGES_STRUCTURE.md");
  writeFileSync(outputPath, doc, "utf-8");

  console.log(`✅ Documentation written to: ${outputPath}`);
  console.log(`📄 Total pages documented: ${pages.length}`);
  console.log(
    `🧩 Block types used: ${Array.from(blockTypesUsed.keys()).join(", ")}`
  );
}

documentPages()
  .catch((error) => {
    console.error("Error documenting pages:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
