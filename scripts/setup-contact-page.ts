import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting up Contact Us page...");

  // 1. Find or create the Contact Us page
  let contactPage = await prisma.page.findFirst({
    where: { slug: "contact-us" },
  });

  if (!contactPage) {
    contactPage = await prisma.page.create({
      data: {
        title: "Contact Us",
        slug: "contact-us",
        description: "Get in touch with us",
        published: true,
      },
    });
    console.log("Created Contact Us page");
  } else {
    console.log("Found existing Contact Us page");
  }

  // 2. Clear existing blocks for this page to avoid duplicates
  await prisma.pageBlock.deleteMany({
    where: { pageId: contactPage.id },
  });
  console.log("Cleared existing blocks for Contact Us page");

  // 3. Create Hero Block
  const heroBlock = await prisma.block.create({
    data: {
      name: "Contact Hero",
      type: "HERO",
      variant: "hero-minimal-text",
      content: {
        title: "CONTACT US",
        subtitle: "GET IN TOUCH WITH OUR TEAM",
        backgroundColor: "#F8F8F8",
        textColor: "#000000",
        textAlign: "center",
      },
      isGlobal: false,
    },
  });

  // 4. Create Form Block
  const formBlock = await prisma.block.create({
    data: {
      name: "Contact Form",
      type: "FORM",
      variant: "default",
      content: {
        title: "SEND US A MESSAGE",
        submitLabel: "SEND",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
            width: "full",
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            width: "full",
          },
          {
            name: "phone",
            label: "Phone",
            type: "tel",
            required: true,
            width: "full",
          },
          {
            name: "message",
            label: "Message",
            type: "textarea",
            required: true,
            width: "full",
          },
        ],
      },
      isGlobal: false,
    },
  });

  // 5. Link blocks to page
  await prisma.pageBlock.create({
    data: {
      pageId: contactPage.id,
      blockId: heroBlock.id,
      order: 0,
    },
  });

  await prisma.pageBlock.create({
    data: {
      pageId: contactPage.id,
      blockId: formBlock.id,
      order: 1,
    },
  });

  console.log("Contact Us page setup complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
