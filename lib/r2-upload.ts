import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "./r2-client";

/**
 * Generate a unique filename with timestamp and random string
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split(".").pop();
  const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, "");
  const sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload a file to Cloudflare R2
 * @param file - The file to upload (Buffer, Blob, or ReadableStream)
 * @param filename - The filename to use in R2
 * @param contentType - MIME type of the file
 * @param folder - Optional folder path in the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  file: Buffer | Blob,
  filename: string,
  contentType: string,
  folder = "media"
): Promise<string> {
  const key = folder ? `${folder}/${filename}` : filename;

  // Convert Blob to Buffer if needed
  const fileBuffer = file instanceof Blob ? Buffer.from(await file.arrayBuffer()) : file;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return the public URL
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Delete a file from Cloudflare R2
 * @param fileUrl - The full URL or key of the file to delete
 */
export async function deleteFromR2(fileUrl: string): Promise<void> {
  // Extract the key from the URL
  const key = fileUrl.replace(`${R2_PUBLIC_URL}/`, "");

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Generate a presigned URL for direct upload from the client
 * @param filename - The filename to use in R2
 * @param contentType - MIME type of the file
 * @param folder - Optional folder path in the bucket
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Object containing the presigned URL and the final file URL
 */
export async function generatePresignedUploadUrl(
  filename: string,
  contentType: string,
  folder = "media",
  expiresIn = 3600
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const key = folder ? `${folder}/${filename}` : filename;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  const fileUrl = `${R2_PUBLIC_URL}/${key}`;

  return { uploadUrl, fileUrl };
}

/**
 * List all objects in R2 bucket
 * @param folder - Optional folder path to list (default: list all)
 * @param maxKeys - Maximum number of objects to return (default: 1000)
 * @returns Array of objects with key, size, lastModified, and public URL
 */
export async function listR2Objects(
  folder?: string,
  maxKeys = 1000
): Promise<Array<{ key: string; size: number; lastModified: Date; url: string; type: string }>> {
  const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");

  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: folder,
    MaxKeys: maxKeys,
  });

  const response = await r2Client.send(command);

  if (!response.Contents) {
    return [];
  }

  return response.Contents.map((obj) => {
    const key = obj.Key || "";
    const extension = key.split(".").pop()?.toLowerCase() || "";

    // Determine file type based on extension
    let type = "other";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      type = "image";
    } else if (["mp4", "webm", "mov", "avi"].includes(extension)) {
      type = "video";
    } else if (["pdf"].includes(extension)) {
      type = "pdf";
    }

    return {
      key,
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
      url: `${R2_PUBLIC_URL}/${key}`,
      type,
    };
  });
}

/**
 * Validate file size and type
 */
export function validateFile(
  file: File,
  maxSizeMB = 10,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4"]
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}
