/**
 * Script to set up nested navigation for testing
 * Run with: npx tsx scripts/setup-nested-navigation.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Setting up nested navigation...");

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

  // Delete existing links
  await prisma.headerLink.deleteMany({
    where: { headerId: header.id },
  });
  console.log("✓ Cleared existing links");

  // Create the navigation structure
  const links = [
    { name: "Home", slug: "/", order: 0 },
    { name: "Developments", slug: "/developments", order: 1 },
    { name: "Blogs", slug: "/blogs", order: 3 },
    { name: "Agency Registration", slug: "/agency-register", order: 4 },
    { name: "Careers", slug: "/careers", order: 5 },
    { name: "Contact Us", slug: "/contact-us", order: 6 },
  ];

  // Create root-level links
  for (const link of links) {
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

  // Create "About Us" parent with children
  const aboutUsParent = await prisma.headerLink.create({
    data: {
      name: "About Us",
      slug: "/about-us",
      order: 2,
      headerId: header.id,
    },
  });
  console.log("✓ Created 'About Us' parent link");

  // Create children for "About Us"
  await prisma.headerLink.create({
    data: {
      name: "Our Vision",
      slug: "/our-vision",
      order: 0,
      headerId: header.id,
      parentId: aboutUsParent.id,
    },
  });

  await prisma.headerLink.create({
    data: {
      name: "About Us",
      slug: "/about-us",
      order: 1,
      headerId: header.id,
      parentId: aboutUsParent.id,
    },
  });
  console.log("✓ Created child links for 'About Us'");

  // Set as global header if not already set
  const globalSettings = await prisma.globalSettings.findUnique({
    where: { id: "global" },
  });

  if (!globalSettings?.defaultHeaderId) {
    await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: { defaultHeaderId: header.id },
      create: {
        id: "global",
        siteName: "Esnaad CMS",
        defaultHeaderId: header.id,
      },
    });
    console.log("✓ Set as global header");
  }

  console.log("\n✅ Nested navigation setup complete!");
  console.log("\nNavigation structure:");
  console.log("- Home (/)");
  console.log("- Developments (/developments)");
  console.log("- About Us (/about-us) ⬇");
  console.log("  └─ Our Vision (/our-vision)");
  console.log("  └─ About Us (/about-us)");
  console.log("- Blogs (/blogs)");
  console.log("- Agency Registration (/agency-register)");
  console.log("- Careers (/careers)");
  console.log("- Contact Us (/contact-us)");
  console.log("\nVisit your site and click the menu button to see the nested navigation!");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
