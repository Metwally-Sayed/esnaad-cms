import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Philosophy Collection...");

  // 1. Create Collection
  const collection = await prisma.collection.upsert({
    where: { slug: "philosophy-items" },
    update: {},
    create: {
      name: "Philosophy Items",
      slug: "philosophy-items",
    },
  });

  console.log(`Created collection: ${collection.name} (${collection.id})`);

  // 2. Create Items
  const items = [
    {
      order: 1,
      content: {
        title: "EXCELLENCE",
        description:
          "The Spark by Esnaad is our flagship development in Meydan District 11, Dubai — a project that reflects our vision for contemporary, design-driven living. Rising B+G+5+R, the building offers a collection of one- and two-bedroom residences aimed to elevate beautiful living with precision and purpose.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // Building construction/modern
      },
    },
    {
      order: 2,
      content: {
        title: "SYNERGY",
        description:
          "We believe true luxury is not measured in square meters but in how spaces connect and support life. Some of our designs bring people together. Others carve quiet moments of pause. Both are built with the same intention: to place people first.",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop", // Pool/People
      },
    },
    {
      order: 3,
      content: {
        title: "QUALITY",
        description:
          "Quality is precision, in every cut, every surface, every transition. It is not excess, but discipline: details refined until they feel seamless, enduring, inevitable.",
        image: "https://images.unsplash.com/photo-1599696840553-3b450ed55400?q=80&w=2080&auto=format&fit=crop", // Stone/Texture
      },
    },
    {
      order: 4,
      content: {
        title: "DESIGN",
        description:
          "Design is our signature. It is detail drawn with precision, spaces carved with intention, experiences built to feel inevitable. We design for resonance, not for ornament.",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop", // Interior/Light
      },
    },
  ];

  // Delete existing items to avoid duplicates/mess
  await prisma.collectionItem.deleteMany({
    where: { collectionId: collection.id },
  });

  for (const item of items) {
    await prisma.collectionItem.create({
      data: {
        collectionId: collection.id,
        content: item.content,
        order: item.order,
      },
    });
  }

  console.log("Created collection items.");

  // 3. Create/Update Page with Block
  // Let's create a page /philosophy-demo
  const page = await prisma.page.upsert({
    where: { slug: "/philosophy-demo" },
    update: {},
    create: {
      title: "Philosophy Demo",
      slug: "/philosophy-demo",
      published: true,
    },
  });

  // Create the block
  const block = await prisma.block.create({
    data: {
      name: "Philosophy Section",
      type: "ABOUT",
      variant: "about-philosophy",
      content: {
        collectionId: collection.id,
        sectionTitle: "ESNAAD PHILOSOPHY",
        subtitle: "WHAT WE STAND FOR",
      },
    },
  });

  // Link block to page
  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: block.id,
      order: 0,
    },
  });

  console.log("Created demo page at /philosophy-demo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
