"use server";

import {
  uploadToR2,
  deleteFromR2,
  generateUniqueFilename,
  generatePresignedUploadUrl,
} from "@/lib/r2-upload";
import type { ActionResponse } from "@/lib/types/action-response";
import { failure, success } from "@/lib/types/action-response";
import { logActionError } from "@/lib/utils/logger";

/**
 * Upload a file to Cloudflare R2 (server-side upload)
 * @param formData - FormData containing the file
 * @param folder - Optional folder in the bucket (default: "media")
 */
export async function uploadFile(
  formData: FormData,
  folder = "media"
): Promise<ActionResponse<{ url: string; filename: string }>> {
  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return failure("No file provided");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return failure(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return failure("File size exceeds 10MB limit");
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const url = await uploadToR2(buffer, filename, file.type, folder);

    return success({ url, filename });
  } catch (error) {
    logActionError("uploadFile", error);
    return failure("Failed to upload file");
  }
}

/**
 * Delete a file from Cloudflare R2
 * @param fileUrl - The full URL of the file to delete
 */
export async function deleteFile(
  fileUrl: string
): Promise<ActionResponse<void>> {
  try {
    await deleteFromR2(fileUrl);
    return success(undefined);
  } catch (error) {
    logActionError("deleteFile", error);
    return failure("Failed to delete file");
  }
}

/**
 * Generate a presigned URL for client-side upload
 * This allows direct upload from the browser to R2 without going through the server
 * @param filename - Original filename
 * @param contentType - MIME type of the file
 * @param folder - Optional folder in the bucket (default: "media")
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder = "media"
): Promise<ActionResponse<{ uploadUrl: string; fileUrl: string; filename: string }>> {
  try {
    // Validate content type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "application/pdf",
    ];

    if (!allowedTypes.includes(contentType)) {
      return failure(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(filename);

    // Generate presigned URL
    const { uploadUrl, fileUrl } = await generatePresignedUploadUrl(
      uniqueFilename,
      contentType,
      folder,
      3600 // 1 hour expiration
    );

    return success({ uploadUrl, fileUrl, filename: uniqueFilename });
  } catch (error) {
    logActionError("getPresignedUploadUrl", error);
    return failure("Failed to generate upload URL");
  }
}
