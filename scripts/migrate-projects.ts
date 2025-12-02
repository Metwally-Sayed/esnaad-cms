
import { BlockType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projectsCollection = await prisma.collection.findUnique({
    where: { slug: "projects" },
    include: { items: { include: { page: { include: { blocks: true } } } } }
  });

  if (!projectsCollection) {
    console.log("No 'projects' collection found.");
    return;
  }

  console.log(`Found 'projects' collection. Migrating ${projectsCollection.items.length} items...`);

  for (const item of projectsCollection.items) {
    if (!item.page) {
      console.log(`Item ${item.id} has no page. Skipping.`);
      continue;
    }

    if (item.page.blocks.length > 0) {
      console.log(`Item ${item.id} already has blocks. Skipping.`);
      continue;
    }

    console.log(`Migrating item ${item.id}...`);

    // Create the block
    const block = await prisma.block.create({
      data: {
        name: "Project Details",
        type: "PROJECT_DETAILS" as BlockType,
        content: item.content as any,
        isGlobal: false,
      }
    });

    // Link block to page
    await prisma.pageBlock.create({
      data: {
        pageId: item.page.id,
        blockId: block.id,
        order: 0,
      }
    });

    console.log(`Migrated item ${item.id}.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
