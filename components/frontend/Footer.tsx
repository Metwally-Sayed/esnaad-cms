import { NavigationData } from "@/lib/types/navigation";
import MainFooter from "@/components/admin/globals/footers/main-footer";
import ResizableFooter from "@/components/admin/globals/footers/resizable-footer";

interface FooterProps {
  data: NavigationData;
  locale: string;
}

/**
 * Server component for rendering footer
 * Determines which footer template to use based on footer name
 */
export function Footer({ data, locale }: FooterProps) {
  if (!data) {
    return null;
  }

  const templateProps = {
    links: data.links,
    isLoading: false,
    locale,
  };

  // Render different footer templates based on name
  switch (data.name) {
    case "Resizable Footer":
      return <ResizableFooter {...templateProps} />;

    case "Default Footer":
    default:
      return <MainFooter {...templateProps} />;
  }
}
