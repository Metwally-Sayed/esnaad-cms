"use server";

import {
  invalidateCollectionCaches,
  invalidatePageCaches,
  invalidatePageCachesBySlugs,
} from "@/lib/cache/invalidate";
import { normalizePageSlug } from "@/lib/cache/tags";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/lib/types/action-response";
import { success, failure } from "@/lib/types/action-response";
import { resolveLocalizedContent } from "@/lib/localized-content";
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
    invalidateCollectionCaches(collection.id);
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
    invalidateCollectionCaches(collection.id);
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
    invalidateCollectionCaches(id);
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
    let createdPageSlug: string | undefined;
    if (collection.hasProfilePages && collection.profilePageSlugPattern) {
      const content = (validated.content || {}) as Record<string, unknown>;

      // Extract data from localized structure if present
      let itemData = content;
      if (content.en && typeof content.en === 'object') {
        itemData = content.en as Record<string, unknown>;
      } else if (content.ar && typeof content.ar === 'object') {
        itemData = content.ar as Record<string, unknown>;
      }

      const itemSlug = itemData.slug as string | undefined;
      const itemTitle = itemData.title as string | undefined;
      const itemDescription = itemData.description as string | undefined;

      if (itemSlug) {
        // Generate page slug from pattern
        const pageSlug = normalizePageSlug(
          collection.profilePageSlugPattern.replace("[slug]", itemSlug)
        );

        // Create the page
        const page = await prisma.page.create({
          data: {
            title: itemTitle || itemSlug,
            slug: pageSlug,
            description: itemDescription || undefined,
            published: true,
          },
        });

        pageId = page.id;
        createdPageSlug = pageSlug;
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

    invalidateCollectionCaches(validated.collectionId);
    if (createdPageSlug) {
      invalidatePageCaches(createdPageSlug);
    }

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
        page: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!existingItem) {
      return failure("Collection item not found");
    }

    const content = (validated.content || {}) as Record<string, unknown>;
    const previousPageSlug = existingItem.page?.slug;
    let nextPageSlug: string | undefined;

    // Handle page updates if profile pages are enabled
    if (existingItem.collection.hasProfilePages && existingItem.collection.profilePageSlugPattern) {
      // Extract data from localized structure if present
      let itemData = content;
      if (content.en && typeof content.en === 'object') {
        itemData = content.en as Record<string, unknown>;
      } else if (content.ar && typeof content.ar === 'object') {
        itemData = content.ar as Record<string, unknown>;
      }

      const itemSlug = itemData.slug as string | undefined;
      const itemTitle = itemData.title as string | undefined;
      const itemDescription = itemData.description as string | undefined;

      if (itemSlug) {
        const pageSlug = normalizePageSlug(
          existingItem.collection.profilePageSlugPattern.replace("[slug]", itemSlug)
        );
        nextPageSlug = pageSlug;

        if (existingItem.pageId) {
          // Update existing page
          await prisma.page.update({
            where: { id: existingItem.pageId },
            data: {
              title: itemTitle || itemSlug,
              slug: pageSlug,
              description: itemDescription || undefined,
            },
          });
        } else {
          // Create page if it doesn't exist
          const page = await prisma.page.create({
            data: {
              title: itemTitle || itemSlug,
              slug: pageSlug,
              description: itemDescription || undefined,
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

    invalidateCollectionCaches(existingItem.collectionId);
    invalidatePageCachesBySlugs(
      [previousPageSlug, nextPageSlug].filter(Boolean) as string[]
    );

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

// --- Frontend collection helpers (used by marketing blocks) ---

export type ProjectCard = {
  title?: string;
  image?: string;
  link?: string;
  actionLabel?: string;
  actionType?: "button" | "link";
};

export type ProjectRelationOption = {
  id: string;
  title: string;
  link?: string;
};

export async function getProjectRelationOptions(
  locale: string = "en"
): Promise<ActionResponse<ProjectRelationOption[]>> {
  try {
    const projectItems = await prisma.collectionItem.findMany({
      where: {
        collection: {
          slug: "projects",
        },
      },
      include: {
        page: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    const options = projectItems.map((item) => {
      const rawContent = item.content as Record<string, unknown>;
      const typedData = resolveLocalizedContent(rawContent, locale) as {
        title?: string;
        slug?: string;
      };

      const fallbackLink = typedData.slug ? `/projects/${typedData.slug}` : undefined;

      return {
        id: item.id,
        title: typedData.title || typedData.slug || item.id,
        link: item.page?.slug || fallbackLink,
      };
    });

    return success(options);
  } catch (error) {
    logActionError("getProjectRelationOptions", error);
    if (error instanceof Error) {
      return failure(error.message);
    }
    return failure("Failed to fetch project options");
  }
}

export async function getProjectCards({
  collectionId,
  locale,
}: {
  collectionId?: string;
  locale: string;
}): Promise<ProjectCard[]> {
  if (!collectionId) {
    return [];
  }

  const items = await prisma.collectionItem.findMany({
    where: { collectionId },
    orderBy: { order: "asc" },
  });

  const relatedProjectIds = new Set<string>();
  const localizedItems = items.map((item) => {
    const rawContent = item.content as Record<string, unknown>;
    const typedData = resolveLocalizedContent(rawContent, locale) as {
      title?: string;
      image?: string;
      slug?: string;
      link?: string;
      actionLabel?: string;
      actionType?: "button" | "link";
      relatedProjectId?: string;
    };

    const relatedProjectId =
      typeof typedData.relatedProjectId === "string"
        ? typedData.relatedProjectId.trim()
        : "";

    if (relatedProjectId) {
      relatedProjectIds.add(relatedProjectId);
    }

    return {
      itemId: item.id,
      typedData,
      relatedProjectId,
    };
  });

  const relatedProjectLinkById = new Map<string, string>();
  if (relatedProjectIds.size > 0) {
    const relatedProjects = await prisma.collectionItem.findMany({
      where: {
        id: { in: Array.from(relatedProjectIds) },
        collection: {
          slug: "projects",
        },
      },
      include: {
        page: {
          select: {
            slug: true,
          },
        },
      },
    });

    relatedProjects.forEach((projectItem) => {
      const projectContent = resolveLocalizedContent(
        projectItem.content as Record<string, unknown>,
        locale
      ) as { slug?: string };
      const fallbackLink = projectContent.slug ? `/projects/${projectContent.slug}` : undefined;
      const link = projectItem.page?.slug || fallbackLink;
      if (link) {
        relatedProjectLinkById.set(projectItem.id, link);
      }
    });
  }

  return localizedItems.map(({ typedData, relatedProjectId }) => {
    let finalLink = typedData.link;
    if (relatedProjectId && relatedProjectLinkById.has(relatedProjectId)) {
      finalLink = relatedProjectLinkById.get(relatedProjectId);
    }
    if (!finalLink && typedData.slug) {
      finalLink = `/projects/${typedData.slug}`;
    }

    return {
      title: typedData.title,
      image: typedData.image,
      link: finalLink,
      actionLabel: typedData.actionLabel,
      actionType: typedData.actionType,
    };
  });
}

export type PhilosophyItemContent = {
  image?: string;
  title?: string;
  description?: string;
  link?: string;
};

export async function getPhilosophyItems(collectionId?: string, locale: string = "en") {
  if (!collectionId) {
    return [];
  }

  const collectionItems = await prisma.collectionItem.findMany({
    where: { collectionId },
    orderBy: { order: "asc" },
  });

  const relatedProjectIds = new Set<string>();
  const localizedItems = collectionItems.map((item) => {
    const raw = item.content as Record<string, unknown>;
    const localized = resolveLocalizedContent(raw, locale) as PhilosophyItemContent & {
      relatedProjectId?: string;
    };

    const relatedProjectId =
      typeof localized.relatedProjectId === "string"
        ? localized.relatedProjectId.trim()
        : "";

    if (relatedProjectId) {
      relatedProjectIds.add(relatedProjectId);
    }

    return { localized, relatedProjectId };
  });

  const relatedProjectLinkById = new Map<string, string>();
  if (relatedProjectIds.size > 0) {
    const relatedProjects = await prisma.collectionItem.findMany({
      where: {
        id: { in: Array.from(relatedProjectIds) },
        collection: { slug: "projects" },
      },
      include: {
        page: {
          select: {
            slug: true,
          },
        },
      },
    });

    relatedProjects.forEach((projectItem) => {
      const projectContent = resolveLocalizedContent(
        projectItem.content as Record<string, unknown>,
        locale
      ) as { slug?: string };
      const fallbackLink = projectContent.slug ? `/projects/${projectContent.slug}` : undefined;
      const link = projectItem.page?.slug || fallbackLink;
      if (link) {
        relatedProjectLinkById.set(projectItem.id, link);
      }
    });
  }

  return localizedItems.map(({ localized, relatedProjectId }) => {
    const relationLink =
      relatedProjectId && relatedProjectLinkById.has(relatedProjectId)
        ? relatedProjectLinkById.get(relatedProjectId)
        : undefined;

    return {
      ...localized,
      link: relationLink || localized.link,
    };
  });
}

export async function deleteCollectionItem(itemId: string) {
  try {
    // Get item with page info
    const item = await prisma.collectionItem.findUnique({
      where: { id: itemId },
      select: {
        collectionId: true,
        pageId: true,
        page: {
          select: {
            slug: true,
          },
        },
      },
    });

    // Delete associated page if it exists
    if (item?.pageId) {
      await prisma.page.delete({
        where: { id: item.pageId },
      });
    }

    // Delete collection item (cascade will handle relations)
    await prisma.collectionItem.delete({ where: { id: itemId } });

    if (item?.collectionId) {
      invalidateCollectionCaches(item.collectionId);
    }
    if (item?.page?.slug) {
      invalidatePageCaches(item.page.slug);
    }

    revalidatePath(`/admin/collections`);
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection item:", error);
    return { success: false, error: "Failed to delete item" };
  }
}
