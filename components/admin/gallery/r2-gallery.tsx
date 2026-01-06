"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Copy,
  ExternalLink,
  FileIcon,
  Filter,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { deleteR2File, type R2File } from "@/server/actions/r2-gallery";
import { uploadFile } from "@/server/actions/upload";
import { toast } from "sonner";

interface R2GalleryProps {
  files: R2File[];
}

export function R2Gallery({ files }: R2GalleryProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Filter files based on search and type
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || file.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group files by type
  const filesByType = {
    all: filteredFiles.length,
    image: filteredFiles.filter((f) => f.type === "image").length,
    video: filteredFiles.filter((f) => f.type === "video").length,
    pdf: filteredFiles.filter((f) => f.type === "pdf").length,
    other: filteredFiles.filter((f) => f.type === "other").length,
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter((file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "application/pdf",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`);
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File size exceeds 10MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setShowUploadDialog(true);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);

        try {
          const result = await uploadFile(formData, "media");
          if (result.success) {
            successCount++;
            toast.success(`✓ ${file.name} uploaded`, { duration: 2000 });
          } else {
            failCount++;
            const errorMsg = result.error || "Unknown error";
            errors.push(`${file.name}: ${errorMsg}`);
            toast.error(`✗ ${file.name}: ${errorMsg}`, { duration: 4000 });
          }
        } catch (error) {
          failCount++;
          const errorMsg = error instanceof Error ? error.message : "Upload failed";
          errors.push(`${file.name}: ${errorMsg}`);
          toast.error(`✗ ${file.name}: ${errorMsg}`, { duration: 4000 });
        }

        // Update progress
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Final summary
      if (successCount > 0) {
        toast.success(`🎉 ${successCount} file(s) uploaded successfully`, { duration: 3000 });
        router.refresh();
      }

      if (failCount > 0) {
        toast.error(`❌ ${failCount} file(s) failed to upload. Check individual errors above.`, {
          duration: 5000
        });
      }

      // Log errors for debugging
      if (errors.length > 0) {
        console.error("Upload errors:", errors);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Upload failed: ${errorMsg}`, { duration: 5000 });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowUploadDialog(false);
      setSelectedFiles([]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (!deleteUrl) return;

    setIsDeleting(true);
    try {
      const result = await deleteR2File(deleteUrl);
      if (result.success) {
        toast.success("File deleted successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete file");
      }
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
      setDeleteUrl(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">R2 Gallery</h1>
          <p className="text-muted-foreground">
            Browse and manage files in your Cloudflare R2 bucket
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="me-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setTypeFilter("all")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filesByType.all}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setTypeFilter("image")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filesByType.image}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setTypeFilter("video")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filesByType.video}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setTypeFilter("pdf")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">PDFs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filesByType.pdf}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setTypeFilter("other")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Other</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filesByType.other}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10"
          />
        </div>
        {typeFilter !== "all" && (
          <Button variant="outline" onClick={() => setTypeFilter("all")}>
            <Filter className="me-2 h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <FileIcon className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No files found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search or filter"
                : "Upload your first file to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file) => (
            <Card key={file.key} className="overflow-hidden">
              {/* File Preview */}
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {file.type === "image" && (
                  <Image
                    src={file.url}
                    alt={file.key}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover"
                  />
                )}
                {file.type === "video" && (
                  <video
                    src={file.url}
                    className="h-full w-full object-cover"
                    controls={false}
                  />
                )}
                {(file.type === "pdf" || file.type === "other") && (
                  <div className="flex h-full items-center justify-center">
                    <FileIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 overflow-hidden">
                    <CardTitle className="truncate text-sm" title={file.key}>
                      {file.key.split("/").pop()}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {formatFileSize(file.size)} • {formatDate(file.lastModified)}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {file.type}
                  </Badge>
                </div>
              </CardHeader>

              {/* Actions */}
              <CardContent className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCopyUrl(file.url)}
                >
                  <Copy className="me-2 h-3 w-3" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="me-2 h-3 w-3" />
                    Open
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteUrl(file.url)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload {selectedFiles.length} file(s) to your R2 bucket
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected Files List */}
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeSelectedFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-center text-sm text-muted-foreground">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDialog(false);
                  setSelectedFiles([]);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUrl} onOpenChange={() => setDeleteUrl(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
