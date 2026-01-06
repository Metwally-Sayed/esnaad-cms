"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getR2Files, type R2File } from "@/server/actions/r2-gallery";
import { uploadFile } from "@/server/actions/upload";
import {
    Check,
    FileIcon,
    Image as ImageIcon,
    Search,
    Upload,
    Video,
    X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: "image" | "video" | "all";
  label?: string;
  placeholder?: string;
}

export function MediaPicker({
  value,
  onChange,
  accept = "all",
  label = "Media",
  placeholder = "Enter URL or select from gallery",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<R2File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<R2File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(value || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files when dialog opens
  useEffect(() => {
    if (open && files.length === 0) {
      loadFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Filter files based on accept prop and search
  useEffect(() => {
    let filtered = files;

    // Filter by type
    if (accept === "image") {
      filtered = filtered.filter((f) => f.type === "image");
    } else if (accept === "video") {
      filtered = filtered.filter((f) => f.type === "video");
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((f) =>
        f.key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  }, [files, accept, searchQuery]);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const result = await getR2Files();
      if (result.success) {
        setFiles(result.data);
      } else {
        toast.error("Failed to load gallery files");
      }
    } catch {
      toast.error("Failed to load gallery files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes =
      accept === "image"
        ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
        : accept === "video"
        ? ["video/mp4"]
        : ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4"];

    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
      return;
    }

    // Validate file size
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadFile(formData, "media");

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast.success("File uploaded successfully");
        if (result.data) {
          setSelectedUrl(result.data.url);
          onChange(result.data.url);
        }
        // Reload gallery files
        await loadFiles();
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelectFromGallery = (file: R2File) => {
    setSelectedUrl(file.url);
    onChange(file.url);
    setOpen(false);
    toast.success("Media selected");
  };

  const handleManualUrlChange = (url: string) => {
    setSelectedUrl(url);
    onChange(url);
  };

  const clearSelection = () => {
    setSelectedUrl("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Current Selection Preview */}
      {selectedUrl && (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
          {selectedUrl.match(/\.(mp4|webm|mov)$/i) ? (
            <video src={selectedUrl} controls className="h-full w-full object-cover" />
          ) : (
            <Image
              src={selectedUrl}
              alt="Selected media"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          )}
          <Button
            size="icon"
            variant="destructive"
            className="absolute end-2 top-2"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Manual URL Input */}
      <div className="flex gap-2">
        <Input
          value={selectedUrl}
          onChange={(e) => handleManualUrlChange(e.target.value)}
          placeholder={placeholder}
          type="url"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              <ImageIcon className="me-2 h-4 w-4" />
              Browse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Media Library</DialogTitle>
              <DialogDescription>
                Upload new media or select from existing files
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="gallery" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="flex-1 overflow-auto mt-4">
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="ps-10"
                    />
                  </div>

                  {/* Files Grid */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">Loading files...</p>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileIcon className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No files found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {filteredFiles.map((file) => (
                        <button
                          key={file.key}
                          type="button"
                          onClick={() => handleSelectFromGallery(file)}
                          className="group relative aspect-video overflow-hidden rounded-lg border bg-muted transition-all hover:ring-2 hover:ring-primary"
                        >
                          {/* Selected Indicator */}
                          {selectedUrl === file.url && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/20">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-6 w-6" />
                              </div>
                            </div>
                          )}

                          {/* File Preview */}
                          {file.type === "image" && (
                            <Image
                              src={file.url}
                              alt={file.key}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          )}
                          {file.type === "video" && (
                            <div className="flex h-full items-center justify-center">
                              <Video className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}

                          {/* File Info */}
                          <div className="absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="truncate text-xs text-white" title={file.key}>
                              {file.key.split("/").pop()}
                            </p>
                          </div>

                          {/* Type Badge */}
                          <Badge className="absolute end-2 top-2" variant="secondary">
                            {file.type}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Upload Tab */}
              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={
                        accept === "image"
                          ? "image/jpeg,image/png,image/gif,image/webp"
                          : accept === "video"
                          ? "video/mp4"
                          : "image/jpeg,image/png,image/gif,image/webp,video/mp4"
                      }
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Upload File</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {accept === "image" && "Upload images (JPEG, PNG, GIF, WebP)"}
                      {accept === "video" && "Upload videos (MP4)"}
                      {accept === "all" && "Upload images or videos"}
                    </p>
                    <p className="text-sm text-muted-foreground">Max size: 10MB</p>
                    <Button
                      type="button"
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Choose File"}
                    </Button>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <p className="text-center text-sm text-muted-foreground">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
