import prisma from "../lib/prisma";

async function checkAllCollections() {
  try {
    console.log("🔍 Checking all collections...\n");

    const collections = await prisma.collection.findMany({
      orderBy: { name: 'asc' },
    });

    console.log(`Found ${collections.length} collections:\n`);

    for (const collection of collections) {
      console.log(`📦 ${collection.name}`);
      console.log(`   Slug: ${collection.slug}`);
      console.log(`   Has Profile Pages: ${collection.hasProfilePages}`);
      console.log(`   Fields: ${collection.fields ? JSON.stringify(collection.fields).substring(0, 100) + '...' : 'None'}`);
      console.log();
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllCollections();
