
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the careers page
  const page = await prisma.page.findFirst({
    where: { slug: { endsWith: 'careers' } },
    include: { blocks: { include: { block: true } } }
  });

  if (!page) {
    console.error("Careers page not found");
    return;
  }

  // Find the Form block
  const formBlock = page.blocks.find(b => b.block.type === 'FORM');
  
  if (!formBlock) {
    console.error("Form block not found on careers page");
    return;
  }

  console.log("Found Form Block:", formBlock.block.name, formBlock.block.id);

  const originalContent = formBlock.block.content;
  
  // Clone content to safely modify it
  const newContent = JSON.parse(JSON.stringify(originalContent));

  // Prepare Arabic Content
  // We keep the structure but translate the strings
  const arContent = {
    ...newContent.ar, // Keep existing keys
    title: "مركز تطوير المسارات المهنية",
    subtitle: "نرحب بطلبك! يرجى ملء بياناتك وإرفاق سيرتك الذاتية، وسيقوم فريق الموارد البشرية لدينا بمراجعة طلبك والتواصل معك",
    submitLabel: "إرسال",
    successMessage: "شكراً لك! تم استلام طلبك بنجاح.",
    fields: (newContent.ar.fields || []).map(field => {
      let label = field.label;
      let placeholder = field.placeholder;

      // Simple mapping based on known English labels
      if (label && label.toLowerCase().includes("name")) {
        label = "اسم المتقدم";
        placeholder = "الاسم الكامل";
      } else if (label && label.toLowerCase().includes("email")) {
        label = "البريد الإلكتروني";
        placeholder = "name@example.com";
      } else if (label && label.toLowerCase().includes("mobile")) {
        label = "رقم الهاتف";
      } else if (label && label.toLowerCase().includes("position")) {
        label = "المسمى الوظيفي";
      } else if (label && label.toLowerCase().includes("cv")) {
        label = "تحميل السيرة الذاتية";
        placeholder = "اختر ملف";
      }

      return {
        ...field,
        label,
        placeholder
      };
    })
  };

  newContent.ar = arContent;

  await prisma.block.update({
    where: { id: formBlock.blockId },
    data: { content: newContent }
  });

  console.log("Successfully updated Form Block with Arabic translations.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
