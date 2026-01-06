"use server";

import prisma from "@/lib/prisma";

/**
 * Get the global defaults
 */

export async function getGlobalDefaults() {
  try {
    const settings = await prisma.globalSettings.findUnique({
      where: { id: "global" },
      include: {
        defaultFooter: {
          include: {
            footerLinks: {
              orderBy: { order: "asc" },
            },
          },
        },
        defaultHeader: {
          include: {
            headerLinks: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return {
      success: true,
      footer: {
        id: settings?.defaultFooter?.id || null,
        name: settings?.defaultFooter?.name || "",
        links: settings?.defaultFooter?.footerLinks || [],
      },
      header: {
        id: settings?.defaultHeader?.id || null,
        name: settings?.defaultHeader?.name || "",
        links: settings?.defaultHeader?.headerLinks || [],
      },
    };
  } catch (error) {
    console.error("Error fetching current global footer ID:", error);
    return {
      success: false,
      footer: {
        id: null,
        name: "",
        links: [],
      },
      header: {
        id: null,
        name: "",
        links: [],
      },
    };
  }
}

/**
 * Get global SEO defaults
 */
export async function getGlobalSeoDefaults() {
  try {
    const settings = await prisma.globalSettings.findUnique({
      where: { id: "global" },
      select: {
        defaultOgImage: true,
        defaultOgSiteName: true,
        defaultOgLocale: true,
        defaultTwitterSite: true,
        defaultTwitterCreator: true,
        defaultAuthor: true,
        defaultRobots: true,
      },
    });

    if (!settings) {
      return {
        success: true,
        defaults: {
          defaultOgImage: null,
          defaultOgSiteName: null,
          defaultOgLocale: "en_US",
          defaultTwitterSite: null,
          defaultTwitterCreator: null,
          defaultAuthor: null,
          defaultRobots: "index,follow",
        },
      };
    }

    return {
      success: true,
      defaults: settings,
    };
  } catch (error) {
    console.error("Error fetching global SEO defaults:", error);
    return {
      success: false,
      defaults: {
        defaultOgImage: null,
        defaultOgSiteName: null,
        defaultOgLocale: "en_US",
        defaultTwitterSite: null,
        defaultTwitterCreator: null,
        defaultAuthor: null,
        defaultRobots: "index,follow",
      },
    };
  }
}

/**
 * Update global SEO defaults
 */
export async function updateGlobalSeoDefaults(data: {
  defaultOgImage?: string | null;
  defaultOgSiteName?: string | null;
  defaultOgLocale?: string | null;
  defaultTwitterSite?: string | null;
  defaultTwitterCreator?: string | null;
  defaultAuthor?: string | null;
  defaultRobots?: string | null;
}) {
  try {
    await prisma.globalSettings.upsert({
      where: { id: "global" },
      update: data,
      create: {
        id: "global",
        ...data,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating global SEO defaults:", error);
    return { success: false, error: "Failed to update SEO defaults" };
  }
}
