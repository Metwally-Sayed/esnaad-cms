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
