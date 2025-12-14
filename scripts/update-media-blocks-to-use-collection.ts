/**
 * Script to update media-center page blocks to use collectionId
 * Run with: npx tsx scripts/update-media-blocks-to-use-collection.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Updating media-center blocks to use collection...\n");

  // Get the media collection
  const collection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (!collection) {
    throw new Error("Media collection not found. Run migrate-media-to-collection.ts first.");
  }

  console.log(`✓ Found media collection: ${collection.id}\n`);

  // Get the media-center page
  const page = await prisma.page.findUnique({
    where: { slug: "/media-center" },
    include: {
      blocks: {
        include: { block: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page) {
    console.log("❌ Media center page not found");
    return;
  }

  console.log(`✓ Found page: ${page.title}\n`);

  // Update blocks
  for (const pageBlock of page.blocks) {
    const block = pageBlock.block;

    if (block.type === "GALLERY") {
      console.log(`Updating block: ${block.name} (${block.variant})`);

      let updatedContent: Record<string, unknown> = block.content as Record<string, unknown>;

      // For media-grid, keep the static structure but add collectionId
      if (block.variant === "media-grid") {
        updatedContent = {
          ...updatedContent,
          collectionId: collection.id,
          filterType: "category", // Only show categories
        };
      }

      // For industry-update, replace items with collectionId
      if (block.variant === "industry-update") {
        updatedContent = {
          en: {
            sectionTitle: "INDUSTRY UPDATE",
            collectionId: collection.id,
            filterType: "article", // Only show articles
          },
          ar: {
            sectionTitle: "تحديث الصناعة",
            collectionId: collection.id,
            filterType: "article", // Only show articles
          },
        };
      }

      // Update the block
      await prisma.block.update({
        where: { id: block.id },
        data: { content: updatedContent },
      });

      console.log(`✓ Updated: ${block.name}`);
    }
  }

  console.log("\n✅ Blocks updated successfully!");
  console.log("\nNow you can:");
  console.log("1. Edit media items in /admin/collections/" + collection.id);
  console.log("2. The gallery blocks will automatically show the updated data");
  console.log("3. Use 'collectionId' in block content to enable dynamic fetching");
  console.log("4. Use 'filterType' to filter by media type (category, article, etc.)");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
