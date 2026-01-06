import { getGlobalSeoDefaults } from "@/server/actions/global-settings";
import { GlobalSeoSettingsForm } from "@/components/admin/globals/global-seo-form";

export default async function GlobalSeoSettingsPage() {
  const result = await getGlobalSeoDefaults();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Global SEO Settings</h1>
        <p className="text-muted-foreground mt-2">
          Set default SEO values that will be used across all pages unless overridden.
        </p>
      </div>

      <GlobalSeoSettingsForm defaults={result.defaults} />
    </div>
  );
}
