import prisma from "../lib/prisma";

async function checkProjectsCollection() {
  try {
    console.log("🔍 Checking Projects collection...\n");

    const projectsCollection = await prisma.collection.findUnique({
      where: { slug: "projects" },
      include: {
        items: {
          include: {
            page: true,
          },
        },
      },
    });

    if (!projectsCollection) {
      console.error("❌ Projects collection not found");
      return;
    }

    console.log("📋 Collection Details:");
    console.log("  Name:", projectsCollection.name);
    console.log("  Slug:", projectsCollection.slug);
    console.log("  Has Profile Pages:", projectsCollection.hasProfilePages);
    console.log("  Profile Page Pattern:", projectsCollection.profilePageSlugPattern);
    console.log("  Fields:", projectsCollection.fields);
    console.log("\n📦 Collection Items:");

    for (const item of projectsCollection.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content = item.content as any;
      const itemData = content.en || content.ar || content;

      console.log(`\n  Item ID: ${item.id}`);
      console.log(`    Slug: ${itemData.slug || 'N/A'}`);
      console.log(`    Title: ${itemData.title || 'N/A'}`);
      console.log(`    Has Page: ${!!item.pageId}`);
      if (item.page) {
        console.log(`    Page Slug: ${item.page.slug}`);
        console.log(`    Page Title: ${item.page.title}`);
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjectsCollection();
