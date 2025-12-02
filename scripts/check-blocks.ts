import { prisma } from "../lib/prisma";

async function checkBlocks() {
  const blocks = await prisma.block.findMany({
    where: { type: "ABOUT" },
    select: { id: true, name: true, variant: true, content: true },
  });
  
  console.log(JSON.stringify(blocks, null, 2));
  await prisma.$disconnect();
}

checkBlocks();
