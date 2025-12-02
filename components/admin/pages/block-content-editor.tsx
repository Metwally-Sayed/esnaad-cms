"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAllCollections } from "@/server/actions/collection";

import {
  BlockListField,
  BlockSchemaField,
  createListItemDefaults,
} from "@/lib/block-variants";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { SelectedBlock } from "./types";

interface BlockContentEditorProps {
  block: SelectedBlock;
  onChange: (content: Record<string, unknown>) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const FieldDescription = ({ text }: { text?: string }) => {
  if (!text) {
    return null;
  }
  return <p className="text-xs text-muted-foreground">{text}</p>;
};

const TextField = ({
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) => {
  if (multiline) {
    return (
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
};

const ListField = ({
  field,
  value,
  onChange,
}: {
  field: BlockListField;
  value: unknown;
  onChange: (value: Record<string, unknown>[]) => void;
}) => {
  const items = Array.isArray(value)
    ? value.map((item) => (isRecord(item) ? item : {}))
    : [];

  const minItems = field.minItems ?? 0;
  const canRemove = items.length > minItems;

  const handleAdd = () => {
    const next = [...items, createListItemDefaults(field)];
    onChange(next);
  };

  const handleRemove = (index: number) => {
    const next = items.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleNestedChange = (
    index: number,
    key: string,
    nestedValue: unknown,
  ) => {
    const next = [...items];
    next[index] = {
      ...next[index],
      [key]: nestedValue,
    };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{field.label}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={
            field.maxItems !== undefined && items.length >= field.maxItems
          }
        >
          <Plus className="mr-1 size-4" />
          Add {field.itemLabel ?? "item"}
        </Button>
      </div>
      <FieldDescription text={field.description} />

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No items yet. Start by adding one.
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={`${field.name}-${index}`}
          className="space-y-3 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {(field.itemLabel || "Item") + " " + (index + 1)}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              disabled={!canRemove}
            >
              <Trash2 className="mr-1 size-4" />
              Remove
            </Button>
          </div>

          {field.fields.map((nestedField) => (
            <FieldRenderer
              key={`${field.name}-${nestedField.name}-${index}`}
              field={nestedField}
              value={item?.[nestedField.name]}
              onChange={(nestedValue) =>
                handleNestedChange(index, nestedField.name, nestedValue)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface FieldRendererProps {
  field: BlockSchemaField;
  value: unknown;
  onChange: (value: unknown) => void;
}

const FieldRenderer = ({ field, value, onChange }: FieldRendererProps) => {
  if (field.type === "list") {
    return <ListField field={field} value={value} onChange={onChange} />;
  }

  const resolved =
    typeof value === "string" || typeof value === "number" ? value : "";

  switch (field.type) {
    case "text":
    case "image":
    case "url":
    case "number":
      return (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{field.label}</p>
          <TextField
            value={String(resolved)}
            onChange={(next) => onChange(next)}
            placeholder={field.placeholder}
            multiline={false}
          />
          <FieldDescription text={field.description} />
        </div>
      );
    case "color":
      return (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{field.label}</p>
          <div className="flex gap-2">
            <input
              type="color"
              value={String(resolved) || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border"
            />
            <Input
              value={String(resolved)}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
          <FieldDescription text={field.description} />
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{field.label}</p>
          <TextField
            value={String(resolved)}
            onChange={(next) => onChange(next)}
            placeholder={field.placeholder}
            multiline
          />
          <FieldDescription text={field.description} />
        </div>
      );
    case "select": {
      const stringValue =
        typeof value === "string"
          ? value
          : (field.defaultValue as string) ?? field.options[0]?.value ?? "";
      return (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{field.label}</p>
          <Select value={stringValue} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription text={field.description} />
        </div>
      );
    }
    case "switch": {
      const boolValue =
        typeof value === "boolean"
          ? value
          : Boolean(field.defaultValue ?? false);
      return (
        <label className="flex items-center justify-between rounded-md border px-3 py-2">
          <div>
            <p className="text-sm font-medium">{field.label}</p>
            <FieldDescription text={field.description} />
          </div>
          <Checkbox checked={boolValue} onCheckedChange={(checked) => onChange(Boolean(checked))} />
        </label>
      );
    }
    case "collection-select": {
      const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        getAllCollections().then((result) => {
          if (result.success && result.data) {
            setCollections(result.data);
          }
          setLoading(false);
        });
      }, []);

      const stringValue = typeof value === "string" ? value : "";

      return (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{field.label}</p>
          <Select value={stringValue} onValueChange={onChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading..." : field.placeholder || "Select a collection"} />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription text={field.description} />
        </div>
      );
    }
    default:
      return null;
  }
};

const JsonEditor = ({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) => {
  const [rawValue, setRawValue] = useState(() =>
    JSON.stringify(value ?? {}, null, 2),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setRawValue(JSON.stringify(value ?? {}, null, 2));
      setError(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const handleChange = useCallback(
    (nextValue: string) => {
      setRawValue(nextValue);
      try {
        const parsed = nextValue.trim().length ? JSON.parse(nextValue) : {};
        setError(null);
        onChange(parsed);
      } catch {
        setError("Invalid JSON. Fix the structure to apply changes.");
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-2">
      <Textarea
        value={rawValue}
        onChange={(event) => handleChange(event.target.value)}
        className="font-mono text-xs"
        placeholder='{"title": "Custom block"}'
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

const BlockContentEditor = ({ block, onChange }: BlockContentEditorProps) => {
  const schema = block.schema;
  const safeValues = useMemo(
    () => (isRecord(block.values) ? block.values : {}),
    [block.values],
  );

  const handleFieldChange = (name: string, value: unknown) => {
    onChange({
      ...safeValues,
      [name]: value,
    });
  };

  if (!schema) {
    return <JsonEditor value={safeValues} onChange={onChange} />;
  }

  return (
    <div className="space-y-4">
      {schema.fields.map((field) => {
        // Hide color fields when customColors is false
        const isColorField = field.name === "backgroundColor" || field.name === "titleColor" || field.name === "textColor";
        const customColorsEnabled = safeValues.customColors === true;
        
        if (isColorField && !customColorsEnabled) {
          return null;
        }

        return (
          <FieldRenderer
            key={field.name}
            field={field}
            value={safeValues[field.name]}
            onChange={(next) => handleFieldChange(field.name, next)}
          />
        );
      })}

      <details className="rounded-lg border px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium">
          Advanced JSON
        </summary>
        <p className="mt-2 text-xs text-muted-foreground">
          Use this editor to add bespoke properties that are not yet exposed in
          the visual controls.
        </p>
        <div className="mt-3">
          <JsonEditor value={safeValues} onChange={onChange} />
        </div>
      </details>
    </div>
  );
};

export default BlockContentEditor;
