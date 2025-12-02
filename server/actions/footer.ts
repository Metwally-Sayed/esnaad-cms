"use server";

import { createNavigationActions } from "@/lib/factories/navigation-factory";
import type { NavigationLinkInput } from "@/lib/types/navigation";

/**
 * Footer navigation actions
 * All functionality is provided by the navigation factory
 */
const footerActions = createNavigationActions("footer");

export const getGlobalFooter = footerActions.getGlobal;
export const getFooterById = footerActions.getById;
export const getFooterForPage = footerActions.getForPage;
export const getAllFooters = footerActions.getAll;
export const setGlobalFooter = footerActions.setAsGlobal;
export const getCurrentGlobalFooterId = footerActions.getCurrentGlobalId;
export const createFooter = footerActions.create;
export const deleteFooter = footerActions.delete;

/**
 * Update links for a specific footer
 */
export async function updateFooterLinks(
  footerId: string,
  links: NavigationLinkInput[]
) {
  return footerActions.updateLinks(footerId, links);
}
