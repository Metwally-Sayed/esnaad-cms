export const normalizeSlug = (slug?: string[]) =>
  slug?.length ? `/${slug.join("/")}`.toLowerCase() : "/";
