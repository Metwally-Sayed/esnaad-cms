import prisma from "../lib/prisma";

async function checkCollectionFields() {
  try {
    console.log("🔍 Checking all collection fields...\n");

    const collections = await prisma.collection.findMany({
      orderBy: { name: 'asc' },
    });

    for (const collection of collections) {
      console.log(`📦 ${collection.name} (${collection.slug})`);
      console.log("=" .repeat(50));

      if (collection.fields && Array.isArray(collection.fields)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fields = collection.fields as any[];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fields.forEach((field: any, index: number) => {
          console.log(`${index + 1}. ${field.key}`);
          console.log(`   Type: ${field.type}`);
          console.log(`   Required: ${field.required || false}`);
          console.log(`   Description: ${field.description || 'N/A'}`);
          console.log();
        });
      } else {
        console.log("No fields defined\n");
      }
      console.log();
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCollectionFields();
