import prisma from "../lib/prisma";
import { BlockType } from "@prisma/client";

async function createGalleryListingPage() {
  console.log("🎨 Creating gallery listing page...");

  // Check if gallery page already exists
  const existingPage = await prisma.page.findUnique({
    where: { slug: "/gallery" },
  });

  if (existingPage) {
    console.log("⚠️  Gallery page already exists, deleting it first...");
    // Delete associated blocks
    const pageBlocks = await prisma.pageBlock.findMany({
      where: { pageId: existingPage.id },
    });
    const blockIds = pageBlocks.map((pb) => pb.blockId);
    await prisma.pageBlock.deleteMany({
      where: { pageId: existingPage.id },
    });
    await prisma.block.deleteMany({
      where: { id: { in: blockIds } },
    });
    await prisma.page.delete({
      where: { id: existingPage.id },
    });
  }

  // Get the Media collection
  const mediaCollection = await prisma.collection.findFirst({
    where: { slug: "media" },
  });

  if (!mediaCollection) {
    console.error("❌ Media collection not found!");
    return;
  }

  console.log("✅ Found Media collection:", mediaCollection.id);

  // Create the page
  const page = await prisma.page.create({
    data: {
      title: "Gallery",
      slug: "/gallery",
      description: "Explore our latest media coverage, insights, and updates",
      published: true,
    },
  });

  console.log("✅ Created gallery page:", page.slug);

  // Create MEDIA_CARDS block
  const mediaCardsBlock = await prisma.block.create({
    data: {
      name: "All Media Items",
      type: BlockType.MEDIA_CARDS,
      variant: "media-cards-standard",
      content: {
        collectionId: mediaCollection.id,
        filterType: "", // Show all types
        sortBy: "updatedAt", // Sort by last updated
        limit: 0, // No limit, show all
      },
      isGlobal: false,
    },
  });

  console.log("✅ Created media cards block");

  // Link block to page
  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: mediaCardsBlock.id,
      order: 0,
    },
  });

  console.log("✅ Linked block to page");

  console.log("\n🎉 Gallery listing page created successfully!");
  console.log("📍 Visit: http://localhost:3000/en/gallery");
  console.log(
    "💡 This page is now fully controlled from the dashboard at /admin/pages"
  );
}

createGalleryListingPage()
  .then(() => {
    console.log("\n✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
