import { prisma } from "@/lib/prisma";

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
    const rawContent = item.content as Record<string, any>;
    
    // Determine the content based on locale
    let data = rawContent;
    if (rawContent[locale] && typeof rawContent[locale] === 'object') {
        data = rawContent[locale];
    } else if (rawContent['en'] && typeof rawContent['en'] === 'object') {
        data = rawContent['en'];
    }

    // Cast data to expected type after resolution
    const typedData = data as {
      title?: string;
      image?: string;
      slug?: string;
      link?: string;
      actionLabel?: string;
      actionType?: "button" | "link";
    };

    // If there's a slug but no link, generate profile page link
    let finalLink = typedData.link;
    if (!finalLink && typedData.slug) {
      finalLink = `/projects/${typedData.slug}`;
    }

    return {
      title: typedData.title,
      image: typedData.image,
      link: finalLink,
      actionLabel: typedData.actionLabel,
      actionType: typedData.actionType,
    };
  });

  return <ProjectCardsClient heading={content.sectionTitle} cards={cards} />;
}
