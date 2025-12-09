/**
 * Script to remove duplicate About Us child link
 * Run with: npx tsx scripts/fix-duplicate-about-us.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Fixing duplicate About Us links...");

  // Find the "About Us" parent link (the one without a parentId)
  const aboutUsParent = await prisma.headerLink.findFirst({
    where: {
      name: "About Us",
      parentId: null,
    },
  });

  if (!aboutUsParent) {
    console.log("❌ About Us parent link not found");
    return;
  }

  console.log("✓ Found About Us parent link");

  // Delete the "About Us" child link (keep only "Our Vision")
  const deleted = await prisma.headerLink.deleteMany({
    where: {
      name: "About Us",
      parentId: aboutUsParent.id,
    },
  });

  console.log(`✓ Deleted ${deleted.count} duplicate 'About Us' child link(s)`);

  // List remaining children
  const children = await prisma.headerLink.findMany({
    where: { parentId: aboutUsParent.id },
    orderBy: { order: "asc" },
  });

  console.log("\n✅ Fixed! Children under 'About Us':");
  children.forEach((child) => {
    console.log(`  - ${child.name} (${child.slug})`);
  });

  console.log("\nNow 'About Us' will show only 'Our Vision' as a child!");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
