import prisma from "../lib/prisma";

/**
 * Script to translate About block content to Arabic
 * Provides Arabic translations for the about-essay and about-vision blocks
 */

const translations: Record<string, string> = {
  // About Essay paragraphs
  "ESNAAD Developments, a strategic subsidiary of UAE-based Aura Holdings, has been a key player in shaping the real estate and construction landscape in the region. Since its inception, ESNAAD has become synonymous with excellence in property development, urban planning, and innovative construction solutions. Backed by the expertise and financial strength of Aura Holdings, the company has delivered several landmark projects that have redefined the standards of modern living and commercial spaces.":
    "إسناد للتطوير، شركة تابعة استراتيجية لشركة أورا القابضة ومقرها الإمارات العربية المتحدة، كانت لاعباً رئيسياً في تشكيل مشهد العقارات والبناء في المنطقة. منذ نشأتها، أصبحت إسناد مرادفة للتميز في تطوير العقارات والتخطيط الحضري وحلول البناء المبتكرة. بدعم من الخبرة والقوة المالية لشركة أورا القابضة، قدمت الشركة العديد من المشاريع الرائدة التي أعادت تعريف معايير المعيشة الحديثة والمساحات التجارية.",

  "ESNAAD's portfolio spans residential, commercial, and mixed-use developments, reflecting a commitment to quality, sustainability, and cutting-edge design. The company's approach is rooted in a strong vision of creating spaces that foster community, functionality, and luxury, ensuring that each project meets the highest standards of design, technology, and environmental responsibility.":
    "تمتد محفظة إسناد عبر التطويرات السكنية والتجارية ومتعددة الاستخدامات، مما يعكس الالتزام بالجودة والاستدامة والتصميم المتطور. يتجذر نهج الشركة في رؤية قوية لإنشاء مساحات تعزز المجتمع والوظيفة والرفاهية، مما يضمن أن كل مشروع يلبي أعلى معايير التصميم والتكنولوجيا والمسؤولية البيئية.",

  "With a proven track record of success in both the UAE and broader Middle Eastern markets, ESNAAD has forged strong partnerships with local and international contractors, architects, and designers. These collaborations have enabled the company to continually push the boundaries of construction and real estate development.":
    "مع سجل حافل من النجاح في كل من أسواق الإمارات العربية المتحدة والشرق الأوسط الأوسع، أقامت إسناد شراكات قوية مع المقاولين والمهندسين المعماريين والمصممين المحليين والدوليين. مكنت هذه التعاونات الشركة من دفع حدود البناء والتطوير العقاري بشكل مستمر.",

  // About Vision heading
  "A TEAM OF INNOVATORS AND BUILDERS PIONEERING PROGRESSIVE FORMS OF LARGE-SCALE URBAN DEVELOPMENT":
    "فريق من المبتكرين والبناة الرواد في أشكال تقدمية من التطوير الحضري واسع النطاق",

  // About Vision paragraphs
  "ESNAAD Development envisions a bold future where our unwavering commitment to excellence, innovation, and sustainability will redefine the landscape of Dubai's real estate sector.":
    "تتصور إسناد للتطوير مستقبلاً جريئاً حيث سيعيد التزامنا الثابت بالتميز والابتكار والاستدامة تعريف مشهد قطاع العقارات في دبي.",

  "Guided by the visionary leadership of H.H. Sheikh Mohammed Bin Rashid Al Maktoum, we are driven by the ambition to be at the forefront of transformative developments that not only shape the city's skyline but also contribute to its ever-evolving growth as a global hub for business, culture, and innovation. Our vision is grounded in a deep understanding of Dubai's unique potential and its dynamic evolution into a world-class metropolis.":
    "بتوجيه من القيادة الحكيمة لصاحب السمو الشيخ محمد بن راشد آل مكتوم، نحن مدفوعون بالطموح أن نكون في طليعة التطورات التحويلية التي لا تشكل أفق المدينة فحسب، بل تساهم أيضاً في نموها المتطور باستمرار كمركز عالمي للأعمال والثقافة والابتكار. تتجذر رؤيتنا في فهم عميق لإمكانات دبي الفريدة وتطورها الديناميكي إلى مدينة عالمية من الطراز الأول.",

  "As we expand our presence across the city, ESNAAD Development aspires to be recognized as a developer synonymous with visionary architecture, cutting-edge design, and a steadfast commitment to sustainability.":
    "مع توسع وجودنا في جميع أنحاء المدينة، تطمح إسناد للتطوير إلى أن يتم الاعتراف بها كمطور مرادف للهندسة المعمارية ذات الرؤية والتصميم المتطور والالتزام الثابت بالاستدامة.",

  "With a focus on quality, community, and forward-thinking practices, ESNAAD Development is poised to become a catalyst for positive change in the region's real estate sector.":
    "مع التركيز على الجودة والمجتمع والممارسات التطلعية، فإن إسناد للتطوير على استعداد لأن تصبح حافزاً للتغيير الإيجابي في قطاع العقارات في المنطقة.",
};

