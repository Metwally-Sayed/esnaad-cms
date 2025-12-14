/**
 * Script to enable profile pages for the Media collection
 * Run with: npx tsx scripts/enable-media-profile-pages.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Enabling profile pages for Media collection...\n");

  // Get the media collection
  const collection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (!collection) {
    console.log("❌ Media collection not found. Creating it...");

    const newCollection = await prisma.collection.create({
      data: {
        name: "Media",
        slug: "media",
        hasProfilePages: true,
        profilePageSlugPattern: "/gallery/[slug]",
      },
    });

    console.log("✓ Created Media collection with profile pages enabled");
    console.log(`  Collection ID: ${newCollection.id}`);
    console.log(`  Slug pattern: ${newCollection.profilePageSlugPattern}`);
    return;
  }

  // Update existing collection to enable profile pages
  const updated = await prisma.collection.update({
    where: { id: collection.id },
    data: {
      hasProfilePages: true,
      profilePageSlugPattern: "/gallery/[slug]",
    },
  });

  console.log("✓ Updated Media collection");
  console.log(`  Collection ID: ${updated.id}`);
  console.log(`  Profile pages: ${updated.hasProfilePages ? "Enabled" : "Disabled"}`);
  console.log(`  Slug pattern: ${updated.profilePageSlugPattern}`);

  // Get all existing media items
  const items = await prisma.collectionItem.findMany({
    where: { collectionId: collection.id },
    include: { page: true },
  });

  console.log(`\nFound ${items.length} media items\n`);

  // Create profile pages for existing items that don't have them
  for (const item of items) {
    const content = item.content as Record<string, unknown>;
    const slug = content.slug as string;

    if (!slug) {
      console.log(`⚠ Skipping item ${item.id} - no slug defined`);
      continue;
    }

    if (item.pageId && item.page) {
      console.log(`✓ Item "${slug}" already has profile page: ${item.page.slug}`);
      continue;
    }

    // Create profile page
    const pageSlug = `/gallery/${slug}`;
    const title = (content.nameEn as string) || slug;
    const description = typeof content.descriptionEn === 'string'
      ? content.descriptionEn
      : undefined;

    const page = await prisma.page.create({
      data: {
        title,
        slug: pageSlug,
        description,
        published: true,
      },
    });

    // Link item to page
    await prisma.collectionItem.update({
      where: { id: item.id },
      data: { pageId: page.id },
    });

    console.log(`✓ Created profile page for "${slug}"`);
    console.log(`  Page URL: ${pageSlug}`);
  }

  console.log("\n✅ Profile pages enabled successfully!");
  console.log("\nNow you can:");
  console.log("1. View media items at /admin/collections/" + collection.id);
  console.log("2. Each item will have a profile page at /gallery/{slug}");
  console.log("3. Add MEDIA_DETAILS blocks to render media content");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
