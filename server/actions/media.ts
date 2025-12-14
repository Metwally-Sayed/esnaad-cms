"use server";

import prisma from "@/lib/prisma";
import type { ActionResponse } from "@/lib/types/action-response";
import { failure, success } from "@/lib/types/action-response";
import { logActionError } from "@/lib/utils/logger";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { JSONContent } from "novel";

export type MediaItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: JSONContent;
  descriptionAr?: JSONContent;
  slug: string;
  order: number;
  type: string;
  image: string;
  updatedAt?: Date;
  createdAt?: Date;
};

export type CreateMediaItemInput = Omit<MediaItem, "id">;
export type UpdateMediaItemInput = Partial<CreateMediaItemInput>;

// Get the Media collection
async function getMediaCollection() {
  const collection = await prisma.collection.findUnique({
    where: { slug: "media" },
  });
  if (!collection) {
    throw new Error("Media collection not found");
  }
  return collection;
}

// Get all media items (posts only, excludes categories)
export async function getAllMediaItems(
  sortBy: "order" | "updatedAt" | "createdAt" = "order"
): Promise<ActionResponse<MediaItem[]>> {
  try {
    const collection = await getMediaCollection();

    let orderBy: Record<string, "asc" | "desc"> = { order: "asc" };
    if (sortBy === "updatedAt" || sortBy === "createdAt") {
      orderBy = { [sortBy]: "desc" };
    }

    const items = await prisma.collectionItem.findMany({
      where: { collectionId: collection.id },
      orderBy,
    });

    const mediaItems: MediaItem[] = items
      .filter((item) => {
        const content = item.content as Record<string, unknown>;
        // Filter out category items - only show actual media posts
        return (content.type as string) !== "category";
      })
      .map((item) => {
        const content = item.content as Record<string, unknown>;
        return {
          id: item.id,
          nameEn: (content.nameEn as string) || "",
          nameAr: (content.nameAr as string) || "",
          descriptionEn: content.descriptionEn as JSONContent | undefined,
          descriptionAr: content.descriptionAr as JSONContent | undefined,
          slug: (content.slug as string) || "",
          order: item.order,
          type: (content.type as string) || "",
          image: (content.image as string) || "",
          updatedAt: item.updatedAt,
          createdAt: item.createdAt,
        };
      });

    return success(mediaItems);
  } catch (error) {
    logActionError("getAllMediaItems", error);
    return failure("Failed to fetch media items");
  }
}

// Get all category items
export async function getAllCategories(): Promise<ActionResponse<MediaItem[]>> {
  try {
    const collection = await getMediaCollection();

    const items = await prisma.collectionItem.findMany({
      where: { collectionId: collection.id },
      orderBy: { order: "asc" },
    });

    const categories: MediaItem[] = items
      .filter((item) => {
        const content = item.content as Record<string, unknown>;
        // Only get category items
        return (content.type as string) === "category";
      })
      .map((item) => {
        const content = item.content as Record<string, unknown>;
        return {
          id: item.id,
          nameEn: (content.nameEn as string) || "",
          nameAr: (content.nameAr as string) || "",
          descriptionEn: content.descriptionEn as JSONContent | undefined,
          descriptionAr: content.descriptionAr as JSONContent | undefined,
          slug: (content.slug as string) || "",
          order: item.order,
          type: (content.type as string) || "",
          image: (content.image as string) || "",
          updatedAt: item.updatedAt,
          createdAt: item.createdAt,
        };
      });

    return success(categories);
  } catch (error) {
    logActionError("getAllCategories", error);
    return failure("Failed to fetch categories");
  }
}

// Get single media item
export async function getMediaItemById(itemId: string): Promise<ActionResponse<MediaItem>> {
  try {
    const item = await prisma.collectionItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return failure("Media item not found");
    }

    const content = item.content as Record<string, unknown>;
    const mediaItem: MediaItem = {
      id: item.id,
      nameEn: (content.nameEn as string) || "",
      nameAr: (content.nameAr as string) || "",
      descriptionEn: content.descriptionEn as JSONContent | undefined,
      descriptionAr: content.descriptionAr as JSONContent | undefined,
      slug: (content.slug as string) || "",
      order: item.order,
      type: (content.type as string) || "",
      image: (content.image as string) || "",
    };

    return success(mediaItem);
  } catch (error) {
    logActionError("getMediaItemById", error);
    return failure("Failed to fetch media item");
  }
}

// Create media item
export async function createMediaItem(
  input: CreateMediaItemInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const collection = await getMediaCollection();

    // Get max order
    const maxOrder = await prisma.collectionItem.findFirst({
      where: { collectionId: collection.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const order = input.order ?? ((maxOrder?.order ?? -1) + 1);

    const item = await prisma.collectionItem.create({
      data: {
        collectionId: collection.id,
        content: input as Prisma.InputJsonValue,
        order,
      },
    });

    revalidatePath("/admin/media");
    return success({ id: item.id });
  } catch (error) {
    logActionError("createMediaItem", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to create media item");
  }
}

// Update media item
export async function updateMediaItem(
  itemId: string,
  input: UpdateMediaItemInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    // Get existing item
    const existingItem = await prisma.collectionItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return failure("Media item not found");
    }

    // Merge existing content with updates
    const existingContent = existingItem.content as Record<string, unknown>;
    const updatedContent = { ...existingContent, ...input };

    const item = await prisma.collectionItem.update({
      where: { id: itemId },
      data: {
        content: updatedContent as Prisma.InputJsonValue,
        order: input.order ?? existingItem.order,
      },
    });

    revalidatePath("/admin/media");
    return success({ id: item.id });
  } catch (error) {
    logActionError("updateMediaItem", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to update media item");
  }
}

// Delete media item
export async function deleteMediaItem(itemId: string): Promise<ActionResponse<void>> {
  try {
    await prisma.collectionItem.delete({ where: { id: itemId } });
    revalidatePath("/admin/media");
    return success(undefined);
  } catch (error) {
    logActionError("deleteMediaItem", error);
    return failure("Failed to delete media item");
  }
}

// Reorder media items
export async function reorderMediaItems(
  items: { id: string; order: number }[]
): Promise<ActionResponse<void>> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.collectionItem.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath("/admin/media");
    return success(undefined);
  } catch (error) {
    logActionError("reorderMediaItems", error);
    return failure("Failed to reorder media items");
  }
}
