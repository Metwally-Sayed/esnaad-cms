"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/components/admin/media/media-picker";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";

type Unit = {
  type: string;
  size: string;
  bathrooms: string;
  price: string;
  image: string;
  features: string[];
};

interface UnitsArrayFieldProps {
  value: string; // JSON string
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function UnitsArrayField({ value, onChange, label = "Units", required = false }: UnitsArrayFieldProps) {
  const createEmptyUnit = (): Unit => ({
    type: "",
    size: "",
    bathrooms: "",
    price: "",
    image: "",
    features: [],
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error("Failed to parse units JSON:", error);
      }
    }
    return [createEmptyUnit()];
  });
  
  const [featuresInput, setFeaturesInput] = useState<Record<number, string>>(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          const featuresMap: Record<number, string> = {};
          parsed.forEach((unit: Unit, index: number) => {
            if (unit.features && Array.isArray(unit.features)) {
              featuresMap[index] = unit.features.join(", ");
            }
          });
          return featuresMap;
        }
      } catch {
        // Already logged in units init
      }
    }
    return {};
  });

  const updateUnits = (newUnits: Unit[]) => {
    setUnits(newUnits);
    onChange(JSON.stringify(newUnits, null, 2));
  };

  const updateUnit = (index: number, field: keyof Unit, val: string | string[]) => {
    const newUnits = [...units];
    if (field === "features") {
      newUnits[index][field] = val as string[];
    } else {
      newUnits[index][field] = val as string;
    }
    updateUnits(newUnits);
  };

  const addUnit = () => {
    updateUnits([...units, createEmptyUnit()]);
  };

  const removeUnit = (index: number) => {
    if (units.length === 1) {
      // Keep at least one unit
      updateUnits([createEmptyUnit()]);
    } else {
      updateUnits(units.filter((_, i) => i !== index));
    }
  };

  const handleFeaturesChange = (index: number, val: string) => {
    setFeaturesInput({ ...featuresInput, [index]: val });
    // Convert comma-separated string to array
    const featuresArray = val
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
    updateUnit(index, "features", featuresArray);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="ms-1 text-destructive">*</span>}
        </Label>
        <Button type="button" onClick={addUnit} size="sm" variant="outline">
          <Plus className="h-4 w-4 me-1" />
          Add Unit
        </Button>
      </div>

      <div className="space-y-6">
        {units.map((unit, index) => (
          <div
            key={index}
            className="relative border border-border rounded-lg p-4 space-y-4 bg-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <h4 className="text-sm font-semibold">
                  Unit {index + 1} {unit.type && `- ${unit.type}`}
                </h4>
              </div>
              <Button
                type="button"
                onClick={() => removeUnit(index)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unit Type */}
              <div className="space-y-2">
                <Label htmlFor={`unit-${index}-type`} className="text-xs">
                  Unit Type <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`unit-${index}-type`}
                  value={unit.type}
                  onChange={(e) => updateUnit(index, "type", e.target.value)}
                  placeholder="e.g., 1 Bedroom, Studio, 2 Bedroom"
                />
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label htmlFor={`unit-${index}-size`} className="text-xs">
                  Size <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`unit-${index}-size`}
                  value={unit.size}
                  onChange={(e) => updateUnit(index, "size", e.target.value)}
                  placeholder="e.g., 750 sq ft, 85 m²"
                />
              </div>

              {/* Bathrooms */}
              <div className="space-y-2">
                <Label htmlFor={`unit-${index}-bathrooms`} className="text-xs">
                  Bathrooms <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`unit-${index}-bathrooms`}
                  value={unit.bathrooms}
                  onChange={(e) => updateUnit(index, "bathrooms", e.target.value)}
                  placeholder="e.g., 1, 2, 1.5"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor={`unit-${index}-price`} className="text-xs">
                  Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`unit-${index}-price`}
                  value={unit.price}
                  onChange={(e) => updateUnit(index, "price", e.target.value)}
                  placeholder="e.g., AED 1.2M, $450K"
                />
              </div>
            </div>

            {/* Image - Full Width */}
            <div className="space-y-2">
              <MediaPicker
                value={unit.image}
                onChange={(url) => updateUnit(index, "image", url)}
                accept="image"
                label="Unit Image"
                placeholder="Select or enter image URL..."
              />
            </div>

            {/* Features - Full Width */}
            <div className="space-y-2">
              <Label htmlFor={`unit-${index}-features`} className="text-xs">
                Features (comma-separated)
              </Label>
              <Textarea
                id={`unit-${index}-features`}
                value={featuresInput[index] || ""}
                onChange={(e) => handleFeaturesChange(index, e.target.value)}
                placeholder="e.g., Balcony, Built-in Wardrobes, En-suite Bathroom"
                className="min-h-[60px]"
              />
              <p className="text-xs text-muted-foreground">
                Separate features with commas. Example: Balcony, Built-in Wardrobes, En-suite Bathroom
              </p>
            </div>
          </div>
        ))}
      </div>

      {units.length === 0 && (
        <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
          No units added yet. Click &quot;Add Unit&quot; to get started.
        </div>
      )}
    </div>
  );
}
