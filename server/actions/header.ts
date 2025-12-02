"use server";

import { createNavigationActions } from "@/lib/factories/navigation-factory";
import type { NavigationLinkInput } from "@/lib/types/navigation";

/**
 * Header navigation actions
 * All functionality is provided by the navigation factory
 */
const headerActions = createNavigationActions("header");

export const getGlobalHeader = headerActions.getGlobal;
export const getHeaderById = headerActions.getById;
export const getHeaderForPage = headerActions.getForPage;
export const getAllHeaders = headerActions.getAll;
export const setGlobalHeader = headerActions.setAsGlobal;
export const getCurrentGlobalHeaderId = headerActions.getCurrentGlobalId;
export const createHeader = headerActions.create;
export const deleteHeader = headerActions.delete;

/**
 * Update links for a specific header
 */
export async function updateHeaderLinks(
  headerId: string,
  links: NavigationLinkInput[]
) {
  return headerActions.updateLinks(headerId, links);
}
