"use client";

import { useMemo } from "react";
import { ProjectConcept } from "./ProjectConcept";
import { ProjectFloorPlans } from "./ProjectFloorPlans";
import { ProjectHero } from "./ProjectHero";
import { ProjectLocation } from "./ProjectLocation";
import { ProjectStats } from "./ProjectStats";
import { ProjectStickyNav } from "./ProjectStickyNav";
import { ProjectUnits, type UnitType } from "./ProjectUnits";
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
  unitsTitle?: string;
  unitsSubtitle?: string;
  units?: string; // JSON string of UnitType[]
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

  console.log("=== ProjectDetailPage rendering ===");
  console.log("Locale:", locale);
  console.log("Data keys:", Object.keys(data));
  console.log("Title:", data.title);
  console.log("Units raw:", data.units?.substring(0, 100));

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
  const statsArray = useMemo<ProjectStat[]>(() => {
    try {
      return data.stats ? JSON.parse(data.stats) : [];
    } catch (error) {
      console.error("Failed to parse stats:", error);
      return [];
    }
  }, [data.stats]);

  // Parse units JSON string with memoization
  const unitsArray = useMemo<UnitType[]>(() => {
    try {
      return data.units ? JSON.parse(data.units) : [];
    } catch (error) {
      console.error("Failed to parse units:", error);
      return [];
    }
  }, [data.units]);

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
    { id: "location", label: t('location') },
    { id: "amenities", label: t('amenities') }
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
    <div key={locale} className="min-h-screen">
      <ProjectHero
        heroImage={data.heroImage}
        title={data.title}
      />

      {/* Sticky Navigation */}
      <ProjectStickyNav tabs={heroTabs} />

      {/* Tab 1: Concept */}
      <section id="concept">
        <ProjectConcept
          description={data.conceptDescription}
          images={conceptImagesArray}
          architecture={data.architecture}
          features={featuresArray}
          brochureUrl={data.brochureUrl}
          labels={conceptLabels}
        />
      </section>

      {/* Tab 2: Units */}
      <section id="units">
        <ProjectUnits
          title={data.unitsTitle || t('units')}
          subtitle={data.unitsSubtitle}
          units={unitsArray}
        />
      </section>

      {/* Tab 3: Floor Plans */}
      <section id="floor-plans">
        <ProjectFloorPlans floorPlans={floorPlansArray} />
      </section>

      {/* Tab 4: Location */}
      <section id="location">
        <ProjectLocation
          description={data.locationDescription}
          mapEmbedUrl={data.mapEmbedUrl}
          emplacementText={data.emplacementText}
          recreationalText={data.recreationalText}
          videoTourUrl={data.videoTourUrl}
          labels={locationLabels}
        />
      </section>

      {/* Tab 5: Amenities (ProjectStats) */}
      <section id="amenities">
        <ProjectStats stats={statsArray} />
      </section>

      {/* Register Interest Form */}
      <RegisterInterestForm />
    </div>
  );
}
