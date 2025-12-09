
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting migration of blocks to i18n structure...');
  
  const blocks = await prisma.block.findMany();
  let migratedCount = 0;

  for (const block of blocks) {
    const content = block.content as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Check if content is already localized (has 'en' or 'ar' keys)
    if (content && (content.en || content.ar)) {
      console.log(`Block ${block.id} already has localized structure. Skipping.`);
      continue;
    }

    // Wrap existing content in 'en' key
    const newContent = {
      en: content,
      ar: content // Optionally clone to 'ar' or leave empty/fallback
    };

    await prisma.block.update({
      where: { id: block.id },
      data: { content: newContent }
    });
    
    migratedCount++;
    console.log(`Migrated block ${block.id}`);
  }

  console.log(`Migration complete. Migrated ${migratedCount} blocks.`);
}

migrate()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
