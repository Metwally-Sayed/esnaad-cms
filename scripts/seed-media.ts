/**
 * Script to seed the Media collection with data from media-center page
 * Run with: npx tsx scripts/seed-media.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding Media collection...\n");

  // Clear existing media data
  const deleteResult = await prisma.media.deleteMany({});
  console.log(`✓ Cleared ${deleteResult.count} existing media items\n`);

  // Seed data from Media Grid (categories)
  const mediaGridItems = [
    {
      nameEn: "Updates",
      nameAr: "التحديثات",
      descriptionEn: null,
      descriptionAr: null,
      slug: "updates",
      type: "category",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop",
      order: 0,
    },
    {
      nameEn: "Insights",
      nameAr: "الرؤى",
      descriptionEn: null,
      descriptionAr: null,
      slug: "insights",
      type: "category",
      image:
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=1000&fit=crop",
      order: 1,
    },
    {
      nameEn: "News",
      nameAr: "الأخبار",
      descriptionEn: null,
      descriptionAr: null,
      slug: "news",
      type: "category",
      image:
        "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=1000&fit=crop",
      order: 2,
    },
  ];

  // Seed data from Industry Update (articles/news)
  const industryUpdateItems = [
    {
      nameEn: "Khaleej Times",
      nameAr: "خليج تايمز",
      descriptionEn: "Dubai's property market enters a phase of selective growth",
      descriptionAr: "سوق العقارات في دبي يدخل مرحلة نمو انتقائي",
      slug: "dubai-property-market-selective-growth",
      type: "article",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
      order: 3,
    },
    {
      nameEn: "Gulf Economist",
      nameAr: "الخليج الاقتصادي",
      descriptionEn: "Why dubai real estate valuations may grow for decades",
      descriptionAr: "لماذا قد تنمو تقييمات العقارات في دبي لعقود",
      slug: "dubai-real-estate-valuations-growth",
      type: "article",
      image:
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop",
      order: 4,
    },
    {
      nameEn: "Elite Agent",
      nameAr: "إيليت إيجنت",
      descriptionEn:
        "Dubai property market breaks records AED 170.7 billion in Q3 Sales",
      descriptionAr:
        "سوق العقارات في دبي يحطم الأرقام القياسية 170.7 مليار درهم في مبيعات الربع الثالث",
      slug: "dubai-property-market-breaks-records",
      type: "article",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      order: 5,
    },
  ];

  // Combine all items
  const allMediaItems = [...mediaGridItems, ...industryUpdateItems];

  // Insert all media items
  for (const item of allMediaItems) {
    const media = await prisma.media.create({
      data: item,
    });
    console.log(
      `✓ Created media: ${media.nameEn} (${media.type}) - ${media.slug}`
    );
  }

  console.log("\n✅ Media collection seeded successfully!");
  console.log(`\nTotal items created: ${allMediaItems.length}`);
  console.log(`- Categories: ${mediaGridItems.length}`);
  console.log(`- Articles: ${industryUpdateItems.length}`);
  console.log("\nYou can now filter media by type:");
  console.log("- type: 'category' - Media categories (Updates, Insights, News)");
  console.log("- type: 'article' - Industry news articles");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
