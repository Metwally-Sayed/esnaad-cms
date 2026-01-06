"use server";

import { listR2Objects, deleteFromR2 } from "@/lib/r2-upload";
import type { ActionResponse } from "@/lib/types/action-response";
import { failure, success } from "@/lib/types/action-response";
import { logActionError } from "@/lib/utils/logger";

export type R2File = {
  key: string;
  size: number;
  lastModified: Date;
  url: string;
  type: "image" | "video" | "pdf" | "other";
};

/**
 * Get all files from R2 bucket
 * @param folder - Optional folder to filter by (e.g., "media")
 */
export async function getR2Files(
  folder?: string
): Promise<ActionResponse<R2File[]>> {
  try {
    const files = await listR2Objects(folder);
    return success(files as R2File[]);
  } catch (error) {
    logActionError("getR2Files", error);
    return failure("Failed to fetch files from R2 bucket");
  }
}

/**
 * Delete a file from R2 bucket
 * @param fileUrl - The full URL or key of the file to delete
 */
export async function deleteR2File(
  fileUrl: string
): Promise<ActionResponse<void>> {
  try {
    await deleteFromR2(fileUrl);
    return success(undefined);
  } catch (error) {
    logActionError("deleteR2File", error);
    return failure("Failed to delete file from R2 bucket");
  }
}
