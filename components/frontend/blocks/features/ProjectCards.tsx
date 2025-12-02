import { prisma } from "@/lib/prisma";

import { ProjectCardsClient } from "./ProjectCards.client";

type ProjectCardsContent = {
  sectionTitle?: string;
  collectionId?: string;
};

export default async function ProjectCards({
  content,
}: {
  content: ProjectCardsContent;
}) {
  if (!content.collectionId) {
    return null;
  }

  const items = await prisma.collectionItem.findMany({
    where: { collectionId: content.collectionId },
    orderBy: { order: "asc" },
  });

  if (!items.length) {
    return null;
  }

  const cards = items.map((item) => {
    const data = item.content as {
      title?: string;
      image?: string;
      slug?: string;
      link?: string;
      actionLabel?: string;
      actionType?: "button" | "link";
    };

    // If there's a slug but no link, generate profile page link
    let finalLink = data.link;
    if (!finalLink && data.slug) {
      finalLink = `/projects/${data.slug}`;
    }

    return {
      title: data.title,
      image: data.image,
      link: finalLink,
      actionLabel: data.actionLabel,
      actionType: data.actionType,
    };
  });

  return <ProjectCardsClient heading={content.sectionTitle} cards={cards} />;
}
