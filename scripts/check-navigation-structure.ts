/**
 * Script to check current navigation structure
 * Run with: npx tsx scripts/check-navigation-structure.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Checking current navigation structure...\n");

  const header = await prisma.header.findFirst({
    include: {
      headerLinks: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          order: true,
          parentId: true,
          headerId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!header) {
    console.log("❌ No header found");
    return;
  }

  console.log(`Header: ${header.name}`);
  console.log("=".repeat(50));

  // Group by parent
  const rootLinks = header.headerLinks.filter((link) => !link.parentId);
  const childLinks = header.headerLinks.filter((link) => link.parentId);

  console.log("\nRoot Links:");
  rootLinks.forEach((link) => {
    const children = childLinks.filter((c) => c.parentId === link.id);
    console.log(`  ${link.order}. ${link.name} (${link.slug})`);
    if (children.length > 0) {
      console.log(`     ↳ Has ${children.length} children:`);
      children.forEach((child) => {
        console.log(`       - ${child.name} (${child.slug})`);
      });
    }
  });

  console.log("\n" + "=".repeat(50));
  console.log(`Total links: ${header.headerLinks.length}`);
  console.log(`Root links: ${rootLinks.length}`);
  console.log(`Child links: ${childLinks.length}`);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
