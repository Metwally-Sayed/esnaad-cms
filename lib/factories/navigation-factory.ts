import { CMS_CONFIG } from "@/config/cms.config";
import type { ActionResponse } from "@/lib/types/action-response";
import { failure, success } from "@/lib/types/action-response";
import type { NavigationData, NavigationLinkInput } from "@/lib/types/navigation";
import { logActionError } from "@/lib/utils/logger";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";

/**
 * Creates CRUD operations for Header or Footer navigation items
 * Eliminates duplication between header.ts and footer.ts
 *
 * @example
 * const headerActions = createNavigationActions("header");
 * export const getGlobalHeader = headerActions.getGlobal;
 */
export function createNavigationActions<TType extends "header" | "footer">(
  type: TType
) {
  const modelName = type === "header" ? "header" : "footer";
  const linksField = type === "header" ? "headerLinks" : "footerLinks";
  const defaultField = type === "header" ? "defaultHeader" : "defaultFooter";
  const defaultIdField =
    type === "header" ? "defaultHeaderId" : "defaultFooterId";

  /**
   * Helper function to map database links to NavigationLink format with nested children
   */
  const mapLinks = (links: any[]): any[] => {
    // Filter to get only root-level links (those without a parent)
    const rootLinks = links.filter(link => !link.parentId);

    // Recursive function to build the tree structure
    const buildTree = (parentLink: any): any => {
      const children = links
        .filter(link => link.parentId === parentLink.id)
        .map(buildTree)
        .sort((a, b) => a.order - b.order);

      return {
        id: parentLink.id,
        name: parentLink.name,
        nameAr: parentLink.nameAr,
        slug: parentLink.slug,
        order: parentLink.order,
        ...(children.length > 0 && { children }),
      };
    };

    return rootLinks.map(buildTree).sort((a, b) => a.order - b.order);
  };

  return {
    /**
     * Get the global default navigation item
     */
    getGlobal: async (): Promise<
      ActionResponse<NavigationData | null>
    > => {
      try {
        const settings = await prisma.globalSettings.findUnique({
          where: { id: "global" },
          include: {
            [defaultField]: {
              include: {
                [linksField]: {
                  include: {
                    children: {
                      orderBy: { order: "asc" as const },
                    },
                  },
                  orderBy: { order: "asc" as const },
                },
              },
            },
          },
        });

        const navigationItem: any = (settings as any)?.[defaultField];

        if (!navigationItem) {
          return failure(`No global ${type} configured`);
        }

        const navigationData: NavigationData = {
          id: navigationItem.id,
          name: navigationItem.name,
          links: mapLinks(navigationItem[linksField]),
        };

        return success(navigationData);
      } catch (error) {
        logActionError(`getGlobal${type}`, error);
        return failure(`Failed to fetch global ${type}`);
      }
    },

    /**
     * Get navigation item by ID
     */
    getById: async (
      id: string
    ): Promise<ActionResponse<NavigationData | null>> => {
      try {
        const item: any = await (prisma as any)[modelName].findUnique({
          where: { id },
          include: {
            [linksField]: {
              include: {
                children: {
                  orderBy: { order: "asc" as const },
                },
              },
              orderBy: { order: "asc" as const },
            },
          },
        });

        if (!item) {
          return failure(`${type} not found`);
        }

        const navigationData: NavigationData = {
          id: item.id,
          name: item.name,
          links: mapLinks(item[linksField]),
        };

        return success(navigationData);
      } catch (error) {
        logActionError(`get${type}ById`, error);
        return failure(`Failed to fetch ${type}`);
      }
    },

    /**
     * Get header for a specific page (either custom or global)
     */
    getForPage: async (
      pageId: string
    ): Promise<ActionResponse<NavigationData | null>> => {
      try {
        const page = await prisma.page.findUnique({
          where: { id: pageId },
          include: {
            [type]: {
              include: {
                [linksField]: {
                  include: {
                    children: {
                      orderBy: { order: "asc" as const },
                    },
                  },
                  orderBy: { order: "asc" as const },
                },
              },
            },
          },
        });

        if (!page) {
          return failure("Page not found");
        }

        // If page has custom navigation, use it
        const pageNav: any = (page as any)[type];
        if (pageNav) {
          const navigationData: NavigationData = {
            id: pageNav.id,
            name: pageNav.name,
            links: mapLinks(pageNav[linksField]),
          };
          return success(navigationData);
        }

        // Otherwise, fallback to global navigation
        const settings = await prisma.globalSettings.findUnique({
          where: { id: "global" },
          include: {
            [defaultField]: {
              include: {
                [linksField]: {
                  include: {
                    children: {
                      orderBy: { order: "asc" as const },
                    },
                  },
                  orderBy: { order: "asc" as const },
                },
              },
            },
          },
        });

        const globalItem: any = (settings as any)?.[defaultField];

        if (!globalItem) {
          return failure(`No global ${type} configured`);
        }

        const navigationData: NavigationData = {
          id: globalItem.id,
          name: globalItem.name,
          links: mapLinks(globalItem[linksField]),
        };

        return success(navigationData);
      } catch (error) {
        logActionError(`get${type}ForPage`, error);
        return failure(`Failed to fetch ${type} for page`);
      }
    },

    /**
     * Get all navigation items
     */
    getAll: async (): Promise<
      ActionResponse<
        Array<{ id: string; name: string; linksCount: number; isGlobal: boolean }>
      >
    > => {
      try {
        const [items, settings] = await Promise.all([
          (prisma as any)[modelName].findMany({
            include: {
              [linksField]: true,
              _count: {
                select: {
                  [linksField]: true,
                },
              },
            },
            orderBy: { createdAt: "desc" as const },
          }),
          prisma.globalSettings.findUnique({
            where: { id: "global" },
            select: { [defaultIdField]: true },
          }),
        ]);

        const globalId = (settings as any)?.[defaultIdField];

        const result = items.map((item: any) => ({
          id: item.id,
          name: item.name,
          linksCount: item._count[linksField],
          isGlobal: item.id === globalId,
        }));

        return success(result);
      } catch (error) {
        logActionError(`getAll${type}s`, error);
        return failure(`Failed to fetch ${type}s`);
      }
    },

    /**
     * Set a navigation item as the global default
     */
    setAsGlobal: async (id: string): Promise<ActionResponse<void>> => {
      try {
        // Verify the item exists
        const item = await (prisma as any)[modelName].findUnique({
          where: { id },
        });

        if (!item) {
          return failure(`${type} not found`);
        }

        // Upsert global settings
        await prisma.globalSettings.upsert({
          where: { id: "global" },
          update: {
            [defaultIdField]: id,
          },
          create: {
            id: "global",
            siteName: CMS_CONFIG.siteName,
            siteDescription: CMS_CONFIG.siteDescription,
            [defaultIdField]: id,
          },
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return success(undefined);
      } catch (error) {
        logActionError(`setGlobal${type}`, error);
        return failure(`Failed to set global ${type}`);
      }
    },

    /**
     * Get the current global navigation ID
     */
    getCurrentGlobalId: async (): Promise<
      ActionResponse<string | null>
    > => {
      try {
        const settings = await prisma.globalSettings.findUnique({
          where: { id: "global" },
          select: { [defaultIdField]: true },
        });

        return success((settings as any)?.[defaultIdField] || null);
      } catch (error) {
        logActionError(`getCurrentGlobal${type}Id`, error);
        return failure(`Failed to fetch current global ${type} ID`);
      }
    },

    /**
     * Update links for a specific navigation item
     */
    updateLinks: async (
      id: string,
      links: NavigationLinkInput[]
    ): Promise<ActionResponse<void>> => {
      try {
        // Use a transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
          const linkModelName = linksField === "headerLinks" ? "headerLink" : "footerLink";
          const foreignKeyField = type === "header" ? "headerId" : "footerId";

          // 1. Delete existing links for this item
          await (tx as any)[linkModelName].deleteMany({
            where: { [foreignKeyField]: id },
          });

          // 2. Flatten nested structure and create all links
          const flattenLinks = (linksList: NavigationLinkInput[], parentId: string | null = null): any[] => {
            const result: any[] = [];
            for (const link of linksList) {
              result.push({
                [foreignKeyField]: id,
                name: link.name,
                slug: link.slug,
                order: link.order,
                parentId: link.parentId ?? parentId,
              });

              // Recursively process children
              if (link.children && link.children.length > 0) {
                result.push(...flattenLinks(link.children, link.id ?? null));
              }
            }
            return result;
          };

          // 3. Create new links
          if (links.length > 0) {
            const flattenedLinks = flattenLinks(links);
            await (tx as any)[linkModelName].createMany({
              data: flattenedLinks,
            });
          }
        });

        revalidatePath("/");
        revalidatePath("/admin");

        return success(undefined);
      } catch (error) {
        logActionError(`update${type}Links`, error);
        return failure(`Failed to update ${type} links`);
      }
    },

    /**
     * Create a new navigation item
     */
    create: async (name: string): Promise<ActionResponse<{ id: string }>> => {
      try {
        const item = await (prisma as any)[modelName].create({
          data: { name },
        });

        revalidatePath("/admin");

        return success({ id: item.id });
      } catch (error) {
        logActionError(`create${type}`, error);
        return failure(`Failed to create ${type}`);
      }
    },

    /**
     * Delete a navigation item
     */
    delete: async (id: string): Promise<ActionResponse<void>> => {
      try {
        await (prisma as any)[modelName].delete({
          where: { id },
        });

        revalidatePath("/admin");

        return success(undefined);
      } catch (error) {
        logActionError(`delete${type}`, error);
        return failure(`Failed to delete ${type}`);
      }
    },
  };
}
