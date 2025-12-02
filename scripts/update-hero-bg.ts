import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating Agency Registration hero block background...");

  // Find the page
  const page = await prisma.page.findUnique({
    where: { slug: "/agency-register" },
    include: { blocks: { include: { block: true }, orderBy: { order: 'asc' } } },
  });

  if (!page) {
    console.error("Page not found!");
    process.exit(1);
  }

  // Find the hero block (should be order 0)
  const heroPageBlock = page.blocks.find(pb => pb.order === 0);
  
  if (!heroPageBlock || heroPageBlock.block.type !== "HERO") {
    console.error("Hero block not found!");
    process.exit(1);
  }

  // Update the hero block to remove custom background color
  // This will make it use the default bg-background like the form
  const currentContent = heroPageBlock.block.content as any;
  const updatedContent = {
    ...currentContent,
    customColors: false, // Disable custom colors
    backgroundColor: undefined,
    textColor: undefined,
  };

  await prisma.block.update({
    where: { id: heroPageBlock.block.id },
    data: { content: updatedContent },
  });

  console.log("Updated hero block to use default background color.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
