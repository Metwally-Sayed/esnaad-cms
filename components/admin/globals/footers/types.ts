import type { FooterData } from "@/store/footer-store";

export type FooterListItem = {
  id: string;
  name: string;
  linksCount: number;
  isGlobal: boolean;
  links?: Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
  }>;
};

export interface FooterTemplateProps {
  links?: FooterData["links"];
  isLoading?: boolean;
  locale?: string;
}
