import prisma from "../lib/prisma";

async function create3dCardsTestPage() {
  console.log("🔧 Creating test page with media-cards-3d block...\n");

  // Get the media collection
  const collection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (!collection) {
    console.error("❌ Media collection not found");
    return;
  }

  console.log(`✅ Found media collection: ${collection.id}\n`);

  // Create or update test page
  const testPage = await prisma.page.upsert({
    where: { slug: "/test-3d-cards" },
    create: {
      slug: "/test-3d-cards",
      title: "3D Cards Test",
      description: "Test page for media-cards-3d variant",
      published: true,
    },
    update: {
      title: "3D Cards Test",
      description: "Test page for media-cards-3d variant",
      published: true,
    },
  });

  console.log(`✅ Created/Updated page: ${testPage.slug}\n`);

  // Create the 3D cards block
  const block = await prisma.block.create({
    data: {
      name: "3D Media Cards Test",
      type: "MEDIA_CARDS",
      variant: "media-cards-3d",
      content: {
        collectionId: collection.id,
        sortBy: "updatedAt",
        limit: 0, // 0 means no limit, show all
        filterType: "", // Empty means no filter, show all types
        showFilters: true, // Show filter buttons
      },
      isGlobal: false,
    },
  });

  console.log(`✅ Created block: ${block.name}\n`);

  // Link block to page
  await prisma.pageBlock.create({
    data: {
      pageId: testPage.id,
      blockId: block.id,
      order: 0,
    },
  });

  console.log("✅ Linked block to page\n");

  console.log("🎉 Test page created successfully!");
  console.log("\nVisit: http://localhost:3000/en/test-3d-cards");
  console.log("\nThis page should display:");
  console.log("  - Hero section with title and filters");
  console.log("  - 3 filter buttons: All, Updates, Insights, News");
  console.log("  - 3 media cards with 3D hover effects");
}

create3dCardsTestPage()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
