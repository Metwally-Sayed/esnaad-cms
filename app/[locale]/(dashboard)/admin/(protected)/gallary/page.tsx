import { R2Gallery } from "@/components/admin/gallery/r2-gallery";
import { getR2Files } from "@/server/actions/r2-gallery";

export default async function GallaryPage() {
  const result = await getR2Files();
  const files = result.success ? result.data : [];

  return (
    <div className="container py-8">
      <R2Gallery files={files} />
    </div>
  );
}
