import { getPageBySlugCached } from "@/lib/data/page";
import { getGlobalSeoDefaults } from "@/server/actions/global-settings";

export type PageParams = {
  slug: string[];
  locale: string;
};

export type PageSearchParams = {
  [key: string]: string | string[] | undefined;
};

export type Props = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

// Data types derived from server actions
export type PageData = NonNullable<Awaited<ReturnType<typeof getPageBySlugCached>>>;
export type GlobalDefaults = Awaited<ReturnType<typeof getGlobalSeoDefaults>>["defaults"];

export type AlternateLanguage = {
  lang: string;
  url: string;
};
