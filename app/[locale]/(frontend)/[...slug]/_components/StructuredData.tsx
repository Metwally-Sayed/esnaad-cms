import { parseJsonLd } from "../_lib/helpers";

interface StructuredDataProps {
  data: unknown;
}

/**
 * Renders JSON-LD structured data
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = parseJsonLd(data);
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
