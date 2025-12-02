"use client";

import {
  getAllHeaders,
  getCurrentGlobalHeaderId,
  getHeaderById,
  setGlobalHeader,
  updateHeaderLinks,
} from "@/server/actions/header";
import { NavigationTable } from "@/components/admin/tables/navigation-table";

/**
 * Headers management table
 * Uses the generic NavigationTable component
 */
export default function HeadersTable() {
  return (
    <NavigationTable
      type="header"
      title="Header"
      getAll={getAllHeaders}
      setAsGlobal={setGlobalHeader}
      getCurrentGlobalId={getCurrentGlobalHeaderId}
      getById={getHeaderById}
      updateLinks={updateHeaderLinks}
    />
  );
}
