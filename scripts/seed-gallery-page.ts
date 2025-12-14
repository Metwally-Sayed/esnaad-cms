/**
 * Script to create the gallery/media center page
 * Run with: npx tsx scripts/seed-gallery-page.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Creating gallery/media center page...\n");

  // Check if page already exists
  let page = await prisma.page.findUnique({
    where: { slug: "/media-center" },
  });

  if (page) {
    console.log("✓ Page already exists, deleting old blocks...");
    await prisma.pageBlock.deleteMany({
      where: { pageId: page.id },
    });
  } else {
    // Create the page
    page = await prisma.page.create({
      data: {
        title: "Media Center",
        slug: "/media-center",
        description: "Stay updated with our latest media coverage and industry insights",
        published: true,
      },
    });
    console.log("✓ Created page:", page.title);
  }

  // Create Block 1: Media Hero
  const heroBlock = await prisma.block.create({
    data: {
      name: "Media Center Hero",
      type: "GALLERY",
      variant: "media-hero",
      isGlobal: false,
      content: {
        en: {
          title: "MEDIA CENTER",
          subtitle: "WHAT THEY SAY ABOUT US",
        },
        ar: {
          title: "المركز الإعلامي",
          subtitle: "ماذا يقولون عنا",
        },
      },
    },
  });

  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: heroBlock.id,
      order: 0,
    },
  });
  console.log("✓ Created media hero block");

  // Create Block 2: Media Grid (Updates, Insights, News)
  const gridBlock = await prisma.block.create({
    data: {
      name: "Media Categories Grid",
      type: "GALLERY",
      variant: "media-grid",
      isGlobal: false,
      content: {
        en: {
          items: [
            {
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop",
              label: "UPDATES",
              link: "#updates",
            },
            {
              image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=1000&fit=crop",
              label: "INSIGHTS",
              link: "#insights",
            },
            {
              image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=1000&fit=crop",
              label: "NEWS",
              link: "#news",
            },
          ],
        },
        ar: {
          items: [
            {
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop",
              label: "التحديثات",
              link: "#updates",
            },
            {
              image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=1000&fit=crop",
              label: "الرؤى",
              link: "#insights",
            },
            {
              image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=1000&fit=crop",
              label: "الأخبار",
              link: "#news",
            },
          ],
        },
      },
    },
  });

  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: gridBlock.id,
      order: 1,
    },
  });
  console.log("✓ Created media grid block");

  // Create Block 3: Industry Update
  const industryBlock = await prisma.block.create({
    data: {
      name: "Industry Updates Section",
      type: "GALLERY",
      variant: "industry-update",
      isGlobal: false,
      content: {
        en: {
          sectionTitle: "INDUSTRY UPDATE",
          items: [
            {
              image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
              title: "Khaleej Times",
              description: "Dubai's property market enters a phase of selective growth",
              link: "#",
            },
            {
              image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop",
              title: "Gulf Economist",
              description: "Why dubai real estate valuations may grow for decades",
              link: "#",
            },
            {
              image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
              title: "Elite Agent",
              description: "Dubai property market breaks records AED 170.7 billion in Q3 Sales",
              link: "#",
            },
          ],
        },
        ar: {
          sectionTitle: "تحديث الصناعة",
          items: [
            {
              image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
              title: "خليج تايمز",
              description: "سوق العقارات في دبي يدخل مرحلة نمو انتقائي",
              link: "#",
            },
            {
              image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop",
              title: "الخليج الاقتصادي",
              description: "لماذا قد تنمو تقييمات العقارات في دبي لعقود",
              link: "#",
            },
            {
              image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
              title: "إيليت إيجنت",
              description: "سوق العقارات في دبي يحطم الأرقام القياسية 170.7 مليار درهم في مبيعات الربع الثالث",
              link: "#",
            },
          ],
        },
      },
    },
  });

  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: industryBlock.id,
      order: 2,
    },
  });
  console.log("✓ Created industry update block");

  console.log("\n✅ Gallery page created successfully!");
  console.log(`\nPage URL: /media-center`);
  console.log("\nBlocks created:");
  console.log("1. Media Center Hero (media-hero)");
  console.log("2. Media Categories Grid (media-grid)");
  console.log("3. Industry Updates Section (industry-update)");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
