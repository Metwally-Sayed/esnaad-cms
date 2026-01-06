import prisma from "../lib/prisma";

async function addFloorPlansField() {
  try {
    console.log("🔍 Finding Projects collection...");

    const projectsCollection = await prisma.collection.findUnique({
      where: { slug: "projects" },
    });

    if (!projectsCollection) {
      console.error("❌ Projects collection not found");
      return;
    }

    console.log("✅ Found Projects collection:", projectsCollection.name);

    // Get existing fields
    const existingFields = projectsCollection.fields as Array<{
      key: string;
      type: string;
      required?: boolean;
      description?: string;
    }> || [];

    console.log("📋 Existing fields:", existingFields.map(f => f.key).join(", "));

    // Check if floorPlans already exists
    if (existingFields.some(f => f.key === "floorPlans")) {
      console.log("⚠️  floorPlans field already exists");
      return;
    }

    // Add floorPlans field
    const updatedFields = [
      ...existingFields,
      {
        key: "floorPlans",
        type: "text", // Will be handled as MultiImagePicker in the form
        required: false,
        description: "Floor plan images (comma-separated URLs)"
      }
    ];

    // Update collection
    await prisma.collection.update({
      where: { id: projectsCollection.id },
      data: {
        fields: updatedFields,
      },
    });

    console.log("✅ Successfully added floorPlans field to Projects collection");
    console.log("📋 Updated fields:", updatedFields.map(f => f.key).join(", "));

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addFloorPlansField();
