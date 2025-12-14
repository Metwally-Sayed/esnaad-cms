import prisma from "../lib/prisma";

async function inspectBlocks() {
  const blocks = await prisma.block.findMany({
    where: { type: "ABOUT" },
    take: 2,
  });

  console.log("Found", blocks.length, "About blocks\n");

  blocks.forEach((block) => {
    console.log("=".repeat(60));
    console.log("Block ID:", block.id);
    console.log("Name:", block.name);
    console.log("Type:", block.type);
    console.log("Variant:", block.variant);
    console.log("Content:", JSON.stringify(block.content, null, 2));
    console.log("\n");
  });

  await prisma.$disconnect();
}

inspectBlocks();
