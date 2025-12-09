/**
 * Script to recreate the navigation structure correctly
 * Run with: npx tsx scripts/recreate-navigation.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Recreating navigation structure...");

  // Get or create a header
  let header = await prisma.header.findFirst();

  if (!header) {
    header = await prisma.header.create({
      data: { name: "Main Header" },
    });
    console.log("✓ Created new header:", header.name);
  } else {
    console.log("✓ Using existing header:", header.name);
  }

  // Delete ALL existing links
  await prisma.headerLink.deleteMany({
    where: { headerId: header.id },
  });
  console.log("✓ Cleared all existing links");

  // Create root-level links (excluding About Us for now)
  const rootLinks = [
    { name: "Home", slug: "/", order: 0 },
    { name: "Developments", slug: "/developments", order: 1 },
    { name: "Blogs", slug: "/blogs", order: 3 },
    { name: "Agency Registration", slug: "/agency-register", order: 4 },
    { name: "Careers", slug: "/careers", order: 5 },
    { name: "Contact Us", slug: "/contact-us", order: 6 },
  ];

  for (const link of rootLinks) {
    await prisma.headerLink.create({
      data: {
        name: link.name,
        slug: link.slug,
        order: link.order,
        headerId: header.id,
      },
    });
  }
  console.log("✓ Created root-level links");

  // Create "About Us" parent with # (no navigation, just dropdown)
  const aboutUsParent = await prisma.headerLink.create({
    data: {
      name: "About Us",
      slug: "#",
      order: 2,
      headerId: header.id,
    },
  });
  console.log("✓ Created 'About Us' parent link (slug: #)");

  // Create ONLY "Our Vision" as a child
  await prisma.headerLink.create({
    data: {
      name: "Our Vision",
      slug: "/our-vision",
      order: 0,
      headerId: header.id,
      parentId: aboutUsParent.id,
    },
  });

  // Create "About Us" page as a separate child
  await prisma.headerLink.create({
    data: {
      name: "Who We Are",
      slug: "/about-us",
      order: 1,
      headerId: header.id,
      parentId: aboutUsParent.id,
    },
  });

  console.log("✓ Created child links: 'Our Vision' and 'Who We Are'");

  console.log("\n✅ Navigation structure recreated successfully!");
  console.log("\nFinal structure:");
  console.log("- Home (/)");
  console.log("- Developments (/developments)");
  console.log("- About Us (#) ⬇ [Click to expand, doesn't navigate]");
  console.log("  └─ Our Vision (/our-vision)");
  console.log("  └─ Who We Are (/about-us)");
  console.log("- Blogs (/blogs)");
  console.log("- Agency Registration (/agency-register)");
  console.log("- Careers (/careers)");
  console.log("- Contact Us (/contact-us)");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
