import { MediaForm } from "@/components/admin/media/media-form";
import { getMediaItemById } from "@/server/actions/media";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

interface EditMediaPageProps {
  params: {
    id: string;
  };
}

export default async function EditMediaPage({ params }: EditMediaPageProps) {
  const t = useTranslations("Media");
  const result = await getMediaItemById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("editTitle")}</h1>
        <p className="text-muted-foreground">
          {t("editSubtitle")}
        </p>
      </div>
      <MediaForm mode="edit" item={result.data} />
    </div>
  );
}
