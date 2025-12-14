import { MediaForm } from "@/components/admin/media/media-form";
import { useTranslations } from "next-intl";

export default function CreateMediaPage() {
  const t = useTranslations("Media");

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("createTitle")}</h1>
        <p className="text-muted-foreground">
          {t("createSubtitle")}
        </p>
      </div>
      <MediaForm mode="create" />
    </div>
  );
}
