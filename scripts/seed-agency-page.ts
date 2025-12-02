
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Agency Registration page...");

  // 1. Create the Block
  const formContent = {
    title: "AGENCY REGISTRATION",
    subtitle: "WELCOME TO THE REAL ESTATE BROKERAGE REGISTRATION PORTAL",
    introText: "WE ARE EXCITED TO ESTABLISH PARTNERSHIPS WITH ESTEEMED REAL ESTATE AGENCIES OR BROKER COMPANIES. PLEASE COMPLETE THE FOLLOWING FORM TO INITIATE THE REGISTRATION PROCESS.",
    submitLabel: "REGISTER NOW",
    successMessage: "Thank you for your registration request. Our team will review your application and get back to you shortly.",
    fields: [
      // Company Information
      { name: "company_name", label: "Company Name", type: "text", width: "full", required: true },
      { name: "company_type", label: "Company Type", type: "text", width: "full", required: true },
      { name: "trade_license_number", label: "Trade License Number", type: "text", width: "full", required: true },
      { name: "trade_license_expiry", label: "Trade License Expiry", type: "text", width: "full", required: true },
      { name: "rera_certificate_expiry", label: "RERA Certificate Expiry", type: "text", width: "full", required: true },
      { name: "po_box_no", label: "P.O. Box No", type: "text", width: "full", required: true },
      { name: "company_address", label: "Company Address", type: "text", width: "full", required: true },
      { name: "company_email", label: "Company Email", type: "email", width: "full", required: true },
      { name: "company_landline", label: "Company Land Line Number", type: "tel", width: "full", required: true },
      { name: "company_website", label: "Company Website", type: "text", width: "full", required: false },

      // Authorized Person Information
      { name: "auth_person_header", label: "AUTHORIZED PERSON INFORMATION", type: "section-header" },
      { name: "auth_person_name", label: "Trade License Name", type: "text", width: "full", required: true },
      { 
        name: "nationality", 
        label: "Nationality", 
        type: "select", 
        width: "full", 
        required: true,
        options: [
          { label: "United Arab Emirates", value: "UAE" },
          { label: "United States", value: "USA" },
          { label: "United Kingdom", value: "UK" },
          { label: "India", value: "IN" },
          { label: "Other", value: "Other" }
        ]
      },
      { name: "passport_number", label: "Passport Number", type: "text", width: "full", required: true },
      { name: "designation", label: "Designation/Position", type: "text", width: "full", required: true },
      { name: "auth_person_email", label: "Email", type: "email", width: "full", required: true },
      { name: "auth_person_contact", label: "Contact Number", type: "tel", width: "full", required: true },
      { name: "auth_person_address", label: "Address", type: "text", width: "full", required: true },
      { name: "auth_person_city", label: "City", type: "text", width: "full", required: true },

      // Banking Information
      { name: "banking_header", label: "BANKING INFORMATION", type: "section-header" },
      { name: "beneficiary_name", label: "Account/Beneficiary Name", type: "text", width: "full", required: true },
      { name: "bank_name", label: "Bank Name", type: "text", width: "full", required: true },
      { name: "bank_country", label: "Bank Country", type: "text", width: "full", required: true },
      { name: "bank_city", label: "Bank City", type: "text", width: "full", required: true },
      { name: "account_number", label: "Account Number", type: "text", width: "full", required: true },
      { name: "iban_number", label: "IBAN Number", type: "text", width: "full", required: true },
      { name: "swift_code", label: "Swift Code", type: "text", width: "full", required: true },

      // Documents
      { name: "documents_header", label: "DOCUMENTS", type: "section-header" },
      { name: "doc_trade_license", label: "Valid Trade Licence", type: "file", width: "full", required: true },
      { name: "doc_rera_cert", label: "RERA Certificate", type: "file", width: "full", required: true },
      { name: "doc_power_attorney", label: "Power of Atty / MOA", type: "file", width: "full", required: true },
      { name: "doc_vat_cert", label: "Valid VAT Certificate / VAT NDC", type: "file", width: "full", required: true },
      { name: "doc_passport_visa", label: "Authorized Person's Passport, VISA, Emirates ID and E-visa Card", type: "file", width: "full", required: true },
    ]
  };

  const block = await prisma.block.create({
    data: {
      name: "Agency Registration Form",
      type: "FORM",
      variant: "agency-registration",
      content: formContent,
      isGlobal: false,
    },
  });

  console.log(`Created block with ID: ${block.id}`);

  // 2. Create the Page
  const page = await prisma.page.create({
    data: {
      title: "Agency Registration",
      slug: "/agency-register",
      description: "Register your real estate agency with ESNAAD.",
      published: true,
    },
  });

  console.log(`Created page with ID: ${page.id}`);

  // 3. Link Block to Page
  await prisma.pageBlock.create({
    data: {
      pageId: page.id,
      blockId: block.id,
      order: 0,
    },
  });

  console.log("Successfully linked block to page.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
