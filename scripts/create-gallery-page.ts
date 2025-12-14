import prisma from "../lib/prisma";

async function main() {
  console.log("🎨 Creating /gallery page...");

  // Get the media collection
  const mediaCollection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (!mediaCollection) {
    throw new Error("Media collection not found");
  }

  // Check if page already exists
  const existing = await prisma.page.findUnique({
    where: { slug: "/gallery" },
  });

  if (existing) {
    console.log("✅ /gallery page already exists");
    return;
  }

  // Create the page with a MEDIA_CARDS block
  const page = await prisma.page.create({
    data: {
      title: "Gallery",
      slug: "/gallery",
      description: "Media gallery with filtering",
      published: true,
      blocks: {
        create: {
          order: 0,
          block: {
            create: {
              name: "Media Gallery Grid",
              type: "MEDIA_CARDS",
              variant: "media-cards-standard",
              content: {
                en: {
                  collectionId: mediaCollection.id,
                  sortBy: "updatedAt",
                  limit: 0,
                  showFilters: true,
                },
                ar: {
                  collectionId: mediaCollection.id,
                  sortBy: "updatedAt",
                  limit: 0,
                  showFilters: true,
                },
              },
              isGlobal: false,
            },
          },
        },
      },
    },
  });

  console.log("✅ Created /gallery page:", page.id);
  console.log("🔗 Visit: http://localhost:3000/en/gallery");
  console.log("🔗 Visit with filter: http://localhost:3000/en/gallery?type=article");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
