"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/server/actions/upload";
import { ExternalLink, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MetadataImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  description?: string;
  recommendedSize?: string;
}

export function MetadataImageUpload({
  value,
  onChange,
  label,
  description,
  recommendedSize = "1200x630px",
}: MetadataImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload to R2
      const result = await uploadFile(formData, "metadata");

      if (result.success) {
        if (result.data?.url) {
            setPreviewUrl(result.data.url);
            onChange(result.data.url);
            toast.success("Image uploaded successfully!");
        }
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onChange("");
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-3">
        {/* Image Preview */}
        {previewUrl && (
          <div className="relative w-full rounded-lg border bg-muted overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={() => {
                toast.error("Failed to load image");
                setPreviewUrl("");
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => window.open(previewUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 me-2" />
                View Full
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 me-2" />
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-2">
          <FormControl>
            <div className="relative flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
              />
              <label
                htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Image"}
              </label>
            </div>
          </FormControl>
        </div>

        {/* Manual URL Input */}
        <div className="space-y-2">
          <FormLabel className="text-xs text-muted-foreground">Or enter image URL</FormLabel>
          <FormControl>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={previewUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </FormControl>
        </div>

        {description && (
          <FormDescription>
            {description} {recommendedSize && `Recommended: ${recommendedSize}`}
          </FormDescription>
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
}
