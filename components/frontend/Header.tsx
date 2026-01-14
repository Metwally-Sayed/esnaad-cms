import { NavigationData } from "@/lib/types/navigation";
import { MainHeader } from "@/components/admin/globals/headers/main-header";
import { ResizableHeader } from "@/components/admin/globals/headers/resizable-header";

interface HeaderProps {
  data: NavigationData;
  locale: string;
}

/**
 * Server component for rendering header
 * Determines which header template to use based on header name
 */
export function Header({ data, locale }: HeaderProps) {
  if (!data) {
    return null;
  }

  // Render different header templates based on name
  switch (data.name) {
    case "Resizable Header":
      return <ResizableHeader />;

    case "Default Header":
    default:
      return <MainHeader locale={locale} />;
  }
}
