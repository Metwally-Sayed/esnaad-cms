"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeName, themes } from "@/lib/theme-config";
import { useThemeStore } from "@/store/theme-store";
import { PlusIcon } from "lucide-react";
import { saveTheme } from "@/server/actions/theme";
import { useTransition } from "react";
import { toast } from "sonner";

// Define the main colors for each theme
const themeColors: Record<
  ThemeName,
  {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  }
> = {
  default: {
    primary: "oklch(0.2050 0 0)",
    secondary: "oklch(0.9700 0 0)",
    background: "oklch(1 0 0)",
    accent: "oklch(0.9700 0 0)",
  },
  amber: {
    primary: "oklch(0.7686 0.1647 70.0804)",
    secondary: "oklch(0.9670 0.0029 264.5419)",
    background: "oklch(1.0000 0 0)",
    accent: "oklch(0.9869 0.0214 95.2774)",
  },
  vercel: {
    primary: "oklch(0.0900 0 0)",
    secondary: "oklch(0.9600 0 0)",
    background: "oklch(0.9900 0 0)",
    accent: "oklch(0.9600 0 0)",
  },
  caffeine: {
    primary: "oklch(0.4341 0.0392 41.9938)",
    secondary: "oklch(0.9200 0.0651 74.3695)",
    background: "oklch(0.9821 0 0)",
    accent: "oklch(0.9310 0 0)",
  },
  claude: {
    primary: "oklch(0.6171 0.1375 39.0427)",
    secondary: "oklch(0.9245 0.0138 92.9892)",
    background: "oklch(0.9818 0.0054 95.0986)",
    accent: "oklch(0.9245 0.0138 92.9892)",
  },
  darkmatter: {
    primary: "oklch(0.6716 0.1368 48.5130)",
    secondary: "oklch(0.5360 0.0398 196.0280)",
    background: "oklch(1.0000 0 0)",
    accent: "oklch(0.9491 0 0)",
  },
  fancey: {
    primary: "oklch(0.6641 0.0561 75.0842)",
    secondary: "oklch(0.9198 0.0098 252.8151)",
    background: "oklch(0.9605 0.0046 258.3248)",
    accent: "oklch(0.9003 0.0122 247.9626)",
  },
  whitekoala: {
    primary: "oklch(1.0000 0 0)",
    secondary: "oklch(0.2500 0 0)",
    background: "oklch(0 0 0)",
    accent: "oklch(0.1500 0 0)",
  },
};

const ThemeTable = () => {
  const currentTheme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [isPending, startTransition] = useTransition();

  const handleCheckboxChange = (themeName: ThemeName) => {
    // Apply the selected theme
    setTheme(themeName);
  };

  const handleChangeThemeAction = async (themeName: ThemeName) => {
    startTransition(async () => {
      const result = await saveTheme(themeName);

      if (result.success) {
        toast.success("Theme saved successfully!");
      } else {
        toast.error(result.error || "Failed to save theme");
      }
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-end items-end w-full mb-2 ">
        <Button
          onClick={() => handleChangeThemeAction(currentTheme)}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Apply"}
          <PlusIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Theme Name</TableHead>
            <TableHead>Primary</TableHead>
            <TableHead>Secondary</TableHead>
            <TableHead>Background</TableHead>
            <TableHead>Accent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(themes).map(([key, label]) => {
            const themeName = key as ThemeName;
            const colors = themeColors[themeName];

            return (
              <TableRow key={themeName}>
                <TableCell>
                  <Checkbox
                    checked={currentTheme === themeName}
                    onCheckedChange={() => handleCheckboxChange(themeName)}
                    aria-label={`Select ${label}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{label}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ background: colors.primary }}
                      title={colors.primary}
                    />
                    <span className="text-xs text-muted-foreground hidden lg:inline">
                      {colors.primary.substring(0, 20)}...
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ background: colors.secondary }}
                      title={colors.secondary}
                    />
                    <span className="text-xs text-muted-foreground hidden lg:inline">
                      {colors.secondary.substring(0, 20)}...
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ background: colors.background }}
                      title={colors.background}
                    />
                    <span className="text-xs text-muted-foreground hidden lg:inline">
                      {colors.background.substring(0, 20)}...
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ background: colors.accent }}
                      title={colors.accent}
                    />
                    <span className="text-xs text-muted-foreground hidden lg:inline">
                      {colors.accent.substring(0, 20)}...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ThemeTable;
