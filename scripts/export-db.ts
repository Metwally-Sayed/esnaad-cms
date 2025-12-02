import { writeFileSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RowWithDates = {
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const serializeDates = <T extends RowWithDates>(rows: T[]) =>
  rows.map((row) => ({
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
  }));

async function main() {
  console.log("📤 Exporting current database content...");

  const [
    collections,
    collectionItems,
    headers,
    headerLinks,
    footers,
    footerLinks,
    globalSettings,
    pages,
    blocks,
    pageBlocks,
    themes,
  ] = await Promise.all([
    prisma.collection.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.collectionItem.findMany({
      orderBy: [{ collectionId: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.header.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.headerLink.findMany({
      orderBy: [{ headerId: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.footer.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.footerLink.findMany({
      orderBy: [{ footerId: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.globalSettings.findMany(),
    prisma.page.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.block.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.pageBlock.findMany({
      orderBy: [{ pageId: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    }),
    prisma.theme.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  const payload = {
    collections: serializeDates(collections),
    collectionItems: serializeDates(collectionItems),
    headers: serializeDates(headers),
    headerLinks: serializeDates(headerLinks),
    footers: serializeDates(footers),
    footerLinks: serializeDates(footerLinks),
    globalSettings: serializeDates(globalSettings),
    pages: serializeDates(pages),
    blocks: serializeDates(blocks),
    pageBlocks: serializeDates(pageBlocks),
    themes: serializeDates(themes),
    exportedAt: new Date().toISOString(),
  };

  const targetPath = path.join(process.cwd(), "prisma", "seed-data.json");
  writeFileSync(targetPath, JSON.stringify(payload, null, 2), "utf8");

  console.log(`✅ Wrote seed snapshot to ${targetPath}`);
}

main()
  .catch((error) => {
    console.error("❌ Export failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
