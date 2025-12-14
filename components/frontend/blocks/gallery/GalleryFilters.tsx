"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  locale: string;
  currentType?: string;
  availableTypes: string[];
};

export default function GalleryFilters({ locale, currentType, availableTypes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("gallery");

  const handleFilterChange = (type: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    router.push(`/${locale}/gallery${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!currentType ? "default" : "outline"}
        onClick={() => handleFilterChange(null)}
        size="sm"
      >
        {t("filters.all")}
      </Button>

      {availableTypes.map((type) => (
        <Button
          key={type}
          variant={currentType === type ? "default" : "outline"}
          onClick={() => handleFilterChange(type)}
          size="sm"
        >
          {t(`filters.${type}`, { default: type })}
        </Button>
      ))}
    </div>
  );
}
