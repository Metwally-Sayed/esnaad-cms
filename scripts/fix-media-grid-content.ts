/**
 * Fix media grid block content to include collectionId and filterType in Arabic content
 * Run with: npx tsx scripts/fix-media-grid-content.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Fixing media grid block content...\n");

  const page = await prisma.page.findFirst({
    where: { slug: "/media-center" },
    include: {
      blocks: {
        include: {
          block: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page) {
    console.log("Page not found");
    return;
  }

  // Find the media-grid block
  const mediaGridBlock = page.blocks.find(
    (pb) => pb.block.variant === "media-grid"
  );

  if (!mediaGridBlock) {
    console.log("Media grid block not found");
    return;
  }

  const content = mediaGridBlock.block.content as Record<string, any>;

  console.log("Current AR content keys:", Object.keys(content.ar || {}));
  console.log("Current EN content keys:", Object.keys(content.en || {}));

  // Update the AR content to include collectionId and filterType
  content.ar = {
    ...content.ar,
    collectionId: content.collectionId || content.en.collectionId,
    filterType: content.filterType || content.en.filterType,
  };

  // Also update root level
  content.collectionId = content.en.collectionId;
  content.filterType = content.en.filterType;

  // Remove static items from both locales since we're using dynamic content
  delete content.ar.items;
  delete content.en.items;
  content.items = [];

  // Save the updated content
  await prisma.block.update({
    where: { id: mediaGridBlock.block.id },
    data: { content },
  });

  console.log("\n✅ Updated media grid block content");
  console.log("New AR content keys:", Object.keys(content.ar));
  console.log("New EN content keys:", Object.keys(content.en));

  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
