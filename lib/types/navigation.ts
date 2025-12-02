/**
 * Shared types for Header and Footer navigation
 */

export interface NavigationLink {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface NavigationData {
  id: string;
  name: string;
  links: NavigationLink[];
}

export interface NavigationLinkInput {
  id?: string;
  name: string;
  slug: string;
  order: number;
}
