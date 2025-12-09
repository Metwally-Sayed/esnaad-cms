"use client";

import { useEffect } from "react";

import { getGlobalFooter } from "@/server/actions/footer";
import { useFooterStore } from "@/store/footer-store";
import MainFooter from "./main-footer";
import ResizableFooter from "./resizable-footer";

export function FooterRenderer({ locale }: { locale: string }) {
  const { footerData, isLoading, setFooterData, setIsLoading } =
    useFooterStore();

  useEffect(() => {
    const fetchFooter = async () => {
      setIsLoading(true);

      const result = await getGlobalFooter();

      if (result.success && result.data) {
        setFooterData(result.data);
      }

      setIsLoading(false);
    };

    // Only fetch if we don't have data yet
    if (!footerData) {
      fetchFooter();
    }
  }, [footerData, setFooterData, setIsLoading]);

  // Show nothing while loading
  if (isLoading || !footerData) {
    return null;
  }

  const templateProps = {
    links: footerData.links,
    isLoading,
    locale,
  };

  // Render different header components based on header name
  switch (footerData.name) {
    case "Resizable Footer":
      return <ResizableFooter {...templateProps} />;

    case "Default Footer":
    default:
      return <MainFooter {...templateProps} />;
  }
}
