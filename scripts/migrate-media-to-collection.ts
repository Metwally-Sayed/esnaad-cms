/**
 * Script to migrate Media table data to Collection system
 * Run with: npx tsx scripts/migrate-media-to-collection.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Migrating Media table to Collection system...\n");

  // Step 1: Create or get the media collection
  let collection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (!collection) {
    collection = await prisma.collection.create({
      data: {
        name: "Media",
        slug: "media",
        hasProfilePages: false,
      },
    });
    console.log("✓ Created 'media' collection");
  } else {
    console.log("✓ Media collection already exists");
    // Clear existing items
    const deleteResult = await prisma.collectionItem.deleteMany({
      where: { collectionId: collection.id },
    });
    console.log(`✓ Cleared ${deleteResult.count} existing collection items`);
  }

  // Step 2: Get all media from Media table
  const mediaItems = await prisma.media.findMany({
    orderBy: { order: "asc" },
  });

  console.log(`\nFound ${mediaItems.length} items in Media table`);

  // Step 3: Create CollectionItems from Media table data
  for (const media of mediaItems) {
    const collectionItem = await prisma.collectionItem.create({
      data: {
        collectionId: collection.id,
        order: media.order,
        content: {
          nameEn: media.nameEn,
          nameAr: media.nameAr,
          descriptionEn: media.descriptionEn,
          descriptionAr: media.descriptionAr,
          slug: media.slug,
          type: media.type,
          image: media.image,
        },
      },
    });
    console.log(
      `✓ Migrated: ${media.nameEn} (${media.type}) -> CollectionItem ${collectionItem.id}`
    );
  }

  console.log("\n✅ Migration completed successfully!");
  console.log(`\nTotal items migrated: ${mediaItems.length}`);
  console.log(`Collection ID: ${collection.id}`);
  console.log(`Collection Slug: ${collection.slug}`);
  console.log("\nYou can now:");
  console.log("1. View items at: /admin/collections/" + collection.id);
  console.log("2. Use collectionId in gallery blocks to fetch data dynamically");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
