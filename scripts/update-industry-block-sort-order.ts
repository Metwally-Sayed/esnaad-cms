/**
 * Script to update industry-update block to use sortBy field
 * Run with: npx tsx scripts/update-industry-block-sort-order.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Updating industry-update block to use sortBy...\n");

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

  // Get the media collection
  const collection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (!collection) {
    console.log("❌ Media collection not found");
    return;
  }

  // Update industry-update block
  for (const pageBlock of page.blocks) {
    const block = pageBlock.block;

    if (block.type === "GALLERY" && block.variant === "industry-update") {
      console.log(`Updating block: ${block.name} (${block.variant})`);

      const content = block.content as Record<string, unknown>;

      // Update both English and Arabic content
      const updatedContent = {
        en: {
          sectionTitle: "INDUSTRY UPDATE",
          collectionId: collection.id,
          filterType: "article",
          sortBy: "updatedAt", // Show newest first
        },
        ar: {
          sectionTitle: "تحديث الصناعة",
          collectionId: collection.id,
          filterType: "article",
          sortBy: "updatedAt", // Show newest first
        },
      };

      // Update the block
      await prisma.block.update({
        where: { id: block.id },
        data: { content: updatedContent },
      });

      console.log(`✓ Updated: ${block.name}`);
      console.log(`  - Sort by: Last Updated (newest first)`);
    }
  }

  console.log("\n✅ Block updated successfully!");
  console.log("\nThe industry-update block will now show:");
  console.log("- Latest updated media items first");
  console.log("- When you edit a media item, it moves to the top");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
