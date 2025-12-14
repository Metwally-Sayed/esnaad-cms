import { prisma } from "../lib/prisma";

async function main() {
  const page = await prisma.page.findFirst({
    where: { slug: "/media-center" },
    include: {
      blocks: {
        include: { block: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const mediaGridBlock = page?.blocks.find(
    (pb) => pb.block.variant === "media-grid"
  );
  const content = mediaGridBlock?.block.content as any;

  console.log("AR content:", JSON.stringify(content.ar, null, 2));
  console.log("\nEN content:", JSON.stringify(content.en, null, 2));

  await prisma.$disconnect();
}

main();
