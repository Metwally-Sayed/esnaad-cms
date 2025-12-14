"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  locale: string;
  currentType?: string;
  availableTypes: string[];
};

export default function MediaFilters({ locale, currentType, availableTypes }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("gallery");

  const handleFilterChange = (type: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="container mx-auto px-4">
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
    </div>
  );
}
