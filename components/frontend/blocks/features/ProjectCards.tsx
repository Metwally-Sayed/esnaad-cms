import { getProjectCards } from "@/server/actions/collection";
import { ProjectCardsClient } from "./ProjectCards.client";

type ProjectCardsContent = {
  sectionTitle?: string;
  collectionId?: string;
};

export default async function ProjectCards({
  content,
  locale,
}: {
  content: ProjectCardsContent;
  locale: string;
}) {
  const cards = await getProjectCards({
    collectionId: content.collectionId,
    locale,
  });

  if (!cards.length) {
    return null;
  }

  return (
    <ProjectCardsClient
      heading={content.sectionTitle}
      cards={cards}
    />
  );
}
