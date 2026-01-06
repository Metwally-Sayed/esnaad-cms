import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function backup() {
  console.log("📦 Backing up database...");

  const data = {
    themes: await prisma.theme.findMany(),
    headers: await prisma.header.findMany(),
    headerLinks: await prisma.headerLink.findMany(),
    footers: await prisma.footer.findMany(),
    footerLinks: await prisma.footerLink.findMany(),
    globalSettings: await prisma.globalSettings.findMany(),
    collections: await prisma.collection.findMany(),
    pages: await prisma.page.findMany(),
    collectionItems: await prisma.collectionItem.findMany(),
    blocks: await prisma.block.findMany(),
    pageBlocks: await prisma.pageBlock.findMany(),
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(process.cwd(), "backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

  console.log(`✅ Backup created: ${backupPath}`);
  console.log(`📊 Summary:`);
  console.log(`   - Pages: ${data.pages.length}`);
  console.log(`   - Blocks: ${data.blocks.length}`);
  console.log(`   - Collections: ${data.collections.length}`);
  console.log(`   - Headers: ${data.headers.length}`);
  console.log(`   - Footers: ${data.footers.length}`);
}

backup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
