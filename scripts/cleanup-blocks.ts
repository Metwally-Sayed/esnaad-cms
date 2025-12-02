import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const datasourceUrl = process.env.DATABASE_URL;
if (!datasourceUrl) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning non-hero blocks...");

  const removableBlocks = await prisma.block.findMany({
    where: {
      NOT: {
        type: "HERO",
      },
    },
    select: {
      id: true,
    },
  });

  if (!removableBlocks.length) {
    console.log("No non-hero blocks found. Nothing to delete.");
    return;
  }

  const removableIds = removableBlocks.map((block) => block.id);

  const deletedPageBlocks = await prisma.pageBlock.deleteMany({
    where: {
      blockId: {
        in: removableIds,
      },
    },
  });

  const deletedBlocks = await prisma.block.deleteMany({
    where: {
      id: {
        in: removableIds,
      },
    },
  });

  console.log(`Removed ${deletedPageBlocks.count} page-block links.`);
  console.log(`Removed ${deletedBlocks.count} blocks (kept hero blocks intact).`);
}

main()
  .catch((error) => {
    console.error("Error cleaning blocks:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";
}
