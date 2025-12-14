import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating agency registration form with Arabic translations...");

  // Find the agency-register page
  const agencyPage = await prisma.page.findFirst({
    where: {
      OR: [
        { slug: { contains: "agency" } },
        { slug: { contains: "register" } },
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

  if (!agencyPage) {
    console.log("Agency registration page not found");
    return;
  }

  console.log(`Found page: ${agencyPage.title} (${agencyPage.slug})`);
  console.log(`Blocks: ${agencyPage.blocks.length}`);

  // Find the form block
  const pageBlock = agencyPage.blocks.find((pb) => pb.block.type === "FORM");

  if (!pageBlock) {
    console.log("Form block not found");
    console.log("Available blocks:", agencyPage.blocks.map(pb => pb.block.type));
    return;
  }

  const formBlock = pageBlock.block;
  console.log(`Found form block: ${formBlock.id}`);

  // Get current content
  const content = formBlock.content as any;

  console.log("Current content structure:", Object.keys(content));

  // Update English content
  if (!content.en) {
    content.en = {};
  }

  content.en = {
    ...content.en,
    title: "AGENCY REGISTRATION",
    subtitle: "WELCOME TO THE REAL ESTATE BROKERAGE REGISTRATION PORTAL",
    introText: "WE ARE EXCITED TO ESTABLISH PARTNERSHIPS WITH ESTEEMED REAL ESTATE AGENCIES OR BROKER COMPANIES. PLEASE COMPLETE THE FOLLOWING FORM TO INITIATE THE REGISTRATION PROCESS",
    submitLabel: "SUBMIT",
    successMessage: "Thank you! Your registration has been received successfully.",
  };

  // Update Arabic content
  if (!content.ar) {
    content.ar = {};
  }

  content.ar = {
    ...content.ar,
    title: "تسجيل الوكالة",
    subtitle: "مرحباً بكم في بوابة تسجيل الوساطة العقارية",
    introText: "يسعدنا إقامة شراكات مع وكالات العقارات المرموقة أو شركات الوساطة. يرجى استكمال النموذج التالي لبدء عملية التسجيل",
    submitLabel: "إرسال",
    successMessage: "شكراً لك! تم استلام تسجيلك بنجاح.",
  };

  // Define field translations based on actual field names
  const fieldTranslations: Record<string, { en: string; ar: string }> = {
    "company_name": { en: "COMPANY NAME", ar: "اسم الشركة" },
    "company_type": { en: "COMPANY TYPE", ar: "نوع الشركة" },
    "trade_license_number": { en: "TRADE LICENSE NUMBER", ar: "رقم الرخصة التجارية" },
    "trade_license_expiry": { en: "TRADE LICENSE EXPIRY", ar: "تاريخ انتهاء الرخصة التجارية" },
    "rera_certificate_expiry": { en: "RERA CERTIFICATE EXPIRY", ar: "تاريخ انتهاء شهادة ريرا" },
    "po_box_no": { en: "P.O. BOX NO", ar: "صندوق البريد" },
    "company_address": { en: "COMPANY ADDRESS", ar: "عنوان الشركة" },
    "company_email": { en: "COMPANY EMAIL", ar: "البريد الإلكتروني للشركة" },
    "company_landline": { en: "COMPANY LAND LINE NUMBER", ar: "رقم هاتف الشركة الأرضي" },
    "company_website": { en: "COMPANY WEBSITE", ar: "موقع الشركة الإلكتروني" },
    "auth_person_header": { en: "AUTHORIZED PERSON INFORMATION", ar: "معلومات الشخص المفوض" },
    "auth_person_name": { en: "TRADE LICENSE NAME", ar: "الاسم في الرخصة التجارية" },
    "nationality": { en: "NATIONALITY", ar: "الجنسية" },
    "passport_number": { en: "PASSPORT NUMBER", ar: "رقم جواز السفر" },
    "designation": { en: "DESIGNATION/POSITION", ar: "المسمى الوظيفي" },
    "auth_person_email": { en: "EMAIL", ar: "البريد الإلكتروني" },
    "auth_person_contact": { en: "CONTACT NUMBER", ar: "رقم الاتصال" },
    "auth_person_address": { en: "ADDRESS", ar: "العنوان" },
    "auth_person_city": { en: "CITY", ar: "المدينة" },
    "banking_header": { en: "BANKING INFORMATION", ar: "المعلومات المصرفية" },
    "beneficiary_name": { en: "ACCOUNT/BENEFICIARY NAME", ar: "اسم الحساب/المستفيد" },
    "bank_name": { en: "BANK NAME", ar: "اسم البنك" },
    "bank_country": { en: "BANK COUNTRY", ar: "بلد البنك" },
    "bank_city": { en: "BANK CITY", ar: "مدينة البنك" },
    "account_number": { en: "ACCOUNT NUMBER", ar: "رقم الحساب" },
    "iban_number": { en: "IBAN NUMBER", ar: "رقم الآيبان" },
    "swift_code": { en: "SWIFT CODE", ar: "رمز السويفت" },
    "documents_header": { en: "DOCUMENTS", ar: "المستندات" },
    "doc_trade_license": { en: "VALID TRADE LICENCE", ar: "رخصة تجارية سارية" },
    "doc_rera_cert": { en: "RERA CERTIFICATE", ar: "شهادة ريرا" },
    "doc_power_attorney": { en: "POWER OF ATTY / MOA", ar: "توكيل / عقد التأسيس" },
    "doc_vat_cert": { en: "VALID VAT CERTIFICATE / VAT NDC", ar: "شهادة ضريبة القيمة المضافة السارية" },
    "doc_passport_visa": { en: "AUTHORIZED PERSON'S PASSPORT, VISA, EMIRATES ID AND E-VISA CARD", ar: "جواز سفر الشخص المفوض، التأشيرة، الهوية الإماراتية وبطاقة التأشيرة الإلكترونية" },
  };

  // Update field labels
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

  console.log("\n✅ Agency registration form updated successfully!");
  console.log("\nArabic content:");
  console.log(`  Title: ${content.ar.title}`);
  console.log(`  Subtitle: ${content.ar.subtitle}`);
  console.log(`  Submit: ${content.ar.submitLabel}`);
  if (content.ar.fields) {
    console.log("\nArabic field labels:");
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
