/**
 * Script to retroactively generate profile pages for existing collection items
 * Run with: npx tsx scripts/generate-profile-pages.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function generateProfilePages() {
  console.log("🔍 Finding collections with profile pages enabled...");

  const collections = await prisma.collection.findMany({
    where: {
      hasProfilePages: true,
    },
    include: {
      items: true,
    },
  });

  console.log(`📦 Found ${collections.length} collection(s) with profile pages enabled`);

  for (const collection of collections) {
    console.log(`\n📂 Processing collection: ${collection.name}`);

    if (!collection.profilePageSlugPattern) {
      console.log(`  ⚠️  Skipping: No profile page slug pattern defined`);
      continue;
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const item of collection.items) {
      const content = item.content as Record<string, unknown>;
      const itemSlug = content.slug as string | undefined;

      if (!itemSlug) {
        console.log(`  ⏭️  Skipping item ${item.id}: No slug defined`);
        skipped++;
        continue;
      }

      const pageSlug = collection.profilePageSlugPattern.replace("[slug]", itemSlug);
      const title = (content.title as string) || itemSlug;
      const description = (content.description as string) || undefined;

      // Check if page already exists
      if (item.pageId) {
        // Update existing page
        await prisma.page.update({
          where: { id: item.pageId },
          data: {
            title,
            slug: pageSlug,
            description,
          },
        });
        console.log(`  ✏️  Updated page: ${pageSlug}`);
        updated++;
      } else {
        // Check if page with this slug already exists
        const existingPage = await prisma.page.findUnique({
          where: { slug: pageSlug },
        });

        if (existingPage) {
          // Link existing page to item
          await prisma.collectionItem.update({
            where: { id: item.id },
            data: { pageId: existingPage.id },
          });
          console.log(`  🔗 Linked to existing page: ${pageSlug}`);
          updated++;
        } else {
          // Create new page
          const page = await prisma.page.create({
            data: {
              title,
              slug: pageSlug,
              description,
              published: true,
            },
          });

          // Link page to collection item
          await prisma.collectionItem.update({
            where: { id: item.id },
            data: { pageId: page.id },
          });

          console.log(`  ✅ Created page: ${pageSlug}`);
          created++;
        }
      }
    }

    console.log(`\n  📊 Summary for "${collection.name}":`);
    console.log(`     Created: ${created}`);
    console.log(`     Updated: ${updated}`);
    console.log(`     Skipped: ${skipped}`);
  }

  console.log("\n✨ Profile page generation complete!");
}

generateProfilePages()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
