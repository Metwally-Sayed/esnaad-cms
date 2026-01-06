import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating media collection...");

  // Check if media collection already exists
  const existing = await prisma.collection.findUnique({
    where: { slug: "media" },
  });

  if (existing) {
    console.log("✅ Media collection already exists:", existing.id);
    return;
  }

  // Create media collection
  const collection = await prisma.collection.create({
    data: {
      name: "Media",
      slug: "media",
      hasProfilePages: true,
      profilePageSlug: "/media",
    },
  });

  console.log("✅ Created media collection:", collection.id);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
