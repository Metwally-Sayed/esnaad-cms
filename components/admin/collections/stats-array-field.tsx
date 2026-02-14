"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type ProjectStat = {
  value: string;
  label: string;
  description?: string;
};

interface StatsArrayFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function StatsArrayField({ value, onChange, label = "Stats", required = false }: StatsArrayFieldProps) {
  const createEmptyStat = (): ProjectStat => ({ value: "", label: "", description: "" });

  const [stats, setStats] = useState<ProjectStat[]>(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error("Failed to parse stats JSON:", error);
      }
    }
    return [createEmptyStat()];
  });

  const updateStats = (nextStats: ProjectStat[]) => {
    setStats(nextStats);
    onChange(JSON.stringify(nextStats, null, 2));
  };

  const updateStat = (index: number, updates: Partial<ProjectStat>) => {
    const nextStats = [...stats];
    nextStats[index] = { ...nextStats[index], ...updates };
    updateStats(nextStats);
  };

  const addStat = () => {
    updateStats([...stats, createEmptyStat()]);
  };

  const removeStat = (index: number) => {
    if (stats.length === 1) {
      updateStats([createEmptyStat()]);
      return;
    }
    updateStats(stats.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="ms-1 text-destructive">*</span>}
        </Label>
        <Button type="button" onClick={addStat} size="sm" variant="outline">
          <Plus className="me-1 h-4 w-4" />
          Add Stat
        </Button>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Stat {index + 1}</h4>
              <Button
                type="button"
                onClick={() => removeStat(index)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`stat-${index}-value`} className="text-xs">
                  Value <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`stat-${index}-value`}
                  value={stat.value}
                  onChange={(event) => updateStat(index, { value: event.target.value })}
                  placeholder="e.g., 50, B+G+5+R, 2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`stat-${index}-label`} className="text-xs">
                  Label <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`stat-${index}-label`}
                  value={stat.label}
                  onChange={(event) => updateStat(index, { label: event.target.value })}
                  placeholder="e.g., RESIDENCES"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor={`stat-${index}-description`} className="text-xs">
                Extra Info (optional)
              </Label>
              <Textarea
                id={`stat-${index}-description`}
                value={stat.description || ""}
                onChange={(event) => updateStat(index, { description: event.target.value })}
                placeholder="Optional short line shown under this stat"
                className="min-h-[70px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
