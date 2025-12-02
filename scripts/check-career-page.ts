import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    where: {
      OR: [
        { slug: "career" },
        { slug: "careers" },
        { title: { contains: "Career" } }
      ]
    },
    include: {
      blocks: {
        include: {
          block: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  console.log("Found pages:", JSON.stringify(pages, null, 2));

  const blocks = await prisma.block.findMany({
    where: {
      type: "HERO",
      name: { contains: "Career" }
    }
  });
  console.log("Found potential career hero blocks:", JSON.stringify(blocks, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
