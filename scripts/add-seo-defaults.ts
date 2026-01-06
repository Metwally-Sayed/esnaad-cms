import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addSeoDefaults() {
  console.log("🔧 Adding SEO defaults to GlobalSettings...");

  try {
    // Update the existing global settings record with SEO defaults
    const updated = await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: {
        defaultOgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&h=630&q=80",
        defaultOgSiteName: "Esnaad",
        defaultOgLocale: "en_US",
        defaultTwitterSite: "@esnaadcms",
        defaultTwitterCreator: "@esnaadcms",
        defaultAuthor: "Esnaad Team",
        defaultRobots: "index,follow",
      },
      create: {
        id: "global",
        siteName: "Esnaad",
        siteDescription: "اسناد للتطوير العقاري: خبرة أكثر من 20 عاماً في بناء مجتمعات سكنية فاخرة في دبي، حيث تلتقي الأناقة بالجودة في كل مشروع.",
        defaultOgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&h=630&q=80",
        defaultOgSiteName: "Esnaad",
        defaultOgLocale: "en_US",
        defaultTwitterSite: "@esnaadcms",
        defaultTwitterCreator: "@esnaadcms",
        defaultAuthor: "Esnaad Team",
        defaultRobots: "index,follow",
      },
    });

    console.log("✅ SEO defaults added successfully!");
    console.log("📊 Current settings:", {
      defaultOgImage: updated.defaultOgImage,
      defaultOgSiteName: updated.defaultOgSiteName,
      defaultOgLocale: updated.defaultOgLocale,
      defaultTwitterSite: updated.defaultTwitterSite,
      defaultTwitterCreator: updated.defaultTwitterCreator,
      defaultAuthor: updated.defaultAuthor,
      defaultRobots: updated.defaultRobots,
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

addSeoDefaults()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
