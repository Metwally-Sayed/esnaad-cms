import prisma from "../lib/prisma";

/**
 * Migration script to convert existing About blocks to bilingual format
 * - Copies existing single-language content to English fields
 * - Translates and adds Arabic content
 */

const arabicTranslations: Record<string, string> = {
  // aboutEssay translations
  "Esnaad Development is a pioneering real estate development company committed to transforming urban landscapes through innovative, sustainable, and community-centered projects.":
    "إسناد للتطوير العقاري هي شركة رائدة في مجال التطوير العقاري ملتزمة بتحويل المشاهد الحضرية من خلال مشاريع مبتكرة ومستدامة تركز على المجتمع.",

  "Founded with a vision to redefine modern living, we specialize in creating spaces that inspire, connect, and endure.":
    "تأسست برؤية لإعادة تعريف الحياة الحديثة، ونحن متخصصون في إنشاء مساحات تلهم وتربط وتدوم.",

  "Our portfolio spans residential, commercial, and mixed-use developments, each designed to enhance quality of life and foster vibrant communities.":
    "تمتد محفظتنا عبر التطويرات السكنية والتجارية ومتعددة الاستخدامات، كل منها مصمم لتحسين جودة الحياة وتعزيز المجتمعات النابضة بالحياة.",

  "At Esnaad, we believe in building more than structures—we build futures.":
    "في إسناد، نؤمن ببناء أكثر من مجرد هياكل - نحن نبني مستقبل.",

  // aboutVision translations
  "A TEAM OF INNOVATORS AND BUILDERS PIONEERING PROGRESSIVE FORMS OF LARGE-SCALE URBAN DEVELOPMENT":
    "فريق من المبتكرين والبناة يقودون أشكالاً تقدمية من التطوير العمراني واسع النطاق",

  "Esnaad Development stands at the forefront of urban innovation, driven by a team of visionary architects, engineers, and strategists dedicated to reimagining the built environment.":
    "تقف إسناد للتطوير في طليعة الابتكار الحضري، مدفوعة بفريق من المهندسين المعماريين والمهندسين والاستراتيجيين ذوي الرؤية المكرسين لإعادة تصور البيئة المبنية.",

  "We embrace cutting-edge technology, sustainable practices, and human-centered design to deliver projects that set new standards in quality, functionality, and aesthetic excellence.":
    "نتبنى أحدث التقنيات والممارسات المستدامة والتصميم الذي يركز على الإنسان لتقديم مشاريع تضع معايير جديدة في الجودة والوظائف والتميز الجمالي.",

  "Our approach is collaborative, transparent, and rooted in a deep understanding of the communities we serve.":
    "نهجنا تعاوني وشفاف ومتجذر في فهم عميق للمجتمعات التي نخدمها.",

  "Whether developing master-planned communities or iconic landmarks, Esnaad is committed to shaping cities that inspire and endure for generations to come.":
    "سواء كنا نطور مجتمعات مخططة بشكل رئيسي أو معالم بارزة، فإن إسناد ملتزمة بتشكيل مدن تلهم وتدوم للأجيال القادمة.",

  // Common translations
  "ABOUT COMPANY": "عن الشركة",
  "OUR STORY": "قصتنا",
  "OUR TEAM": "فريقنا",
  "Meet the experts": "تعرف على الخبراء",
  "OUR PURPOSE": "هدفنا",
  "Our Mission": "مهمتنا",
  "Our Vision": "رؤيتنا",
  "ESNAAD PHILOSOPHY": "فلسفة إسناد",
  "WHAT WE STAND FOR": "ما نؤمن به",
};

