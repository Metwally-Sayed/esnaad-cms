"use client";

import {
  getAllFooters,
  getCurrentGlobalFooterId,
  getFooterById,
  setGlobalFooter,
  updateFooterLinks,
} from "@/server/actions/footer";
import { NavigationTable } from "@/components/admin/tables/navigation-table";

/**
 * Footers management table
 * Uses the generic NavigationTable component
 */
export default function FootersTable() {
  return (
    <NavigationTable
      type="footer"
      title="Footer"
      getAll={getAllFooters}
      setAsGlobal={setGlobalFooter}
      getCurrentGlobalId={getCurrentGlobalFooterId}
      getById={getFooterById}
      updateLinks={updateFooterLinks}
    />
  );
}
