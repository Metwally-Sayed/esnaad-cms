import prisma from "../lib/prisma";

async function main() {
  console.log("🔍 Finding 'the-spark' project...");

  // Find the Projects collection
  const projectsCollection = await prisma.collection.findFirst({
    where: { slug: "projects" },
    include: { items: true }
  });

  if (!projectsCollection) {
    console.error("❌ Projects collection not found");
    return;
  }

  console.log(`✅ Found collection: ${projectsCollection.name}`);

  // Find "the-spark" item
  const sparkItem = projectsCollection.items.find(item => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = item.content as any;
    const enContent = content?.en || content;
    return enContent?.slug === "the-spark" || enContent?.title?.toLowerCase().includes("spark");
  });

  if (!sparkItem) {
    console.error("❌ 'the-spark' project not found");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log("Available items:", projectsCollection.items.map((item: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content = item.content as any;
      const enContent = content?.en || content;
      return enContent?.title || enContent?.slug || "Untitled";
    }));
    return;
  }

  console.log(`✅ Found project: ${sparkItem.id}`);

  // Sample units data
  const sampleUnits = [
    {
      type: "Studio",
      size: "450 sq ft",
      bathrooms: "1",
      price: "AED 650K",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      features: ["Open Kitchen", "City View", "Built-in Wardrobes"]
    },
    {
      type: "1 Bedroom",
      size: "750 sq ft",
      bathrooms: "1",
      price: "AED 1.2M",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      features: ["Balcony", "En-suite Bathroom", "Built-in Wardrobes", "Modern Kitchen"]
    },
    {
      type: "2 Bedroom",
      size: "1,100 sq ft",
      bathrooms: "2",
      price: "AED 1.8M",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      features: ["Large Balcony", "Master Bedroom with En-suite", "Guest Bathroom", "Spacious Living Area", "Premium Finishes"]
    },
    {
      type: "3 Bedroom",
      size: "1,500 sq ft",
      bathrooms: "3",
      price: "AED 2.5M",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      features: ["Panoramic Views", "Master Suite", "Maid's Room", "Study Room", "Luxury Kitchen", "Multiple Balconies"]
    }
  ];

  // Get current content
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentContent = sparkItem.content as any;
  const enContent = currentContent?.en || currentContent;
  const arContent = currentContent?.ar || currentContent;

  // Update with units data
  const updatedEnContent = {
    ...enContent,
    unitsTitle: "Available Units",
    unitsSubtitle: "Choose from our selection of thoughtfully designed residences",
    units: JSON.stringify(sampleUnits, null, 2)
  };

  const updatedArContent = {
    ...arContent,
    unitsTitle: "الوحدات المتاحة",
    unitsSubtitle: "اختر من مجموعتنا من الوحدات السكنية المصممة بعناية",
    units: JSON.stringify(sampleUnits, null, 2)
  };

  const updatedContent = {
    en: updatedEnContent,
    ar: updatedArContent
  };

  console.log("📝 Updating collection item with units data...");

  await prisma.collectionItem.update({
    where: { id: sparkItem.id },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: updatedContent as any
    }
  });

  console.log("✅ Successfully added units to 'the-spark' project!");
  console.log(`📊 Added ${sampleUnits.length} unit types`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