async function migrateAboutBlocks() {
  console.log("🚀 Starting migration of About blocks to bilingual format...\n");

  // Get all blocks of type ABOUT
  const aboutBlocks = await prisma.block.findMany({
    where: {
      type: "ABOUT",
    },
  });

  console.log(`Found ${aboutBlocks.length} About blocks to migrate.\n`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const block of aboutBlocks) {
    const content = block.content as any;
    let updated = false;
    const newContent = { ...content };

    console.log(`Processing block: ${block.id} (${block.name})`);
    console.log(`Variant: ${content.variant || "unknown"}`);

    // Migrate based on variant
    switch (content.variant) {
      case "about-essay":
        if (content.paragraphs && !content.paragraphsEn) {
          // Copy existing paragraphs to English
          newContent.paragraphsEn = content.paragraphs;

          // Translate to Arabic
          newContent.paragraphsAr = content.paragraphs.map((p: any) => ({
            text: arabicTranslations[p.text] || p.text,
          }));

          updated = true;
          console.log(`  ✅ Migrated paragraphs (${content.paragraphs.length} items)`);
        }
        break;

      case "about-vision":
        // Migrate heading
        if (content.heading && !content.headingEn) {
          newContent.headingEn = content.heading;
          newContent.headingAr =
            arabicTranslations[content.heading] || content.heading;
          updated = true;
          console.log(`  ✅ Migrated heading`);
        }

        // Migrate paragraphs
        if (content.paragraphs && !content.paragraphsEn) {
          newContent.paragraphsEn = content.paragraphs;
          newContent.paragraphsAr = content.paragraphs.map((p: any) => ({
            text: arabicTranslations[p.text] || p.text,
          }));
          updated = true;
          console.log(`  ✅ Migrated paragraphs (${content.paragraphs.length} items)`);
        }
        break;

      case "about-story":
        // Migrate sectionTitle
        if (content.sectionTitle && !content.sectionTitleEn) {
          newContent.sectionTitleEn = content.sectionTitle;
          newContent.sectionTitleAr =
            arabicTranslations[content.sectionTitle] || content.sectionTitle;
          updated = true;
          console.log(`  ✅ Migrated sectionTitle`);
        }

        // Migrate subtitle
        if (content.subtitle && !content.subtitleEn) {
          newContent.subtitleEn = content.subtitle;
          newContent.subtitleAr =
            arabicTranslations[content.subtitle] || content.subtitle;
          updated = true;
          console.log(`  ✅ Migrated subtitle`);
        }

        // Migrate paragraphs
        if (content.paragraphs && !content.paragraphsEn) {
          newContent.paragraphsEn = content.paragraphs;
          newContent.paragraphsAr = content.paragraphs.map((p: any) => ({
            text: arabicTranslations[p.text] || p.text,
          }));
          updated = true;
          console.log(`  ✅ Migrated paragraphs`);
        }
        break;

      case "about-team":
        // Migrate section titles
        if (content.sectionTitle && !content.sectionTitleEn) {
          newContent.sectionTitleEn = content.sectionTitle;
          newContent.sectionTitleAr =
            arabicTranslations[content.sectionTitle] || content.sectionTitle;
          updated = true;
        }

        if (content.subtitle && !content.subtitleEn) {
          newContent.subtitleEn = content.subtitle;
          newContent.subtitleAr =
            arabicTranslations[content.subtitle] || content.subtitle;
          updated = true;
        }

        if (content.description && !content.descriptionEn) {
          newContent.descriptionEn = content.description;
          newContent.descriptionAr =
            arabicTranslations[content.description] || content.description;
          updated = true;
        }

        // Migrate members (keep both old and new for now)
        if (content.members && content.members.length > 0) {
          const firstMember = content.members[0];
          if (firstMember.name && !firstMember.nameEn) {
            // Members need individual migration - keeping old format for now
            console.log(`  ⚠️  Team members need manual translation`);
          }
        }
        break;

      case "about-mission":
        const missionFields = [
          "sectionTitle",
          "missionTitle",
          "missionText",
          "visionTitle",
          "visionText",
        ];

        missionFields.forEach((field) => {
          const enField = `${field}En`;
          const arField = `${field}Ar`;

          if (content[field] && !content[enField]) {
            newContent[enField] = content[field];
            newContent[arField] =
              arabicTranslations[content[field]] || content[field];
            updated = true;
          }
        });

        if (updated) {
          console.log(`  ✅ Migrated mission/vision fields`);
        }
        break;

      case "about-philosophy":
        if (content.sectionTitle && !content.sectionTitleEn) {
          newContent.sectionTitleEn = content.sectionTitle;
          newContent.sectionTitleAr =
            arabicTranslations[content.sectionTitle] || content.sectionTitle;
          updated = true;
        }

        if (content.subtitle && !content.subtitleEn) {
          newContent.subtitleEn = content.subtitle;
          newContent.subtitleAr =
            arabicTranslations[content.subtitle] || content.subtitle;
          updated = true;
        }

        if (content.description && !content.descriptionEn) {
          newContent.descriptionEn = content.description;
          newContent.descriptionAr =
            arabicTranslations[content.description] || content.description;
          updated = true;
        }

        if (updated) {
          console.log(`  ✅ Migrated philosophy fields`);
        }
        break;

      case "about-vision-statement":
        // Migrate headings
        if (content.heading && !content.headingEn) {
          newContent.headingEn = content.heading;
          newContent.headingAr =
            arabicTranslations[content.heading] || content.heading;
          updated = true;
        }

        if (content.subheading && !content.subheadingEn) {
          newContent.subheadingEn = content.subheading;
          newContent.subheadingAr =
            arabicTranslations[content.subheading] || content.subheading;
          updated = true;
        }

        if (content.founderHeading && !content.founderHeadingEn) {
          newContent.founderHeadingEn = content.founderHeading;
          newContent.founderHeadingAr =
            arabicTranslations[content.founderHeading] || content.founderHeading;
          updated = true;
        }

        // Migrate paragraphs
        if (content.paragraphs && !content.paragraphsEn) {
          newContent.paragraphsEn = content.paragraphs;
          newContent.paragraphsAr = content.paragraphs.map((p: any) => ({
            text: arabicTranslations[p.text] || p.text,
          }));
          updated = true;
        }

        if (content.founderParagraphs && !content.founderParagraphsEn) {
          newContent.founderParagraphsEn = content.founderParagraphs;
          newContent.founderParagraphsAr = content.founderParagraphs.map(
            (p: any) => ({
              text: arabicTranslations[p.text] || p.text,
            })
          );
          updated = true;
        }

        if (updated) {
          console.log(`  ✅ Migrated vision statement fields`);
        }
        break;

      default:
        console.log(`  ⚠️  Unknown variant, skipping`);
    }

    // Update the block if changes were made
    if (updated) {
      await prisma.block.update({
        where: { id: block.id },
        data: { content: newContent },
      });
      migratedCount++;
      console.log(`  💾 Updated block in database\n`);
    } else {
      skippedCount++;
      console.log(`  ⏭️  No migration needed (already migrated or no content)\n`);
    }
  }

  console.log("\n✨ Migration complete!");
  console.log(`📊 Statistics:`);
  console.log(`   - Total blocks: ${aboutBlocks.length}`);
  console.log(`   - Migrated: ${migratedCount}`);
  console.log(`   - Skipped: ${skippedCount}`);
}

// Run the migration
migrateAboutBlocks()
  .then(() => {
    console.log("\n✅ Migration finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
