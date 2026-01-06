// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the collection item
  const collection = await prisma.collection.findFirst({
    where: { slug: 'projects' },
    include: { items: true }
  });

  if (!collection) {
    console.log('❌ Projects collection not found');
    return;
  }

  const sparkItem = collection.items.find(item => {
    const content = item.content;
    return content.en?.slug === 'the-spark' || content.ar?.slug === 'the-spark';
  });

  if (!sparkItem) {
    console.log('❌ The Spark collection item not found');
    return;
  }

  // Find the page
  const page = await prisma.page.findUnique({
    where: { slug: '/projects/the-spark' }
  });

  if (!page) {
    console.log('❌ The Spark page not found');
    return;
  }

  console.log('🔗 Linking:');
  console.log('  Collection Item ID:', sparkItem.id);
  console.log('  Page ID:', page.id);

  // Link them
  await prisma.collectionItem.update({
    where: { id: sparkItem.id },
    data: { pageId: page.id }
  });

  // Also publish the page
  await prisma.page.update({
    where: { id: page.id },
    data: { published: true }
  });

  console.log('✅ Successfully linked collection item to page and published it!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
