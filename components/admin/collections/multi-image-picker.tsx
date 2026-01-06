"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/admin/media/media-picker";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useMemo } from "react";
import Image from "next/image";

interface MultiImagePickerProps {
  value: string; // Comma-separated URLs
  onChange: (value: string) => void;
  label?: string;
  maxImages?: number;
}

export function MultiImagePicker({
  value,
  onChange,
  label = "Images",
  maxImages = 10,
}: MultiImagePickerProps) {
  // Derive images array directly from value prop (fully controlled)
  const images = useMemo(() => {
    if (value) {
      return value.split(",").map((url) => url.trim()).filter(Boolean);
    }
    return [];
  }, [value]);

  const updateImages = (newImages: string[]) => {
    onChange(newImages.filter(Boolean).join(","));
  };

  const addImage = () => {
    if (images.length < maxImages) {
      updateImages([...images, ""]);
    }
  };

  const removeImage = (index: number) => {
    updateImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    updateImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {images.length < maxImages && (
          <Button type="button" onClick={addImage} size="sm" variant="outline">
            <Plus className="h-4 w-4 me-1" />
            Add Image
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {images.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
            No images added yet. Click &quot;Add Image&quot; to get started.
          </div>
        )}

        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative border border-border rounded-lg p-4 bg-card"
          >
            <div className="flex items-start gap-4">
              {/* Drag Handle */}
              <div className="mt-8">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="relative w-20 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}

              {/* Image Picker */}
              <div className="flex-1">
                <MediaPicker
                  value={imageUrl}
                  onChange={(url) => updateImage(index, url)}
                  accept="image"
                  label={`Image ${index + 1}`}
                  placeholder="Select or enter image URL..."
                />
              </div>

              {/* Remove Button */}
              <Button
                type="button"
                onClick={() => removeImage(index)}
                size="sm"
                variant="ghost"
                className="mt-6 h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.length} / {maxImages} images added
        </p>
      )}
    </div>
  );
}
