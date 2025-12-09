"use client";

import { getGlobalHeader } from "@/server/actions/header";
import { useHeaderStore } from "@/store/header-store";
import { useEffect } from "react";
import { MainHeader } from "./main-header";
import { ResizableHeader } from "./resizable-header";

export function HeaderRenderer({ locale }: { locale: string }) {
  const { headerData, isLoading, setHeaderData, setIsLoading } =
    useHeaderStore();

  useEffect(() => {
    const fetchHeader = async () => {
      setIsLoading(true);

      const result = await getGlobalHeader();

      if (result.success && result.data) {
        setHeaderData(result.data);
      }

      setIsLoading(false);
    };

    // Only fetch if we don't have data yet
    if (!headerData) {
      fetchHeader();
    }
  }, [headerData, setHeaderData, setIsLoading]);

  // Show nothing while loading
  if (isLoading || !headerData) {
    return null;
  }

  // Render different header components based on header name
  switch (headerData.name) {
    case "Resizable Header":
      return <ResizableHeader />;

    case "Default Header":
    default:
      return <MainHeader locale={locale} />;
  }
}
