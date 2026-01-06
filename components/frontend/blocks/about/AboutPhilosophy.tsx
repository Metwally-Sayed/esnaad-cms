import { getPhilosophyItems } from "@/server/actions/collection";
import { AboutPhilosophyClient } from "./AboutPhilosophy.client";

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
  const items = await getPhilosophyItems(content.collectionId);

  if (!items.length) return null;

  return (
    <AboutPhilosophyClient
      className={className}
      content={content}
      items={items}
    />
  );
}
