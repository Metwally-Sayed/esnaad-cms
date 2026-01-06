import prisma from "../lib/prisma";

async function checkHomePageBlocks() {
  try {
    console.log("🔍 Checking home page blocks...\n");

    const homePage = await prisma.page.findUnique({
      where: { slug: "/" },
      include: {
        blocks: {
          include: {
            block: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!homePage) {
      console.error("❌ Home page not found");
      return;
    }

    console.log("✅ Found home page:", homePage.title);
    console.log(`   Blocks: ${homePage.blocks.length}\n`);

    for (const pageBlock of homePage.blocks) {
      const block = pageBlock.block;
      console.log(`📦 Block: ${block.name}`);
      console.log(`   Type: ${block.type}`);
      console.log(`   Variant: ${block.variant || 'default'}`);
      console.log(`   Content structure:`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content = block.content as any;

      if (content.en || content.ar) {
        console.log(`   ✅ Localized structure detected`);

        if (content.en) {
          console.log(`   EN keys: ${Object.keys(content.en).join(', ')}`);
          if (content.en.mediaUrl) console.log(`      EN mediaUrl: ${content.en.mediaUrl}`);
          if (content.en.videoUrl) console.log(`      EN videoUrl: ${content.en.videoUrl}`);
        }

        if (content.ar) {
          console.log(`   AR keys: ${Object.keys(content.ar).join(', ')}`);
          if (content.ar.mediaUrl) console.log(`      AR mediaUrl: ${content.ar.mediaUrl}`);
          if (content.ar.videoUrl) console.log(`      AR videoUrl: ${content.ar.videoUrl}`);
        }
      } else {
        console.log(`   ⚠️  Legacy flat structure`);
        console.log(`   Keys: ${Object.keys(content).join(', ')}`);
      }

      console.log();
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHomePageBlocks();
