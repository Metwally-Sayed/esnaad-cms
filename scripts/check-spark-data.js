// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const collection = await prisma.collection.findFirst({
    where: { slug: 'projects' },
    include: {
      items: {
        include: {
          page: true
        }
      }
    }
  });

  if (!collection) {
    console.log('❌ No projects collection found');
    return;
  }

  console.log('✅ Projects collection found:', collection.name);
  console.log('📦 Items count:', collection.items.length);

  const sparkItem = collection.items.find(item => {
    const content = item.content;
    if (content.en?.slug === 'the-spark' || content.ar?.slug === 'the-spark') {
      return true;
    }
    return false;
  });

  if (!sparkItem) {
    console.log('❌ No "the-spark" item found');
    return;
  }

  console.log('\n🔍 The Spark Item:');
  console.log('ID:', sparkItem.id);
  console.log('Page ID:', sparkItem.pageId);
  console.log('\n📄 Content structure:');
  console.log(JSON.stringify(sparkItem.content, null, 2));

  if (sparkItem.page) {
    console.log('\n📖 Associated Page:');
    console.log('Slug:', sparkItem.page.slug);
    console.log('Title:', sparkItem.page.title);
    console.log('Published:', sparkItem.page.published);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
