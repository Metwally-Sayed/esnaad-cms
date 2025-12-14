import prisma from "../lib/prisma";

async function updateIndustryUpdateBlock() {
  console.log("🔧 Updating Industry Update block configuration...\n");

  // Find the industry update block
  const block = await prisma.block.findFirst({
    where: {
      variant: "industry-update",
      type: "GALLERY",
    },
  });

  if (!block) {
    console.log("❌ Industry Update block not found");
    return;
  }

  console.log("Found block:", block.name);
  console.log("Current content:", JSON.stringify(block.content, null, 2));

  // Update the content to remove filterType and set proper config
  const currentContent = block.content as any;

  const newContent = {
    en: {
      sectionTitle: currentContent.en?.sectionTitle || "INDUSTRY UPDATE",
      sortBy: "updatedAt",
      limit: 3,
      collectionId:
        currentContent.en?.collectionId || currentContent.collectionId,
    },
    ar: {
      sectionTitle: currentContent.ar?.sectionTitle || "تحديث الصناعة",
      sortBy: "updatedAt",
      limit: 3,
      collectionId:
        currentContent.ar?.collectionId || currentContent.collectionId,
    },
  };

  await prisma.block.update({
    where: { id: block.id },
    data: { content: newContent },
  });

  console.log("\n✅ Block updated successfully!");
  console.log("New content:", JSON.stringify(newContent, null, 2));
  console.log("\nNow showing: Latest 3 posts (no type filtering)");
}

updateIndustryUpdateBlock()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
