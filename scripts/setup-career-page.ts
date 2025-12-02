import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Setting up Career page...");

  // 1. Create or Update Page
  const page = await prisma.page.upsert({
    where: { slug: "careers" },
    update: {},
    create: {
      title: "Careers",
      slug: "careers",
      published: true,
      description: "Join our team",
    },
  });

  console.log(`✅ Page 'Careers' (id: ${page.id}) ready.`);

  // 2. Cleanup existing blocks for this page to avoid clutter
  const existingPageBlocks = await prisma.pageBlock.findMany({
    where: { pageId: page.id },
    include: { block: true }
  });
  
  for (const pb of existingPageBlocks) {
    await prisma.block.delete({ where: { id: pb.blockId } });
  }
  await prisma.pageBlock.deleteMany({ where: { pageId: page.id } });
  console.log("✅ Cleared existing blocks for Career page.");

  // 3. Create Hero Block
  const heroBlock = await prisma.block.create({
    data: {
      name: "Career Hero",
      type: "HERO",
      variant: "hero-minimal-text",
      content: {
        title: "CAREERS DEVELOPMENT CENTER",
        subtitle: "JOIN US ON OUR JOURNEY OF INNOVATION AND EXCELLENCE.",
        backgroundColor: "#F8F8F8", // Off-white background
        textColor: "#1A1A1A", // Dark text
        textAlign: "center"
      },
    },
  });
  console.log(`✅ Hero Block created (id: ${heroBlock.id}).`);

  // 4. Create Form Block
  const formBlock = await prisma.block.create({
    data: {
      name: "Career Application Form",
      type: "FORM",
      variant: "default",
      content: {},
    },
  });
  console.log(`✅ Form Block created (id: ${formBlock.id}).`);

  // 5. Link Blocks to Page
  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: heroBlock.id,
      order: 0,
    },
  });

  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: formBlock.id,
      order: 1,
    },
  });

  console.log("✅ Blocks linked to page.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
