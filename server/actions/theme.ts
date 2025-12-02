"use server";

import prisma from "@/lib/prisma";
import { ThemeName } from "@/lib/theme-config";
import { EnumTheme } from "@prisma/client";
import { CMS_CONFIG } from "@/config/cms.config";

// Map frontend theme names to database enum values
const themeNameToEnum: Record<ThemeName, EnumTheme> = {
  default: EnumTheme.DEFAULT,
  amber: EnumTheme.AMBER,
  vercel: EnumTheme.VERCEL,
  caffeine: EnumTheme.CAFFEINE,
  claude: EnumTheme.CLAUDE,
  darkmatter: EnumTheme.DARKMATTER,
  fancey: EnumTheme.FANCEY,
  whitekoala: EnumTheme.WHITEKOALA,
};

export async function saveTheme(themeName: ThemeName) {
  try {
    const themeEnum = themeNameToEnum[themeName];

    if (!themeEnum) {
      return {
        success: false,
        error: "Invalid theme name",
      };
    }

    // Check if a theme record already exists
    const existingTheme = await prisma.theme.findFirst();

    if (existingTheme) {
      // Update existing theme
      await prisma.theme.update({
        where: { id: existingTheme.id },
        data: { name: themeEnum },
      });
    } else {
      // Create new theme record
      await prisma.theme.create({
        data: { name: themeEnum },
      });
    }

    return {
      success: true,
      message: "Theme saved successfully",
    };
  } catch (error) {
    console.error("Error saving theme:", error);
    return {
      success: false,
      error: "Failed to save theme",
    };
  }
}

export async function getActiveTheme() {
  try {
    const theme = await prisma.theme.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!theme) {
      return {
        success: true,
        theme: CMS_CONFIG.defaultTheme,
      };
    }

    // Map database enum to frontend theme name
    const enumToThemeName: Record<EnumTheme, ThemeName> = {
      [EnumTheme.DEFAULT]: "default",
      [EnumTheme.AMBER]: "amber",
      [EnumTheme.VERCEL]: "vercel",
      [EnumTheme.CAFFEINE]: "caffeine",
      [EnumTheme.CLAUDE]: "claude",
      [EnumTheme.DARKMATTER]: "darkmatter",
      [EnumTheme.FANCEY]: "fancey",
      [EnumTheme.WHITEKOALA]: "whitekoala",
    };

    return {
      success: true,
      theme: enumToThemeName[theme.name],
    };
  } catch (error) {
    console.error("Error fetching theme:", error);
    return {
      success: false,
      error: "Failed to fetch theme",
      theme: CMS_CONFIG.defaultTheme,
    };
  }
}
