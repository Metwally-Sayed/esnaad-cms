"use client";

import { ProjectDetailPage, type ProjectData } from "@/components/frontend/project/ProjectDetailPage";

export default function ProjectDetailsBlock({ content }: { content: Record<string, unknown> }) {
  const projectData: ProjectData = {
    title: (content.title as string) || "Untitled Project",
    heroImage: (content.heroImage as string) || "",
    conceptDescription: (content.conceptDescription as string) || "",
    conceptImages: (content.conceptImages as string) || "",
    architecture: (content.architecture as string) || "",
    features: (content.features as string) || "",
    brochureUrl: (content.brochureUrl as string) || undefined,
    unitsTitle: (content.unitsTitle as string) || undefined,
    unitsSubtitle: (content.unitsSubtitle as string) || undefined,
    units: (content.units as string) || undefined,
    floorPlans: (content.floorPlans as string) || undefined,
    locationDescription: (content.locationDescription as string) || "",
    mapEmbedUrl: (content.mapEmbedUrl as string) || "",
    emplacementText: (content.emplacementText as string) || "",
    recreationalText: (content.recreationalText as string) || "",
    videoTourUrl: (content.videoTourUrl as string) || undefined,
    stats: (content.stats as string) || undefined,
  };

  return <ProjectDetailPage data={projectData} />;
}