async function translateBlocks() {
  console.log("🌍 Translating About blocks to Arabic...\n");

  // Process about-essay
  const essayBlock = await prisma.block.findFirst({
    where: { variant: "about-essay" },
  });

  if (essayBlock) {
    const content = essayBlock.content as any;
    const newContent = { ...content };

    console.log("Processing About Essay block...");

    if (content.paragraphsEn && Array.isArray(content.paragraphsEn)) {
      newContent.paragraphsAr = content.paragraphsEn.map((p: any) => ({
        text: translations[p.text] || p.text,
      }));

      await prisma.block.update({
        where: { id: essayBlock.id },
        data: { content: newContent },
      });

      console.log(`✅ Translated ${newContent.paragraphsAr.length} paragraphs to Arabic`);
      console.log(`   Sample AR: ${newContent.paragraphsAr[0].text.substring(0, 80)}...`);
    }
  }

  // Process about-vision
  const visionBlock = await prisma.block.findFirst({
    where: { variant: "about-vision" },
  });

  if (visionBlock) {
    const content = visionBlock.content as any;
    const newContent = { ...content };

    console.log("\nProcessing About Vision block...");

    // Translate heading
    if (content.headingEn) {
      newContent.headingAr = translations[content.headingEn] || content.headingEn;
      console.log(`✅ Translated heading to Arabic`);
      console.log(`   AR: ${newContent.headingAr}`);
    }

    // Translate paragraphs
    if (content.paragraphsEn && Array.isArray(content.paragraphsEn)) {
      newContent.paragraphsAr = content.paragraphsEn.map((p: any) => ({
        text: translations[p.text] || p.text,
      }));

      console.log(`✅ Translated ${newContent.paragraphsAr.length} paragraphs to Arabic`);
      console.log(`   Sample AR: ${newContent.paragraphsAr[0].text.substring(0, 80)}...`);
    }

    await prisma.block.update({
      where: { id: visionBlock.id },
      data: { content: newContent },
    });
  }

  // Process about-story (if exists)
  const storyBlock = await prisma.block.findFirst({
    where: { variant: "about-story" },
  });

  if (storyBlock) {
    const content = storyBlock.content as any;
    console.log("\nProcessing About Story block...");

    // Data is already in the nested en/ar format
    if (content.en && content.ar) {
      const newContent = { ...content };

      // Copy from nested structure to flat bilingual fields
      newContent.sectionTitleEn = content.en.sectionTitle;
      newContent.sectionTitleAr = content.ar.sectionTitle;
      newContent.subtitleEn = content.en.subtitle;
      newContent.subtitleAr = content.ar.subtitle;
      newContent.paragraphsEn = content.en.paragraphs;
      newContent.paragraphsAr = content.ar.paragraphs;

      // Copy shared fields
      newContent.image = content.en.image || content.ar.image;
      newContent.imageAlt = content.en.imageAlt || content.ar.imageAlt;
      newContent.customColors = content.en.customColors;
      newContent.backgroundColor = content.en.backgroundColor;
      newContent.titleColor = content.en.titleColor;
      newContent.textColor = content.en.textColor;

      await prisma.block.update({
        where: { id: storyBlock.id },
        data: { content: newContent },
      });

      console.log(`✅ Migrated About Story block to flat bilingual structure`);
      console.log(`   EN Title: ${newContent.sectionTitleEn}`);
      console.log(`   AR Title: ${newContent.sectionTitleAr}`);
    }
  }

  console.log("\n✨ Translation complete!");
}

translateBlocks()
  .then(() => {
    console.log("\n✅ All translations applied successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Translation failed:", error);
    process.exit(1);
  });
