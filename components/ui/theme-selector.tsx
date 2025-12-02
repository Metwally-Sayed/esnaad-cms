"use client";

import { useThemeStore } from "@/store/theme-store";
import { themes, ThemeName } from "@/lib/theme-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette } from "lucide-react";

export function ThemeSelector() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const mounted = useThemeStore((state) => state.mounted);

  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Loading...</span>
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as ThemeName)}>
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <SelectValue placeholder="Select theme" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(themes).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
