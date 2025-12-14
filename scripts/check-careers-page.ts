
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    where: {
      slug: {
        endsWith: 'careers' // Using endsWith to catch /careers or /ar/careers if slug is stored that way
      }
    },
    include: {
      blocks: {
        include: {
          block: true
        }
      }
    }
  });

  console.log(`Found ${pages.length} pages matching 'careers'.`);

  for (const page of pages) {
    console.log(`\n--- Page ID: ${page.id} | Slug: ${page.slug} ---`);
    for (const pb of page.blocks) {
      console.log(`Block: ${pb.block.name} (Type: ${pb.block.type})`);
      const content = pb.block.content;
      console.log(`Keys: ${Object.keys(content)}`);
      if (content.ar) {
        console.log(`AR Title: ${(content.ar as any).title}`);
        console.log(`AR First Field:`, (content.ar as any).fields?.[0]?.label);
      } else {
        console.log("No AR content found.");
      }
      if (content.en) {
        console.log(`EN Title: ${(content.en as any).title}`);
      }
    }
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
