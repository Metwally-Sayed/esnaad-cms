"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/lib/types/action-response";
import { success, failure } from "@/lib/types/action-response";
import { logActionError } from "@/lib/utils/logger";
import {
  createCollectionSchema,
  updateCollectionSchema,
  createCollectionItemSchema,
  updateCollectionItemSchema,
  type CreateCollectionInput,
  type UpdateCollectionInput,
  type CreateCollectionItemInput,
  type UpdateCollectionItemInput,
} from "@/lib/validators/collection";
import type { Prisma } from "@prisma/client";

// --- Collection Actions ---

export async function getAllCollections() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
    return { success: true, data: collections };
  } catch (error) {
    console.error("Error fetching collections:", error);
    return { success: false, error: "Failed to fetch collections" };
  }
}

export async function getCollectionById(id: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });
    if (!collection) return { success: false, error: "Collection not found" };
    return { success: true, data: collection };
  } catch (error) {
    console.error("Error fetching collection:", error);
    return { success: false, error: "Failed to fetch collection" };
  }
}

export async function createCollection(
  input: CreateCollectionInput
): Promise<ActionResponse<{ id: string; name: string; slug: string }>> {
  try {
    // Validate input
    const validated = createCollectionSchema.parse(input);

    const collection = await prisma.collection.create({
      data: validated,
    });
    revalidatePath("/admin/collections");
    return success(collection);
  } catch (error) {
    logActionError("createCollection", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to create collection");
  }
}

export async function updateCollection(
  id: string,
  input: UpdateCollectionInput
): Promise<ActionResponse<{ id: string; name: string; slug: string }>> {
  try {
    // Validate input
    const validated = updateCollectionSchema.parse(input);

    const collection = await prisma.collection.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/admin/collections");
    return success(collection);
  } catch (error) {
    logActionError("updateCollection", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to update collection");
  }
}

export async function deleteCollection(id: string) {
  try {
    await prisma.collection.delete({ where: { id } });
    revalidatePath("/admin/collections");
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}

// --- Collection Item Actions ---

export async function createCollectionItem(
  input: CreateCollectionItemInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    // Validate input
    const validated = createCollectionItemSchema.parse(input);

    // Get collection to check if profile pages are enabled
    const collection = await prisma.collection.findUnique({
      where: { id: validated.collectionId },
      select: {
        hasProfilePages: true,
        profilePageSlugPattern: true,
      },
    });

    if (!collection) {
      return failure("Collection not found");
    }

    // Get max order
    const maxOrder = await prisma.collectionItem.findFirst({
      where: { collectionId: validated.collectionId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const order = (maxOrder?.order ?? -1) + 1;

    // Check if we need to create a page for this item
    let pageId: string | undefined;
    if (collection.hasProfilePages && collection.profilePageSlugPattern) {
      const content = (validated.content || {}) as Record<string, unknown>;
      const itemSlug = content.slug as string | undefined;

      if (itemSlug) {
        // Generate page slug from pattern
        const pageSlug = collection.profilePageSlugPattern.replace("[slug]", itemSlug);

        // Create the page
        const page = await prisma.page.create({
          data: {
            title: (content.title as string) || itemSlug,
            slug: pageSlug,
            description: (content.description as string) || undefined,
            published: true,
          },
        });

        pageId = page.id;
      }
    }

    const item = await prisma.collectionItem.create({
      data: {
        collectionId: validated.collectionId,
        content: (validated.content || {}) as Prisma.InputJsonValue,
        order,
        pageId,
      },
    });

    revalidatePath(`/admin/collections/${validated.collectionId}`);
    revalidatePath("/admin/pages");
    return success({ id: item.id });
  } catch (error) {
    logActionError("createCollectionItem", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to create item");
  }
}

export async function updateCollectionItem(
  itemId: string,
  input: UpdateCollectionItemInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    // Validate input
    const validated = updateCollectionItemSchema.parse(input);

    // Get existing item with collection info
    const existingItem = await prisma.collectionItem.findUnique({
      where: { id: itemId },
      include: {
        collection: {
          select: {
            hasProfilePages: true,
            profilePageSlugPattern: true,
          },
        },
      },
    });

    if (!existingItem) {
      return failure("Collection item not found");
    }

    const content = (validated.content || {}) as Record<string, unknown>;

    // Handle page updates if profile pages are enabled
    if (existingItem.collection.hasProfilePages && existingItem.collection.profilePageSlugPattern) {
      const itemSlug = content.slug as string | undefined;

      if (itemSlug) {
        const pageSlug = existingItem.collection.profilePageSlugPattern.replace("[slug]", itemSlug);

        if (existingItem.pageId) {
          // Update existing page
          await prisma.page.update({
            where: { id: existingItem.pageId },
            data: {
              title: (content.title as string) || itemSlug,
              slug: pageSlug,
              description: (content.description as string) || undefined,
            },
          });
        } else {
          // Create page if it doesn't exist
          const page = await prisma.page.create({
            data: {
              title: (content.title as string) || itemSlug,
              slug: pageSlug,
              description: (content.description as string) || undefined,
              published: true,
            },
          });

          // Link page to item
          await prisma.collectionItem.update({
            where: { id: itemId },
            data: { pageId: page.id },
          });
        }
      } else if (existingItem.pageId) {
        // If slug is removed, delete the page
        await prisma.page.delete({
          where: { id: existingItem.pageId },
        });
      }
    }

    const item = await prisma.collectionItem.update({
      where: { id: itemId },
      data: { content: (validated.content || {}) as Prisma.InputJsonValue },
    });

    revalidatePath(`/admin/collections`);
    revalidatePath("/admin/pages");
    return success({ id: item.id });
  } catch (error) {
    logActionError("updateCollectionItem", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to update item");
  }
}

export async function deleteCollectionItem(itemId: string) {
  try {
    // Get item with page info
    const item = await prisma.collectionItem.findUnique({
      where: { id: itemId },
      select: { pageId: true },
    });

    // Delete associated page if it exists
    if (item?.pageId) {
      await prisma.page.delete({
        where: { id: item.pageId },
      });
    }

    // Delete collection item (cascade will handle relations)
    await prisma.collectionItem.delete({ where: { id: itemId } });

    revalidatePath(`/admin/collections`);
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}
