import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.globalSettings.findUnique({
    where: { id: "global" },
  });

  console.log("GlobalSettings:", JSON.stringify(settings, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
