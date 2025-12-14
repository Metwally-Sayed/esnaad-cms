import { MediaTable } from "@/components/admin/media/media-table";
import { getAllMediaItems } from "@/server/actions/media";

export default async function MediaPage() {
  const result = await getAllMediaItems();
  const items = result.success ? result.data : [];

  return (
    <div className="container py-8">
      <MediaTable items={items} />
    </div>
  );
}
