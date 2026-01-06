import prisma from "../lib/prisma";

async function restoreSparkPage() {
  try {
    console.log("🔧 Restoring the-spark project page...\n");

    // Find the-spark collection item
    const sparkItem = await prisma.collectionItem.findUnique({
      where: { id: "col-projects-1" },
      include: {
        collection: true,
      },
    });

    if (!sparkItem) {
      console.error("❌ The-spark item not found");
      return;
    }

    console.log("✅ Found the-spark item");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = sparkItem.content as any;
    const itemData = content.en || content.ar || content;

    console.log("  Title:", itemData.title);
    console.log("  Slug:", itemData.slug);

    if (sparkItem.pageId) {
      console.log("⚠️  Page already exists with ID:", sparkItem.pageId);
      return;
    }

    // Check if page exists but not linked
    const existingPage = await prisma.page.findUnique({
      where: { slug: "/projects/the-spark" },
    });

    if (existingPage) {
      console.log("✅ Found existing page, linking to item...");
      await prisma.collectionItem.update({
        where: { id: sparkItem.id },
        data: { pageId: existingPage.id },
      });
      console.log("✅ Successfully linked existing page");
      return;
    }

    // Create new page
    console.log("📝 Creating new page for the-spark...");

    const page = await prisma.page.create({
      data: {
        title: itemData.title || "THE SPARK",
        slug: "/projects/the-spark",
        description: itemData.conceptDescription || undefined,
        published: true,
      },
    });

    console.log("✅ Page created with ID:", page.id);

    // Link page to item
    await prisma.collectionItem.update({
      where: { id: sparkItem.id },
      data: { pageId: page.id },
    });

    console.log("✅ Successfully restored the-spark page!");
    console.log("   Page URL: /projects/the-spark");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreSparkPage();
