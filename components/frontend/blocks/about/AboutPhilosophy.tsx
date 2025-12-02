import { prisma } from "@/lib/prisma";
import { AboutPhilosophyClient } from "./AboutPhilosophy.client";

type PhilosophyItemContent = {
  image?: string;
  title?: string;
  description?: string;
};

type AboutPhilosophyProps = {
  content: {
    collectionId?: string;
    sectionTitle?: string;
    subtitle?: string;
    description?: string;
    itemTextAlign?: "left" | "center" | "right";
    customColors?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
  };
  className?: string;
};

export default async function AboutPhilosophy({
  content,
  className,
}: AboutPhilosophyProps) {
  if (!content.collectionId) {
    return null;
  }

  const collectionItems = await prisma.collectionItem.findMany({
    where: {
      collectionId: content.collectionId,
    },
    orderBy: {
      order: "asc",
    },
  });

  if (!collectionItems.length) {
    return null;
  }

  return (
    <AboutPhilosophyClient
      className={className}
      content={content}
      items={collectionItems.map((item) => item.content as PhilosophyItemContent)}
    />
  );
}
