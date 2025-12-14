import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating agency registration page hero block...");

  // Find the agency-register page
  const agencyPage = await prisma.page.findFirst({
    where: {
      OR: [
        { slug: { contains: "agency" } },
        { slug: { contains: "register" } },
      ],
    },
    include: {
      blocks: {
        include: {
          block: true,
        },
      },
    },
  });

  if (!agencyPage) {
    console.log("Agency registration page not found");
    return;
  }

  console.log(`Found page: ${agencyPage.title} (${agencyPage.slug})`);
  console.log(`Blocks: ${agencyPage.blocks.length}`);

  // Find the hero block (not the form block)
  const heroPageBlock = agencyPage.blocks.find((pb) => pb.block.type === "HERO");

  if (!heroPageBlock) {
    console.log("Hero block not found");
    console.log("Available blocks:", agencyPage.blocks.map(pb => ({ type: pb.block.type, name: pb.block.name })));
    return;
  }

  const heroBlock = heroPageBlock.block;
  console.log(`Found hero block: ${heroBlock.id} (${heroBlock.name})`);

  // Get current content
  const content = heroBlock.content as any;

  console.log("Current content structure:", Object.keys(content));

  // Update English content
  if (!content.en) {
    content.en = {};
  }

  content.en = {
    ...content.en,
    title: "AGENCY REGISTRATION",
    subtitle: "WELCOME TO THE REAL ESTATE BROKERAGE REGISTRATION PORTAL",
  };

  // Update Arabic content
  if (!content.ar) {
    content.ar = {};
  }

  content.ar = {
    ...content.ar,
    title: "تسجيل الوكالة",
    subtitle: "مرحباً بكم في بوابة تسجيل الوساطة العقارية",
  };

  // Update the block
  await prisma.block.update({
    where: { id: heroBlock.id },
    data: { content },
  });

  console.log("\n✅ Hero block updated successfully!");
  console.log("\nArabic content:");
  console.log(`  Title: ${content.ar.title}`);
  console.log(`  Subtitle: ${content.ar.subtitle}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
