
import prisma from "@/lib/prisma";

export async function getAvailableBlocks() {
  try {
    const blocks = await prisma.block.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      success: true,
      data: blocks.map((block) => ({
        id: block.id,
        name: block.name,
        type: block.type,
        content: block.content as Record<string, unknown> | null,
        isGlobal: block.isGlobal,
        createdAt: block.createdAt.toISOString(),
        updatedAt: block.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return {
      success: false,
      error: "Failed to load blocks.",
      data: [],
    };
  }
}
