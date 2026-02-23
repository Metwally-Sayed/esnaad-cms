"use client";

import { useMemo } from "react";
import { ProjectConcept } from "./ProjectConcept";
import { ProjectFloorPlans } from "./ProjectFloorPlans";
import { ProjectHero } from "./ProjectHero";
import { ProjectLocation } from "./ProjectLocation";
import { ProjectStickyNav } from "./ProjectStickyNav";
import { ProjectUnits, type ProjectUnitStat } from "./ProjectUnits";
import { RegisterInterestForm } from "./RegisterInterestForm";

export type ProjectStat = {
  value: string;
  label: string;
  description?: string;
};

export type ProjectData = {
  title: string;
  heroImage: string;
  conceptDescription: string;
  conceptImages: string;
  architecture: string;
  features: string;
  brochureUrl?: string;
  unitsTitle?: string;
  unitsSubtitle?: string;
  unitsOverview?: string;
  floorPlans?: string; // Comma-separated image URLs
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

import { useLocale, useTranslations } from "next-intl";

export function ProjectDetailPage({ data }: ProjectDetailPageProps) {
  const t = useTranslations("Project");
  const locale = useLocale();

  // Memoize parsed data to prevent recreation on every render
  const conceptImagesArray = useMemo(() => {
    return data.conceptImages
      ? data.conceptImages.split(",").map((url) => url.trim())
      : [];
  }, [data.conceptImages]);

  const featuresArray = useMemo(() => {
    return data.features
      ? data.features.split(",").map((f) => f.trim())
      : [];
  }, [data.features]);

  // Parse stats JSON string with memoization
  const statsArray = useMemo<ProjectUnitStat[]>(() => {
    try {
      return data.stats ? JSON.parse(data.stats) : [];
    } catch (error) {
      console.error("Failed to parse stats:", error);
      return [];
    }
  }, [data.stats]);

  // Parse floor plans comma-separated URLs
  const floorPlansArray = useMemo(() => {
    return data.floorPlans
      ? data.floorPlans.split(",").map((url) => url.trim()).filter(Boolean)
      : [];
  }, [data.floorPlans]);

  // Memoize translation labels to prevent recreating objects on every render
  const heroTabs = useMemo(() => [
    { id: "concept", label: t('concept') },
    { id: "units", label: t('units') },
    { id: "floor-plans", label: t('floorPlans') },
    { id: "location", label: t('location') }
  ], [t]);

  const conceptLabels = useMemo(() => ({
    concept: t('concept'),
    architecture: t('architecture'),
    uniqueFeatures: t('uniqueFeatures'),
    downloadBrochure: t('downloadBrochure')
  }), [t]);

  const locationLabels = useMemo(() => ({
    location: t('location'),
    amenities: t('amenities'),
    units: t('units')
  }), [t]);

  return (
    <div key={locale} className="min-h-screen w-full overflow-x-hidden">
      <ProjectHero
        heroImage={data.heroImage}
        title={data.title}
      />

      {/* Sticky Navigation */}
      <ProjectStickyNav tabs={heroTabs} />

      {/* Tab 1: Concept */}
      <div className="w-full overflow-x-hidden">
        <ProjectConcept
          description={data.conceptDescription}
          images={conceptImagesArray}
          architecture={data.architecture}
          features={featuresArray}
          brochureUrl={data.brochureUrl}
          labels={conceptLabels}
        />
      </div>

      {/* Tab 2: Units */}
      <div className="w-full overflow-x-hidden">
        <ProjectUnits
          title={data.unitsTitle || t('units')}
          subtitle={data.unitsSubtitle}
          overview={data.unitsOverview}
          stats={statsArray}
        />
      </div>

      {/* Tab 3: Floor Plans */}
      <div className="w-full overflow-x-hidden">
        <ProjectFloorPlans floorPlans={floorPlansArray} />
      </div>

      {/* Tab 4: Location */}
      <div className="w-full overflow-x-hidden">
        <ProjectLocation
          description={data.locationDescription}
          mapEmbedUrl={data.mapEmbedUrl}
          emplacementText={data.emplacementText}
          recreationalText={data.recreationalText}
          videoTourUrl={data.videoTourUrl}
          labels={locationLabels}
        />
      </div>
      {/* Register Interest Form */}
      <RegisterInterestForm />
    </div>
  );
}
