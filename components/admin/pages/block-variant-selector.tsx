"use client";

import { useState } from "react";
import {
  getAllBlockTypes,
  getBlockVariants,
  getVariantDefaults,
  BlockType,
  BlockVariantSchema,
} from "@/lib/block-variants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

interface BlockVariantSelectorProps {
  onSelect: (
    type: BlockType,
    variant: BlockVariantSchema,
    defaultValues: Record<string, unknown>
  ) => void;
  trigger?: React.ReactNode;
}

export default function BlockVariantSelector({
  onSelect,
  trigger,
}: BlockVariantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<BlockType | null>(null);
  const blockTypes = getAllBlockTypes();

  const handleSelectVariant = (variant: BlockVariantSchema) => {
    const defaults = getVariantDefaults(variant.type, variant.id);
    onSelect(variant.type, variant, defaults);
    setOpen(false);
    setSelectedType(null);
  };

  const variants = selectedType ? getBlockVariants(selectedType) : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="me-2 h-4 w-4" />
            Add Block
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selectedType ? `Select ${selectedType} Variant` : "Select Block Type"}
          </DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          // Block Type Selection
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto p-1">
            {blockTypes.map((blockType) => (
              <button
                key={blockType.type}
                onClick={() => setSelectedType(blockType.type)}
                className={cn(
                  "flex flex-col items-start rounded-lg border p-4 text-start transition-colors hover:bg-muted/50",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
              >
                <div className="flex items-center gap-2">
                  {blockType.icon && (
                    <span className="text-xl">{blockType.icon}</span>
                  )}
                  <span className="font-semibold">{blockType.label}</span>
                </div>
                {blockType.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {blockType.description}
                  </p>
                )}
                <Badge variant="secondary" className="mt-2">
                  {blockType.variants.length} variants
                </Badge>
              </button>
            ))}
          </div>
        ) : (
          // Variant Selection
          <div className="flex flex-col gap-4 overflow-y-auto p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType(null)}
              className="w-fit"
            >
              ← Back to types
            </Button>

            <div className="grid gap-3 sm:grid-cols-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleSelectVariant(variant)}
                  className={cn(
                    "flex flex-col items-start rounded-lg border p-4 text-start transition-colors hover:bg-muted/50",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-semibold">{variant.name}</span>
                    <Check className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                  </div>
                  {variant.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {variant.description}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-muted-foreground">
                    {variant.fields.length} fields
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
