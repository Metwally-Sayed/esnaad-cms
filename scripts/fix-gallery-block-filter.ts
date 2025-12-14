import prisma from "../lib/prisma";

async function fixGalleryBlock() {
  console.log("🔧 Fixing gallery page block...\n");

  const page = await prisma.page.findFirst({
    where: { slug: "/gallery" },
    include: {
      blocks: {
        include: { block: true },
      },
    },
  });

  if (!page || page.blocks.length === 0) {
    console.log("❌ Gallery page or block not found");
    return;
  }

  const block = page.blocks[0].block;
  const content = block.content as any;

  console.log("Current content:", JSON.stringify(content, null, 2));
  console.log("");
  console.log('Issue: filterType is set to "category" which filters out all posts!');
  console.log("");

  // Remove filterType or set to empty string
  const newContent = {
    ...content,
    filterType: "", // Empty string = no filter
  };

  await prisma.block.update({
    where: { id: block.id },
    data: { content: newContent },
  });

  console.log("✅ Fixed! Updated content:", JSON.stringify(newContent, null, 2));
  console.log("");
  console.log("Now /en/gallery will show all posts!");
}

fixGalleryBlock()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
