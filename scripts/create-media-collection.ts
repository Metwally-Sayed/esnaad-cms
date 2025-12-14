/**
 * Script to create the Media collection
 * Run with: npx tsx scripts/create-media-collection.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Creating Media collection...\n");

  // Check if collection already exists
  const existing = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (existing) {
    console.log("✓ Media collection already exists");
    console.log(`  ID: ${existing.id}`);
    console.log(`  Name: ${existing.name}`);
    return;
  }

  // Create the Media collection
  const collection = await prisma.collection.create({
    data: {
      name: "Media",
      slug: "media",
      hasProfilePages: false,
    },
  });

  console.log("✅ Media collection created successfully!");
  console.log(`  ID: ${collection.id}`);
  console.log(`  Name: ${collection.name}`);
  console.log(`  Slug: ${collection.slug}`);
  console.log("\nYou can now add media items to this collection.");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
