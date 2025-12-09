/**
 * Script to fix the About Us parent link to not navigate
 * Run with: npx tsx scripts/fix-about-us-navigation.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Fixing About Us navigation...");

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

  // Update it to use "#" instead of a real URL
  await prisma.headerLink.update({
    where: { id: aboutUsParent.id },
    data: { slug: "#" },
  });

  console.log("✅ Updated 'About Us' parent link to use '#'");
  console.log("\nNow clicking 'About Us' will only expand/collapse the submenu without navigating!");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
