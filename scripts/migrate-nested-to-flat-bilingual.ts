import prisma from "../lib/prisma";

/**
 * Migration script to convert nested en/ar structure to flat bilingual fields
 * FROM: content.en.paragraphs / content.ar.paragraphs
 * TO: content.paragraphsEn / content.paragraphsAr
 */

async function migrateNestedToFlat() {
  console.log("🚀 Migrating nested bilingual structure to flat fields...\n");

  const blocks = await prisma.block.findMany({
    where: {
      type: "ABOUT",
      variant: { in: ["about-essay", "about-vision"] },
    },
  });

  console.log(`Found ${blocks.length} blocks to migrate\n`);

  for (const block of blocks) {
    const content = block.content as any;
    const newContent = { ...content };
    let updated = false;

    console.log(`Processing: ${block.name} (${block.variant})`);

    if (block.variant === "about-essay") {
      // Migrate paragraphs from nested to flat
      if (content.en?.paragraphs && content.ar?.paragraphs) {
        newContent.paragraphsEn = content.en.paragraphs;
        newContent.paragraphsAr = content.ar.paragraphs;

        // Copy other fields from en object
        if (content.en.image) newContent.image = content.en.image;
        if (content.en.imageAlt) newContent.imageAlt = content.en.imageAlt;
        if (content.en.customColors !== undefined) newContent.customColors = content.en.customColors;
        if (content.en.backgroundColor) newContent.backgroundColor = content.en.backgroundColor;
        if (content.en.textColor) newContent.textColor = content.en.textColor;

        updated = true;
        console.log(`  ✅ Migrated paragraphs:`);
        console.log(`     EN: ${content.en.paragraphs.length} items`);
        console.log(`     AR: ${content.ar.paragraphs.length} items`);
      }
    } else if (block.variant === "about-vision") {
      // Migrate heading and paragraphs
      if (content.en?.heading) {
        newContent.headingEn = content.en.heading;
        updated = true;
        console.log(`  ✅ Migrated headingEn`);
      }

      if (content.ar?.heading) {
        newContent.headingAr = content.ar.heading;
        updated = true;
        console.log(`  ✅ Migrated headingAr`);
      }

      if (content.en?.paragraphs && content.ar?.paragraphs) {
        newContent.paragraphsEn = content.en.paragraphs;
        newContent.paragraphsAr = content.ar.paragraphs;
        updated = true;
        console.log(`  ✅ Migrated paragraphs:`);
        console.log(`     EN: ${content.en.paragraphs.length} items`);
        console.log(`     AR: ${content.ar.paragraphs.length} items`);
      }

      // Copy other fields from en object
      if (content.en?.image) newContent.image = content.en.image;
      if (content.en?.imageAlt) newContent.imageAlt = content.en.imageAlt;
      if (content.en?.customColors !== undefined) newContent.customColors = content.en.customColors;
      if (content.en?.backgroundColor) newContent.backgroundColor = content.en.backgroundColor;
      if (content.en?.textColor) newContent.textColor = content.en.textColor;
      if (content.en?.titleColor) newContent.titleColor = content.en.titleColor;
    }

    if (updated) {
      await prisma.block.update({
        where: { id: block.id },
        data: { content: newContent },
      });
      console.log(`  💾 Updated block in database`);
    } else {
      console.log(`  ⏭️  No migration needed`);
    }

    console.log();
  }

  console.log("✨ Migration complete!");
}

migrateNestedToFlat()
  .then(() => {
    console.log("✅ Done");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
