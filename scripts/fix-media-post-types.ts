import prisma from "../lib/prisma";

/**
 * Migration script to update media posts with proper types
 * that match the category slugs (updates, insights, news)
 */
async function fixMediaPostTypes() {
  console.log("🔧 Fixing media post types...\n");

  // Get the media collection
  const collection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (!collection) {
    console.error("❌ Media collection not found");
    return;
  }

  // Get all items in the collection
  const items = await prisma.collectionItem.findMany({
    where: { collectionId: collection.id },
    orderBy: { order: "asc" },
  });

  console.log(`Found ${items.length} total items in media collection\n`);

  // Get posts (exclude categories)
  const posts = items.filter((item) => {
    const content = item.content as Record<string, unknown>;
    return (content.type as string) !== "category";
  });

  console.log(`Found ${posts.length} posts to update\n`);

  // Assign types to posts (you can customize this logic)
  // For demo: assign types in rotation (updates, insights, news)
  const availableTypes = ["updates", "insights", "news"];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const content = post.content as Record<string, unknown>;
    const newType = availableTypes[i % availableTypes.length];

    console.log(
      `Updating post "${content.nameEn}" from type="${content.type}" to type="${newType}"`
    );

    await prisma.collectionItem.update({
      where: { id: post.id },
      data: {
        content: {
          ...content,
          type: newType,
        },
      },
    });
  }

  console.log("\n✅ All posts updated successfully!");
  console.log("\n📊 Final distribution:");

  // Show final distribution
  const updatedItems = await prisma.collectionItem.findMany({
    where: { collectionId: collection.id },
  });

  const typeCounts = new Map<string, number>();
  updatedItems.forEach((item) => {
    const content = item.content as Record<string, unknown>;
    const type = (content.type as string) || "unknown";
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
  });

  typeCounts.forEach((count, type) => {
    console.log(`   ${type}: ${count} items`);
  });
}

fixMediaPostTypes()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
