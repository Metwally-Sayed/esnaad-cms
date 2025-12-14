import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating contact form field labels with Arabic translations...");

  // Find all pages to see what we have
  const allPages = await prisma.page.findMany({
    select: { id: true, slug: true, title: true },
  });

  console.log("All pages:", allPages.map(p => ({ slug: p.slug, title: p.title })));

  // Find the contact page (try different variations)
  const contactPage = await prisma.page.findFirst({
    where: {
      OR: [
        { slug: { contains: "contact" } },
        { title: { contains: "Contact" } },
      ],
    },
    include: {
      blocks: {
        include: {
          block: true,
        },
      },
    },
  });

  if (!contactPage) {
    console.log("Contact page not found");
    return;
  }

  console.log(`Found contact page: ${contactPage.title} (${contactPage.slug})`);
  console.log(`Blocks: ${contactPage.blocks.length}`);

  // Find the form block
  const pageBlock = contactPage.blocks.find((pb) => pb.block.type === "FORM");

  if (!pageBlock) {
    console.log("Form block not found on contact page");
    console.log("Available blocks:", contactPage.blocks.map(pb => pb.block.type));
    return;
  }

  const formBlock = pageBlock.block;
  console.log(`Found form block: ${formBlock.id}`);

  // Define Arabic translations for common form fields
  const fieldTranslations: Record<string, { en: string; ar: string }> = {
    name: { en: "NAME", ar: "الاسم" },
    "f-name": { en: "NAME", ar: "الاسم" },
    email: { en: "EMAIL", ar: "البريد الإلكتروني" },
    "f-email": { en: "EMAIL", ar: "البريد الإلكتروني" },
    phone: { en: "PHONE", ar: "الهاتف" },
    "f-phone": { en: "PHONE", ar: "الهاتف" },
    mobile: { en: "MOBILE", ar: "الجوال" },
    "f-mobile": { en: "MOBILE", ar: "الجوال" },
    message: { en: "MESSAGE", ar: "الرسالة" },
    "f-message": { en: "MESSAGE", ar: "الرسالة" },
    subject: { en: "SUBJECT", ar: "الموضوع" },
    "f-subject": { en: "SUBJECT", ar: "الموضوع" },
    company: { en: "COMPANY", ar: "الشركة" },
    "f-company": { en: "COMPANY", ar: "الشركة" },
  };

  // Get current content
  const content = formBlock.content as any;

  console.log("Current content structure:", Object.keys(content));

  // Update field labels with Arabic translations
  if (content.en && content.en.fields) {
    console.log("Updating EN fields...");
    content.en.fields = content.en.fields.map((field: any) => {
      const fieldKey = field.name.toLowerCase();
      if (fieldTranslations[fieldKey]) {
        console.log(`  EN: ${field.name} -> ${fieldTranslations[fieldKey].en}`);
        return { ...field, label: fieldTranslations[fieldKey].en };
      }
      return field;
    });
  }

  if (content.ar && content.ar.fields) {
    console.log("Updating AR fields...");
    content.ar.fields = content.ar.fields.map((field: any) => {
      const fieldKey = field.name.toLowerCase();
      if (fieldTranslations[fieldKey]) {
        console.log(`  AR: ${field.name} -> ${fieldTranslations[fieldKey].ar}`);
        return { ...field, label: fieldTranslations[fieldKey].ar };
      }
      return field;
    });
  }

  // Update the block
  await prisma.block.update({
    where: { id: formBlock.id },
    data: { content },
  });

  console.log("\n✅ Contact form field labels updated successfully!");
  console.log("\nArabic field labels:");
  if (content.ar && content.ar.fields) {
    content.ar.fields.forEach((field: any) => {
      console.log(`  - ${field.name}: ${field.label}`);
    });
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
