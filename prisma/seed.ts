import "dotenv/config";

import { BlockType, EnumTheme, PrismaClient } from "@prisma/client";
import seedSnapshot from "./seed-data.json";

const datasourceUrl = process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient();

type SeedSnapshot = typeof seedSnapshot;

const toDate = (value?: string | null) => (value ? new Date(value) : undefined);
const mapDates = <T extends { createdAt?: string; updatedAt?: string }>(rows: T[]) =>
  rows.map((row) => ({
    ...row,
    createdAt: toDate(row.createdAt),
    updatedAt: toDate(row.updatedAt),
  }));

// Helper to map theme data with proper enum type
const mapThemes = (themes: typeof seedSnapshot.themes) =>
  themes.map((theme) => ({
    ...theme,
    name: theme.name as EnumTheme,
    createdAt: toDate(theme.createdAt),
    updatedAt: toDate(theme.updatedAt),
  }));

// Helper to map block data with proper enum type
const mapBlocks = (blocks: typeof seedSnapshot.blocks) =>
  blocks.map((block) => ({
    ...block,
    type: block.type as BlockType,
    createdAt: toDate(block.createdAt),
    updatedAt: toDate(block.updatedAt),
  }));

async function main() {
  console.log("🌱 Seeding database from prisma/seed-data.json ...");

  const data = seedSnapshot as SeedSnapshot;

  // Wipe existing content (auth tables untouched)
  console.log("🗑️  Clearing existing data...");
  await prisma.pageBlock.deleteMany();
  await prisma.page.deleteMany();
  await prisma.block.deleteMany();
  await prisma.collectionItem.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.globalSettings.deleteMany();
  await prisma.headerLink.deleteMany();
  await prisma.header.deleteMany();
  await prisma.footerLink.deleteMany();
  await prisma.footer.deleteMany();
  await prisma.theme.deleteMany();
  console.log("✅ Cleared existing data");

  // Seed base tables
  if (data.themes?.length) {
    await prisma.theme.createMany({
      data: mapThemes(data.themes),
      skipDuplicates: true,
    });
  }

  if (data.headers?.length) {
    await prisma.header.createMany({ data: mapDates(data.headers) });
  }

  if (data.headerLinks?.length) {
    await prisma.headerLink.createMany({ data: mapDates(data.headerLinks) });
  }

  if (data.footers?.length) {
    await prisma.footer.createMany({ data: mapDates(data.footers) });
  }

  if (data.footerLinks?.length) {
    await prisma.footerLink.createMany({ data: mapDates(data.footerLinks) });
  }

  if (data.globalSettings?.length) {
    await prisma.globalSettings.createMany({
      data: mapDates(data.globalSettings),
    });
  }

  if (data.collections?.length) {
    await prisma.collection.createMany({ data: mapDates(data.collections) });
  }

  if (data.collectionItems?.length) {
    await prisma.collectionItem.createMany({
      data: mapDates(data.collectionItems),
    });
  }

  if (data.blocks?.length) {
    await prisma.block.createMany({ data: mapBlocks(data.blocks) });
  }

  if (data.pages?.length) {
    await prisma.page.createMany({ data: mapDates(data.pages) });
  }

  if (data.pageBlocks?.length) {
    await prisma.pageBlock.createMany({ data: mapDates(data.pageBlocks) });
  }

  console.log("✅ Database seeded with exported snapshot");
  console.log("\n📊 Summary:");
  console.log(`   - Headers: ${data.headers?.length ?? 0}`);
  console.log(`   - Header Links: ${data.headerLinks?.length ?? 0}`);
  console.log(`   - Footers: ${data.footers?.length ?? 0}`);
  console.log(`   - Footer Links: ${data.footerLinks?.length ?? 0}`);
  console.log(`   - Global Settings: ${data.globalSettings?.length ?? 0}`);
  console.log(`   - Pages: ${data.pages?.length ?? 0}`);
  console.log(`   - Blocks: ${data.blocks?.length ?? 0}`);
  console.log(`   - Page-Block Links: ${data.pageBlocks?.length ?? 0}`);
  console.log(`   - Collections: ${data.collections?.length ?? 0}`);
  console.log(`   - Collection Items: ${data.collectionItems?.length ?? 0}`);
  console.log(`   - Themes: ${data.themes?.length ?? 0}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";
}
