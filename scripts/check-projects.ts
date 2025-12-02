
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projectsCollection = await prisma.collection.findUnique({
    where: { slug: "projects" },
    include: { items: { include: { page: { include: { blocks: true } } } } }
  });

  if (!projectsCollection) {
    console.log("No 'projects' collection found.");
    return;
  }

  console.log(`Found 'projects' collection. hasProfilePages: ${projectsCollection.hasProfilePages}`);
  console.log(`Total items: ${projectsCollection.items.length}`);

  for (const item of projectsCollection.items) {
    console.log(`Item: ${item.id}, Page: ${item.page?.id ? "Yes" : "No"}, Blocks: ${item.page?.blocks.length || 0}`);
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
