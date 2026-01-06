// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if page exists with slug /projects/the-spark
  const page = await prisma.page.findUnique({
    where: { slug: '/projects/the-spark' },
    include: {
      collectionItem: true,
      blocks: true
    }
  });

  if (page) {
    console.log('✅ Page exists:', page.slug);
    console.log('Title:', page.title);
    console.log('Published:', page.published);
    console.log('Collection Item:', page.collectionItem ? 'Yes' : 'No');
    console.log('Blocks:', page.blocks.length);
  } else {
    console.log('❌ No page found with slug: /projects/the-spark');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
