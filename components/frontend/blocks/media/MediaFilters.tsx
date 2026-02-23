"use client";

import { MobileChipScroller } from "@/components/frontend/mobile";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  currentType?: string;
  availableTypes: string[];
};

export default function MediaFilters({ currentType, availableTypes }: Props) {
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

  const chipItems = [
    { key: "__all__", label: t("filters.all") },
    ...availableTypes.map((type) => ({
      key: type,
      label: t(`filters.${type}`, { default: type }),
    })),
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="md:hidden">
        <MobileChipScroller
          items={chipItems}
          activeKey={currentType || "__all__"}
          onChange={(key) => handleFilterChange(key === "__all__" ? null : key)}
        />
      </div>

      <div className="hidden flex-wrap gap-2 md:flex">
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
