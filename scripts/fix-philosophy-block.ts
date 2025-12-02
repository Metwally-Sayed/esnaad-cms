import { prisma } from "../lib/prisma";

async function fixPhilosophyBlock() {
  // Update the Philosophy Section block to use the correct variant
  const result = await prisma.block.update({
    where: { id: "cmi8ukks6000818lrk6gddggm" },
    data: { 
      variant: "about-philosophy",
      // Clean up the content to only have the philosophy fields
      content: {
        sectionTitle: "ESNAAD PHILOSOPHY",
        subtitle: "WHAT WE STAND FOR",
        collectionId: "cmi8sywe0000018cu94z27xua",
        customColors: false,
        backgroundColor: "#ffffff",
        titleColor: "#000000",
        textColor: "#4a4a4a",
      }
    },
  });
  
  console.log("Updated block:", result);
  await prisma.$disconnect();
}

fixPhilosophyBlock();
