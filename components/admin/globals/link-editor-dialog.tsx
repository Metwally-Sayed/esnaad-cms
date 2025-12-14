"use client";

import { getPages } from "@/server/actions/page";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Mock Tabs if not available, but usually it is. I'll check if Tabs exists in ui.
// If not, I'll implement simple state tabs.
// Checking ui list... Tabs is NOT in the list. I will use state.

interface LinkItem {
  id: string; // temp id for key
  name: string;
  slug: string;
  order: number;
}

interface LinkEditorDialogProps {
  title: string;
  trigger: React.ReactNode;
  initialLinks: { name: string; slug: string; order: number }[];
  onSave: (links: { name: string; slug: string; order: number }[]) => Promise<void>;
}

export function LinkEditorDialog({
  title,
  trigger,
  initialLinks,
  onSave,
}: LinkEditorDialogProps) {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [pages, setPages] = useState<{ title: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New link state
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [linkType, setLinkType] = useState<"page" | "custom">("page");

  useEffect(() => {
    if (open) {
      // Load pages
      getPages().then((result) => {
        if (result) {
          setPages(result.map((p) => ({ title: p.title, slug: p.slug })));
        }
      });
      // Initialize links
      setLinks(
        initialLinks.map((l, i) => ({
          id: `existing-${i}`,
          name: l.name,
          slug: l.slug,
          order: l.order,
        }))
      );
    }
  }, [open, initialLinks]);

  const handleAddLink = () => {
    if (!newName || !newSlug) {
      toast.error("Please provide both name and URL/Page");
      return;
    }

    setLinks([
      ...links,
      {
        id: `new-${Date.now()}`,
        name: newName,
        slug: newSlug,
        order: links.length,
      },
    ]);

    setNewName("");
    setNewSlug("");
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;

    const newLinks = [...links];
    const [draggedItem] = newLinks.splice(dragIndex, 1);
    newLinks.splice(dropIndex, 0, draggedItem);
    
    // Update order values
    const reorderedLinks = newLinks.map((link, index) => ({
      ...link,
      order: index,
    }));
    
    setLinks(reorderedLinks);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Re-index orders
      const orderedLinks = links.map((l, index) => ({
        name: l.name,
        slug: l.slug,
        order: index,
      }));
      await onSave(orderedLinks);
      setOpen(false);
      toast.success("Links updated successfully");
    } catch (error) {
      toast.error("Failed to save links");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Manage navigation links. Add, remove, or drag to reorder links.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Link Section */}
          <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
            <h4 className="text-sm font-medium">Add New Link</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. About Us"
                />
              </div>
              <div className="space-y-2">
                <Label>Link Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={linkType === "page" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLinkType("page")}
                    className="flex-1"
                  >
                    Page
                  </Button>
                  <Button
                    type="button"
                    variant={linkType === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLinkType("custom")}
                    className="flex-1"
                  >
                    Custom
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{linkType === "page" ? "Select Page" : "Custom URL"}</Label>
              {linkType === "page" ? (
                <Select
                  value={newSlug}
                  onValueChange={(val) => {
                    setNewSlug(val);
                    // Auto-fill name if empty
                    if (!newName) {
                      const page = pages.find((p) => p.slug === val);
                      if (page) setNewName(page.title);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.slug} value={page.slug}>
                        {page.title} ({page.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="https://..."
                />
              )}
            </div>

            <Button onClick={handleAddLink} className="w-full" variant="secondary">
              <Plus className="me-2 h-4 w-4" /> Add Link
            </Button>
          </div>

          {/* Links List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Current Links (Drag to Reorder)</h4>
            {links.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No links added yet.</p>
            ) : (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div
                    key={link.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="flex items-center gap-3 rounded-md border bg-background p-2 cursor-move hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{link.name}</p>
                      <p className="text-xs text-muted-foreground">{link.slug}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                      onClick={() => handleRemoveLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
