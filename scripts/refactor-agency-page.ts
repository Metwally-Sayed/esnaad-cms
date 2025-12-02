
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Refactoring Agency Registration page...");

  // 1. Find the page
  const page = await prisma.page.findUnique({
    where: { slug: "/agency-register" },
    include: { blocks: true },
  });

  if (!page) {
    console.error("Page not found!");
    process.exit(1);
  }

  // 2. Create the Hero Block
  const heroContent = {
    title: "AGENCY REGISTRATION",
    subtitle: "WELCOME TO THE REAL ESTATE BROKERAGE REGISTRATION PORTAL",
    backgroundColor: "#f8f6f4", // Light background similar to screenshot
    textColor: "#111111",
    textAlign: "center",
  };

  const heroBlock = await prisma.block.create({
    data: {
      name: "Agency Registration Hero",
      type: "HERO",
      variant: "hero-minimal-text",
      content: heroContent,
      isGlobal: false,
    },
  });

  console.log(`Created Hero block with ID: ${heroBlock.id}`);

  // 3. Update the existing Form Block (remove title/subtitle from content if desired, though component ignores them now)
  // We need to find the form block ID.
  const formPageBlock = page.blocks.find(pb => pb.order === 0); // Assuming it was order 0
  
  if (formPageBlock) {
    // Update the form block content to remove title/subtitle to keep DB clean
    const formBlock = await prisma.block.findUnique({ where: { id: formPageBlock.blockId } });
    if (formBlock) {
      const newContent = { ...(formBlock.content as object) };
      // @ts-ignore
      delete newContent.title;
      // @ts-ignore
      delete newContent.subtitle;
      
      await prisma.block.update({
        where: { id: formBlock.id },
        data: { content: newContent },
      });
      console.log("Updated Form block content.");
    }

    // Update order of form block to 1
    await prisma.pageBlock.update({
      where: {
        pageId_order: {
          pageId: page.id,
          order: 0,
        },
      },
      data: {
        order: 1,
      },
    });
    console.log("Updated Form block order to 1.");
  }

  // 4. Link Hero Block to Page at order 0
  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: heroBlock.id,
      order: 0,
    },
  });

  console.log("Linked Hero block to page at order 0.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
