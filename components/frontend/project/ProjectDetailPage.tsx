import { ProjectConcept } from "./ProjectConcept";
import { ProjectFloorPlans } from "./ProjectFloorPlans";
import { ProjectHero } from "./ProjectHero";
import { ProjectLocation } from "./ProjectLocation";
import { ProjectStats } from "./ProjectStats";
import { RegisterInterestForm } from "./RegisterInterestForm";

export type ProjectStat = {
  value: string;
  label: string;
};

export type ProjectData = {
  title: string;
  heroImage: string;
  conceptDescription: string;
  conceptImages: string;
  architecture: string;
  features: string;
  brochureUrl?: string;
  locationDescription: string;
  mapEmbedUrl: string;
  emplacementText: string;
  recreationalText: string;
  videoTourUrl?: string;
  stats?: string; // JSON string of ProjectStat[]
};

type ProjectDetailPageProps = {
  data: ProjectData;
};

export function ProjectDetailPage({ data }: ProjectDetailPageProps) {
  // Parse comma-separated strings into arrays
  const conceptImagesArray = data.conceptImages
    ? data.conceptImages.split(",").map((url) => url.trim())
    : [];

  const featuresArray = data.features
    ? data.features.split(",").map((f) => f.trim())
    : [];

  // Parse stats JSON string
  const statsArray: ProjectStat[] = data.stats
    ? JSON.parse(data.stats)
    : [];

  return (
    <div>
      <ProjectHero heroImage={data.heroImage} title={data.title} />

      <ProjectConcept
        description={data.conceptDescription}
        images={conceptImagesArray}
        architecture={data.architecture}
        features={featuresArray}
        brochureUrl={data.brochureUrl}
      />

      <ProjectLocation
        description={data.locationDescription}
        mapEmbedUrl={data.mapEmbedUrl}
        emplacementText={data.emplacementText}
        recreationalText={data.recreationalText}
        videoTourUrl={data.videoTourUrl}
      />

      <ProjectStats stats={statsArray} />

      <ProjectFloorPlans />

      <RegisterInterestForm />
    </div>
  );
}
